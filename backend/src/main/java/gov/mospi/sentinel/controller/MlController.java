package gov.mospi.sentinel.controller;

import gov.mospi.sentinel.service.MlServiceClient;
import gov.mospi.sentinel.service.RiskEngineService;
import gov.mospi.sentinel.repository.ProjectRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Proxies ML prediction requests to the FastAPI ML service.
 * Frontend calls /api/ml/* through this controller (JWT-protected).
 */
@RestController
@RequestMapping("/api/ml")
@RequiredArgsConstructor
@Tag(name = "ML Insights", description = "AI/ML predictions and anomaly detection")
@SecurityRequirement(name = "bearerAuth")
public class MlController {

    private final MlServiceClient   mlServiceClient;
    private final RiskEngineService riskEngineService;
    private final ProjectRepository  projectRepository;


    /** Health check — is the ML service up and models loaded? */
    @GetMapping("/health")
    @Operation(summary = "ML service health and model readiness")
    public ResponseEntity<Map<String, Object>> mlHealth() {
        return ResponseEntity.ok(mlServiceClient.getHealth());
    }

    /** Batch anomaly scores for all 558 demo projects. */
    @GetMapping("/anomalies")
    @Operation(summary = "Batch anomaly scores — top anomalous projects")
    public ResponseEntity<Map<String, Object>> batchAnomalies() {
        return ResponseEntity.ok(mlServiceClient.getBatchAnomalyScores());
    }

    /** Single-project delay prediction. */
    @PostMapping("/predict-delay")
    @Operation(summary = "XGBoost delay probability prediction")
    public ResponseEntity<Map<String, Object>> predictDelay(
            @RequestBody Map<String, Object> req) {

        String projectId = (String) req.getOrDefault("project_id", "unknown");
        String category  = String.valueOf(req.getOrDefault("category", "1"));
        String state     = String.valueOf(req.getOrDefault("state", "1"));

        double sanctioned  = toDouble(req.get("sanctioned_amount"));
        double estimated   = toDouble(req.get("estimated_cost"));
        double expenditure = toDouble(req.get("total_expenditure"));
        int    duration    = toInt(req.get("project_duration_days"));
        int    elapsed     = toInt(req.get("elapsed_days"));
        double reported    = toDouble(req.get("reported_progress_pct"));
        double expected    = toDouble(req.get("expected_progress_pct"));
        int    payments    = toInt(req.get("payment_count"));
        double maxPay      = toDouble(req.get("max_single_payment"));

        Map<String, Object> result = mlServiceClient.predictDelay(
                projectId, category, state,
                sanctioned, estimated, expenditure,
                duration, elapsed, reported, expected, payments, maxPay);

        return ResponseEntity.ok(result);
    }

    /** Single-project financial anomaly detection. */
    @PostMapping("/detect-anomaly")
    @Operation(summary = "Isolation Forest financial anomaly detection")
    public ResponseEntity<Map<String, Object>> detectAnomaly(
            @RequestBody Map<String, Object> req) {

        String projectId   = (String) req.getOrDefault("project_id", "unknown");
        double utilization = toDouble(req.get("utilization_pct"));
        double costRatio   = toDouble(req.get("cost_ratio"));
        int    payCount    = toInt(req.get("payment_count"));
        double maxPay      = toDouble(req.get("max_single_payment"));
        double sanctioned  = toDouble(req.get("sanctioned_amount"));
        double progressGap = toDouble(req.get("progress_gap"));

        Map<String, Object> result = mlServiceClient.detectAnomaly(
                projectId, utilization, costRatio, payCount, maxPay, sanctioned, progressGap);

        return ResponseEntity.ok(result);
    }

    // ── helpers ───────────────────────────────────────────────
    private double toDouble(Object o) {
        if (o == null) return 0.0;
        if (o instanceof Number n) return n.doubleValue();
        try { return Double.parseDouble(o.toString()); } catch (Exception e) { return 0.0; }
    }

    private int toInt(Object o) {
        if (o == null) return 0;
        if (o instanceof Number n) return n.intValue();
        try { return Integer.parseInt(o.toString()); } catch (Exception e) { return 0; }
    }

    /** Trigger batch risk scoring for all demo projects (Ministry only). */
    @PostMapping("/score-all")
    @PreAuthorize("hasAnyRole('MINISTRY','ADMIN')")
    @Operation(summary = "Batch-score all projects with the risk engine (Ministry only)")
    public ResponseEntity<Map<String, Object>> scoreAll() {
        Map<String, Object> result = riskEngineService.scoreAllProjects();
        return ResponseEntity.ok(result);
    }

    /** Generate a PDF investigation report for a project. */
    @GetMapping("/reports/{projectId}")
    @Operation(summary = "Generate PDF investigation report via ML service")
    public ResponseEntity<byte[]> generateReport(@PathVariable Long projectId) {
        // Resolve project_code from DB, fall back to numeric ID string
        String projectCode = projectRepository.findById(projectId.intValue())
                .map(p -> p.getProjectCode())
                .orElse(String.valueOf(projectId));
        byte[] pdf = mlServiceClient.generateReportByCode(projectCode);
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=\"report_" + projectCode + ".pdf\"")
                .body(pdf);
    }

    /** Photo verification — proxy multipart to ML service. */
    @PostMapping(value = "/photo/verify", consumes = "multipart/form-data")
    @Operation(summary = "Verify completion photo EXIF GPS + timestamp + hash")
    public ResponseEntity<Map<String, Object>> verifyPhoto(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam("project_code") String projectCode,
            @RequestParam("declared_lat") double declaredLat,
            @RequestParam("declared_lon") double declaredLon,
            @RequestParam("sanction_date") String sanctionDate) {

        Map<String, Object> result = mlServiceClient.verifyPhoto(
                file, projectCode, declaredLat, declaredLon, sanctionDate);
        return ResponseEntity.ok(result);
    }
}

