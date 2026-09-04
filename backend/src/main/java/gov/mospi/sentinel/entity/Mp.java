package gov.mospi.sentinel.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

/**
 * MP (Member of Parliament) entity.
 * Seeded from the real government dataset provided by MoSPI.
 */
@Entity
@Table(name = "mps")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Mp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "state_id")
    private State state;

    @Column(name = "state_name", length = 100)
    private String stateName;

    @Column(name = "mp_type", length = 30)
    private String mpType;  // ELECTED | NOMINATED

    @Column(name = "term_start_year")
    private Integer termStartYear;

    @Column(name = "term_end_year")
    private Integer termEndYear;

    @Column(name = "allocated_amount_paise")
    private Long allocatedAmountPaise;

    @Column(name = "is_active")
    private boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    public double getAllocatedAmountRs() {
        return allocatedAmountPaise == null ? 0 : allocatedAmountPaise / 100.0;
    }
}
