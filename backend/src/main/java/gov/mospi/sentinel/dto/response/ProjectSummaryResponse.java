package gov.mospi.sentinel.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

/**
 * Project summary DTO — returned in lists and map views.
 */
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProjectSummaryResponse {
    private Integer id;
    private String projectCode;
    private String name;
    private String status;
    private String stateName;
    private String stateCode;
    private String districtName;
    private String categoryName;
    private String agencyName;
    private String mpName;

    // Financial (in Rupees)
    private Double sanctionedAmountRs;
    private Double estimatedCostRs;
    private Double totalExpenditureRs;
    private Double remainingAmountRs;
    private Double utilizationPct;

    // Dates
    private LocalDate startDate;
    private LocalDate expectedEndDate;
    private LocalDate actualEndDate;
    private Integer daysTodeadline;

    // Location
    private Double latitude;
    private Double longitude;

    // Progress
    private Double reportedProgressPct;
    private Double expectedProgressPct;
    private String progressStatus;
    private Integer delayDays;

    // Risk
    private Double riskScore;
    private String riskLevel;

    // Flags
    private boolean demoData;
    private Integer paymentCount;
    private java.util.List<String> riskFlags;
}
