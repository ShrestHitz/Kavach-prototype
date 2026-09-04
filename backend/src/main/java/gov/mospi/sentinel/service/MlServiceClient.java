package gov.mospi.sentinel.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.HashMap;

/**
 * HTTP client calling FastAPI ML service on port 8001.
 * Uses RestTemplate (no extra deps). Graceful fallback if ML is offline.
 */
@Service
@Slf4j
public class MlServiceClient {

    @Value("${ml.service.url:http://localhost:8001}")
    private String mlServiceUrl;

    private final RestTemplate rest = new RestTemplate();

    private HttpHeaders jsonHeaders() {
        HttpHeaders h = new HttpHeaders();
        h.setContentType(MediaType.APPLICATION_JSON);
        return h;
    }

    /** Health check — returns model readiness status. */
    public Map<String, Object> getHealth() {
        try {
            ResponseEntity<Map> resp = rest.getForEntity(mlServiceUrl + "/health/", Map.class);
            return resp.getBody() != null ? resp.getBody() : Map.of("status", "NO_BODY");
        } catch (Exception e) {
            log.warn("ML service health check failed: {}", e.getMessage());
            return Map.of("status", "DOWN", "error", e.getMessage());
        }
    }

    /** XGBoost delay prediction for a project. */
    @SuppressWarnings("unchecked")
    public Map<String, Object> predictDelay(
            String projectId, String category, String state,
            double sanctionedRs, double estimatedCostRs, double expenditureRs,
            int durationDays, int elapsedDays,
            double reportedPct, double expectedPct,
            int paymentCount, double maxPaymentRs) {

        Map<String, Object> body = new HashMap<>();
        body.put("project_id",            projectId);
        body.put("category",              category);
        body.put("state",                 state);
        body.put("sanctioned_amount",     sanctionedRs);
        body.put("estimated_cost",        estimatedCostRs);
        body.put("total_expenditure",     expenditureRs);
        body.put("project_duration_days", durationDays);
        body.put("elapsed_days",          elapsedDays);
        body.put("reported_progress_pct", reportedPct);
        body.put("expected_progress_pct", expectedPct);
        body.put("payment_count",         paymentCount);
        body.put("max_single_payment",    maxPaymentRs);

        try {
            ResponseEntity<Map> resp = rest.exchange(
                    mlServiceUrl + "/api/ml/predict-delay",
                    HttpMethod.POST,
                    new HttpEntity<>(body, jsonHeaders()),
                    Map.class);
            return resp.getBody() != null ? resp.getBody() : Map.of("status", "NO_BODY");
        } catch (Exception e) {
            log.warn("Delay prediction unavailable for {}: {}", projectId, e.getMessage());
            return Map.of("status", "ML_OFFLINE", "project_id", projectId);
        }
    }

    /** Isolation Forest anomaly detection. */
    @SuppressWarnings("unchecked")
    public Map<String, Object> detectAnomaly(
            String projectId,
            double utilizationPct, double costRatio,
            int paymentCount, double maxPaymentRs,
            double sanctionedRs, double progressGap) {

        Map<String, Object> body = new HashMap<>();
        body.put("project_id",         projectId);
        body.put("utilization_pct",    utilizationPct);
        body.put("cost_ratio",         costRatio);
        body.put("payment_count",      paymentCount);
        body.put("max_single_payment", maxPaymentRs);
        body.put("sanctioned_amount",  sanctionedRs);
        body.put("progress_gap",       progressGap);

        try {
            ResponseEntity<Map> resp = rest.exchange(
                    mlServiceUrl + "/api/ml/detect-anomaly",
                    HttpMethod.POST,
                    new HttpEntity<>(body, jsonHeaders()),
                    Map.class);
            return resp.getBody() != null ? resp.getBody() : Map.of("status", "NO_BODY");
        } catch (Exception e) {
            log.warn("Anomaly detection unavailable for {}: {}", projectId, e.getMessage());
            return Map.of("status", "ML_OFFLINE", "project_id", projectId);
        }
    }

    /** Batch anomaly scores — all 558 projects pre-scored. */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getBatchAnomalyScores() {
        try {
            ResponseEntity<Map> resp = rest.getForEntity(
                    mlServiceUrl + "/api/ml/anomaly-batch", Map.class);
            return resp.getBody() != null ? resp.getBody() : Map.of("status", "NO_BODY");
        } catch (Exception e) {
            log.warn("Batch scoring unavailable: {}", e.getMessage());
            return Map.of("status", "ML_OFFLINE", "error", e.getMessage());
        }
    }

    /** Generate PDF investigation report for a project. */
    public byte[] generateReport(Long projectId) {
        return generateReportByCode(String.valueOf(projectId));
    }

    /** Generate PDF by project code string (as ML endpoint uses project_code). */
    public byte[] generateReportByCode(String projectCode) {
        try {
            ResponseEntity<byte[]> resp = rest.getForEntity(
                    mlServiceUrl + "/api/ml/report/" + projectCode, byte[].class);
            return resp.getBody() != null ? resp.getBody() : new byte[0];
        } catch (Exception e) {
            log.warn("Report generation failed for project {}: {}", projectCode, e.getMessage());
            return ("Report generation failed: " + e.getMessage()).getBytes();
        }
    }

    /** Photo verification — proxy multipart/form-data to ML service. */
    @SuppressWarnings("unchecked")
    public Map<String, Object> verifyPhoto(
            org.springframework.web.multipart.MultipartFile file,
            String projectCode, double declaredLat, double declaredLon, String sanctionDate) {
        try {
            org.springframework.util.LinkedMultiValueMap<String, Object> body = new org.springframework.util.LinkedMultiValueMap<>();
            body.add("file",          new org.springframework.core.io.ByteArrayResource(file.getBytes()) {
                @Override public String getFilename() { return file.getOriginalFilename(); }
            });
            body.add("project_code",  projectCode);
            body.add("declared_lat",  String.valueOf(declaredLat));
            body.add("declared_lon",  String.valueOf(declaredLon));
            body.add("sanction_date", sanctionDate);

            HttpHeaders h = new HttpHeaders();
            h.setContentType(MediaType.MULTIPART_FORM_DATA);
            ResponseEntity<Map> resp = rest.exchange(
                    mlServiceUrl + "/api/ml/verify-photo-upload",
                    HttpMethod.POST,
                    new HttpEntity<>(body, h),
                    Map.class);
            return resp.getBody() != null ? resp.getBody() : Map.of("status", "NO_BODY");
        } catch (Exception e) {
            log.warn("Photo verification unavailable: {}", e.getMessage());
            return Map.of("status", "ML_OFFLINE", "error", e.getMessage());
        }
    }
}
