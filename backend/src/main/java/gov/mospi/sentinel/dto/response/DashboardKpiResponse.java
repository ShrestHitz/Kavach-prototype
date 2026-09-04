package gov.mospi.sentinel.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

/**
 * Dashboard KPIs DTO — top-level statistics for the ministry view.
 */
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DashboardKpiResponse {
    private long totalProjects;
    private long completedProjects;
    private long inProgressProjects;
    private long stalledProjects;
    private long cancelledProjects;
    private double completionRatePct;

    private double totalSanctionedCrore;
    private double totalExpenditureCrore;
    private double overallUtilizationPct;

    private long highRiskProjects;
    private long criticalProjects;
    private long mediumRiskProjects;
    private long lowRiskProjects;

    private long anomalyProjectsCount;
    private long duplicatePairsCount;
    private long photoIssuesCount;

    // Status distribution for pie chart
    private Map<String, Long> statusDistribution;

    // Risk level distribution for chart
    private Map<String, Long> riskDistribution;

    // Data note
    private String dataNote;
    private String mode;
}
