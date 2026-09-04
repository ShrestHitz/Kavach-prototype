package gov.mospi.sentinel.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Map;

/**
 * Risk Score entity — AI-computed risk per project.
 */
@Entity
@Table(name = "risk_scores")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class RiskScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "project_id", nullable = false)
    private Integer projectId;

    @Column(name = "overall_score", precision = 5, scale = 2)
    private BigDecimal overallScore;

    @Column(name = "risk_level", length = 20)
    private String riskLevel;  // LOW | MEDIUM | HIGH | CRITICAL

    @Column(name = "financial_score", precision = 5, scale = 2)
    private BigDecimal financialScore;

    @Column(name = "payment_score", precision = 5, scale = 2)
    private BigDecimal paymentScore;

    @Column(name = "delay_score", precision = 5, scale = 2)
    private BigDecimal delayScore;

    @Column(name = "geo_score", precision = 5, scale = 2)
    private BigDecimal geoScore;

    @Column(name = "duplicate_score", precision = 5, scale = 2)
    private BigDecimal duplicateScore;

    @Column(name = "photo_score", precision = 5, scale = 2)
    private BigDecimal photoScore;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "model_versions", columnDefinition = "jsonb")
    private Map<String, Object> modelVersions;

    @Column(name = "computed_by", length = 100)
    private String computedBy;

    @CreationTimestamp
    @Column(name = "computed_at", updatable = false)
    private OffsetDateTime computedAt;
}
