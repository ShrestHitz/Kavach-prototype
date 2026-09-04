package gov.mospi.sentinel.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Project Category entity (Road, Healthcare, Education, etc.)
 */
@Entity
@Table(name = "project_categories")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class ProjectCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;
}
