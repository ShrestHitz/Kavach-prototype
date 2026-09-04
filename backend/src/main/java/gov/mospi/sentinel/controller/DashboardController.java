package gov.mospi.sentinel.controller;

import gov.mospi.sentinel.dto.response.DashboardKpiResponse;
import gov.mospi.sentinel.repository.ProjectRepository;
import gov.mospi.sentinel.repository.RiskScoreRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Dashboard KPI controller — top-level metrics for the ministry home page.
 * Ministry: full national view | State Nodal: state-scoped
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "KPIs, statistics, and summary metrics")
@SecurityRequirement(name = "Bearer Authentication")
public class DashboardController {

    private final ProjectRepository projectRepository;
    private final RiskScoreRepository riskScoreRepository;

    @GetMapping("/kpis")
    @Operation(summary = "Get national dashboard KPIs")
    @PreAuthorize("hasAnyRole('MINISTRY','STATE_NODAL','DISTRICT_AUTH')")
    public ResponseEntity<DashboardKpiResponse> getKpis() {

        // Project counts by status
        List<Object[]> statusCounts = projectRepository.countByStatus();
        Map<String, Long> statusDist = new HashMap<>();
        long total = 0, completed = 0, inProgress = 0, stalled = 0, cancelled = 0;
        for (Object[] row : statusCounts) {
            String status = (String) row[0];
            Long count = (Long) row[1];
            statusDist.put(status, count);
            total += count;
            switch (status) {
                case "COMPLETED"    -> completed   = count;
                case "IN_PROGRESS"  -> inProgress  = count;
                case "STALLED"      -> stalled     = count;
                case "CANCELLED"    -> cancelled   = count;
            }
        }

        // Risk distribution
        long critical = riskScoreRepository.countByRiskLevel("CRITICAL");
        long high     = riskScoreRepository.countByRiskLevel("HIGH");
        long medium   = riskScoreRepository.countByRiskLevel("MEDIUM");
        long low      = riskScoreRepository.countByRiskLevel("LOW");
        Map<String, Long> riskDist = Map.of(
            "CRITICAL", critical, "HIGH", high,
            "MEDIUM", medium, "LOW", low
        );

        // Financial totals
        List<Object[]> allProjects = projectRepository.findAll().stream()
            .map(p -> new Object[]{ p.getSanctionedAmountPaise(), p.getTotalExpenditurePaise() })
            .toList();
        double totalSanctioned = allProjects.stream()
            .mapToDouble(r -> r[0] != null ? ((Long) r[0]) / 1e9 : 0).sum(); // in crore
        double totalExpenditure = allProjects.stream()
            .mapToDouble(r -> r[1] != null ? ((Long) r[1]) / 1e9 : 0).sum();

        double completionRate = total > 0 ? (completed * 100.0 / total) : 0;
        double utilizationRate = totalSanctioned > 0
            ? (totalExpenditure * 100.0 / totalSanctioned) : 0;

        return ResponseEntity.ok(DashboardKpiResponse.builder()
            .totalProjects(total)
            .completedProjects(completed)
            .inProgressProjects(inProgress)
            .stalledProjects(stalled)
            .cancelledProjects(cancelled)
            .completionRatePct(Math.round(completionRate * 10.0) / 10.0)
            .totalSanctionedCrore(Math.round(totalSanctioned * 100.0) / 100.0)
            .totalExpenditureCrore(Math.round(totalExpenditure * 100.0) / 100.0)
            .overallUtilizationPct(Math.round(utilizationRate * 10.0) / 10.0)
            .criticalProjects(critical)
            .highRiskProjects(high + critical)
            .mediumRiskProjects(medium)
            .lowRiskProjects(low)
            .statusDistribution(statusDist)
            .riskDistribution(riskDist)
            .mode("DEMO")
            .dataNote("⚠ DEMO DATA — Synthetic projects for demonstration purposes only. Not real government records.")
            .build());
    }

    /** Alias — /summary maps to the same KPI response */
    @GetMapping("/summary")
    @Operation(summary = "Dashboard summary (alias for /kpis)")
    @PreAuthorize("hasAnyRole('MINISTRY','STATE_NODAL','DISTRICT_AUTH')")
    public ResponseEntity<DashboardKpiResponse> getSummary() {
        return getKpis();
    }

    /** Risk distribution for chart — extracted subset */
    @GetMapping("/risk-distribution")
    @Operation(summary = "Risk level distribution")
    @PreAuthorize("hasAnyRole('MINISTRY','STATE_NODAL','DISTRICT_AUTH')")
    public ResponseEntity<Map<String, Object>> riskDistribution() {
        long critical = riskScoreRepository.countByRiskLevel("CRITICAL");
        long high     = riskScoreRepository.countByRiskLevel("HIGH");
        long medium   = riskScoreRepository.countByRiskLevel("MEDIUM");
        long low      = riskScoreRepository.countByRiskLevel("LOW");
        return ResponseEntity.ok(Map.of(
            "CRITICAL", critical, "HIGH", high, "MEDIUM", medium, "LOW", low
        ));
    }

    /** Status distribution for chart — extracted subset */
    @GetMapping("/status-distribution")
    @Operation(summary = "Project status distribution")
    @PreAuthorize("hasAnyRole('MINISTRY','STATE_NODAL','DISTRICT_AUTH')")
    public ResponseEntity<Map<String, Long>> statusDistribution() {
        List<Object[]> rows = projectRepository.countByStatus();
        Map<String, Long> dist = new HashMap<>();
        for (Object[] row : rows) dist.put((String) row[0], (Long) row[1]);
        return ResponseEntity.ok(dist);
    }
}

