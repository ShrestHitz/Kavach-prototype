package gov.mospi.sentinel.service;

import gov.mospi.sentinel.entity.Project;
import gov.mospi.sentinel.entity.RiskScore;
import gov.mospi.sentinel.repository.ProjectRepository;
import gov.mospi.sentinel.repository.RiskScoreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

/**
 * Central Risk Engine — combines ML signals + rule-based signals
 * into a single 0–100 overall risk score per project.
 *
 * Score composition:
 *   40% — Financial anomaly (Isolation Forest normalized score)
 *   35% — Delay probability (XGBoost probability × 100)
 *   25% — Rule-based signals (cost overrun ratio, progress gap, stalled status)
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class RiskEngineService {

    private final ProjectRepository     projectRepository;
    private final RiskScoreRepository   riskScoreRepository;
    private final MlServiceClient       mlServiceClient;

    /** Score a single project and persist the result. */
    @Transactional
    public RiskScore scoreProject(Project p) {
        double sanctioned  = p.getSanctionedAmountRs();
        double estimated   = p.getEstimatedCostPaise() != null
                ? p.getEstimatedCostPaise() / 100.0 : sanctioned;
        double expenditure = p.getExpenditureRs();

        if (sanctioned <= 0) sanctioned = 1.0;

        double utilizationPct = Math.min(expenditure / sanctioned * 100, 300);
        double costRatio      = Math.min(estimated / sanctioned, 5.0);
        int    payCount       = 0;  // simplified — full version queries payments table
        double maxPayment     = 0.0;

        // ── Rule-based score (0–100) ──────────────────────────
        double ruleScore = 0.0;

        // Cost overrun signal
        if (costRatio > 1.5)  ruleScore += 40;
        else if (costRatio > 1.2) ruleScore += 20;
        else if (costRatio > 1.0) ruleScore += 8;

        // Stalled projects
        if ("STALLED".equals(p.getStatus())) ruleScore += 30;

        // Fund over-utilization (possible misuse)
        if (utilizationPct > 100) ruleScore += 20;

        // Duration exceeded
        if (p.getExpectedEndDate() != null && p.getActualEndDate() == null) {
            long overdue = ChronoUnit.DAYS.between(p.getExpectedEndDate(), LocalDate.now());
            if (overdue > 180) ruleScore += 25;
            else if (overdue > 90) ruleScore += 15;
            else if (overdue > 30) ruleScore += 8;
        }

        ruleScore = Math.min(ruleScore, 100.0);

        // ── ML anomaly score ──────────────────────────────────
        double anomalyScore = 0.0;
        String anomalyLabel = "NORMAL";
        List<String> mlFlags = new ArrayList<>();

        Map<String, Object> anomalyResult = mlServiceClient.detectAnomaly(
                String.valueOf(p.getId()),
                utilizationPct, costRatio, payCount, maxPayment,
                sanctioned, 0.0);  // progress_gap = 0 if no progress data

        if (!"ML_OFFLINE".equals(anomalyResult.get("status"))) {
            Object scoreObj = anomalyResult.get("anomaly_score_normalized");
            Object labelObj = anomalyResult.get("anomaly_label");
            Object flagsObj = anomalyResult.get("flags");
            if (scoreObj instanceof Number n) anomalyScore = n.doubleValue();
            if (labelObj instanceof String s) anomalyLabel = s;
            if (flagsObj instanceof List<?> list) {
                list.forEach(f -> mlFlags.add(f.toString()));
            }
        }

        // ── Delay score (rule-based fallback if ML offline) ───
        double delayScore = 0.0;
        if (p.getExpectedEndDate() != null && p.getActualEndDate() == null) {
            long overdue = ChronoUnit.DAYS.between(p.getExpectedEndDate(), LocalDate.now());
            delayScore = Math.min(Math.max(overdue / 3.0, 0), 100);
        }

        // ── Composite score ───────────────────────────────────
        double overall = (anomalyScore * 0.40)
                + (delayScore * 0.35)
                + (ruleScore  * 0.25);
        overall = Math.min(Math.round(overall), 100);

        String riskLevel = overall >= 75 ? "CRITICAL"
                : overall >= 55 ? "HIGH"
                : overall >= 35 ? "MEDIUM"
                : "LOW";

        // ── Build score components ────────────────────────────
        Map<String, Object> components = new LinkedHashMap<>();
        components.put("financial_anomaly_score",  Math.round(anomalyScore));
        components.put("delay_score",              Math.round(delayScore));
        components.put("rule_based_score",         Math.round(ruleScore));
        components.put("anomaly_label",            anomalyLabel);
        components.put("ml_flags",                 mlFlags);
        components.put("cost_ratio",               Math.round(costRatio * 100.0) / 100.0);
        components.put("utilization_pct",          Math.round(utilizationPct * 10.0) / 10.0);

        // ── Persist ───────────────────────────────────────────
        RiskScore rs = riskScoreRepository.findTopByProjectIdOrderByComputedAtDesc(p.getId())
                .orElse(new RiskScore());

        rs.setProjectId(p.getId());
        rs.setOverallScore(BigDecimal.valueOf(overall));
        rs.setFinancialScore(BigDecimal.valueOf(anomalyScore).setScale(1, RoundingMode.HALF_UP));
        rs.setDelayScore(BigDecimal.valueOf(delayScore).setScale(1, RoundingMode.HALF_UP));
        rs.setRiskLevel(riskLevel);
        rs.setModelVersions(Map.of("engine", "IsolationForest+RuleBased", "version", "1.0.0"));
        rs.setComputedBy("sentinel-risk-engine");

        riskScoreRepository.save(rs);
        return rs;
    }

    /** Score all demo projects in batch (background-safe). */
    @Transactional
    public Map<String, Object> scoreAllProjects() {
        log.info("Starting batch risk scoring for all demo projects...");
        long start = System.currentTimeMillis();

        // Use the ML batch endpoint first (faster — one DB query in Python)
        Map<String, Object> batchResult = mlServiceClient.getBatchAnomalyScores();
        boolean mlAvailable = !"ML_OFFLINE".equals(batchResult.get("status"));

        List<Project> projects = projectRepository.findByDemoDataTrue(
                org.springframework.data.domain.Pageable.unpaged()).getContent();

        int scored = 0, errors = 0;
        for (Project p : projects) {
            try {
                scoreProject(p);
                scored++;
            } catch (Exception e) {
                log.warn("Failed to score project {}: {}", p.getProjectCode(), e.getMessage());
                errors++;
            }
        }

        long elapsed = System.currentTimeMillis() - start;
        log.info("Batch scoring complete: {} scored, {} errors in {}ms", scored, errors, elapsed);

        return Map.of(
                "scored",       scored,
                "errors",       errors,
                "duration_ms",  elapsed,
                "ml_available", mlAvailable,
                "mode",         "DEMO"
        );
    }
}
