package gov.mospi.sentinel.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;

/**
 * Project entity — the core entity of MPLADS Sentinel.
 * Maps to the 'projects' table (created by 01_schema.sql).
 */
@Entity
@Table(name = "projects")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "project_code", unique = true, nullable = false, length = 50)
    private String projectCode;

    @Column(nullable = false, length = 500)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mp_id")
    private Mp mp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "state_id", nullable = false)
    private State state;

    @Column(name = "district_id")
    private Integer districtId;

    @Column(name = "constituency_id")
    private Integer constituencyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private ProjectCategory category;

    @Column(name = "agency_id")
    private Integer agencyId;

    @Column(length = 30)
    private String status;

    @Column(name = "sanctioned_amount_paise")
    private Long sanctionedAmountPaise;

    @Column(name = "estimated_cost_paise")
    private Long estimatedCostPaise;

    @Column(name = "total_expenditure_paise")
    private Long totalExpenditurePaise;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "expected_end_date")
    private LocalDate expectedEndDate;

    @Column(name = "actual_end_date")
    private LocalDate actualEndDate;

    @Column(name = "is_demo_data")
    private boolean demoData;

    @Column(name = "data_source", length = 100)
    private String dataSource;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    // ── Convenience helpers ──────────────────────────────────

    public double getUtilizationPct() {
        if (sanctionedAmountPaise == null || sanctionedAmountPaise == 0) return 0;
        return (totalExpenditurePaise == null ? 0 : totalExpenditurePaise)
               * 100.0 / sanctionedAmountPaise;
    }

    public double getSanctionedAmountRs() {
        return sanctionedAmountPaise == null ? 0 : sanctionedAmountPaise / 100.0;
    }

    public double getExpenditureRs() {
        return totalExpenditurePaise == null ? 0 : totalExpenditurePaise / 100.0;
    }
}
