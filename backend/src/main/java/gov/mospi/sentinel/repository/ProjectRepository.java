package gov.mospi.sentinel.repository;

import gov.mospi.sentinel.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Integer> {

    Page<Project> findByDemoDataTrue(Pageable pageable);

    Page<Project> findByState_IdAndDemoDataTrue(Integer stateId, Pageable pageable);

    Page<Project> findByDistrictIdAndDemoDataTrue(Integer districtId, Pageable pageable);

    Page<Project> findByMp_IdAndDemoDataTrue(Integer mpId, Pageable pageable);

    Page<Project> findByStatusAndDemoDataTrue(String status, Pageable pageable);

    Page<Project> findByCategory_IdAndDemoDataTrue(Integer categoryId, Pageable pageable);

    boolean existsByProjectCode(String projectCode);

    @Query("""
        SELECT p FROM Project p
        WHERE p.demoData = true
          AND (:stateId IS NULL OR p.state.id = :stateId)
          AND (:status IS NULL OR p.status = :status)
          AND (:categoryId IS NULL OR p.category.id = :categoryId)
        ORDER BY p.createdAt DESC
    """)
    Page<Project> findWithFilters(
        @Param("stateId") Integer stateId,
        @Param("status") String status,
        @Param("categoryId") Integer categoryId,
        Pageable pageable
    );

    @Query("""
        SELECT COUNT(p) FROM Project p
        WHERE p.demoData = true AND p.state.id = :stateId
    """)
    long countByStateId(@Param("stateId") Integer stateId);

    @Query("""
        SELECT p.status, COUNT(p) FROM Project p
        WHERE p.demoData = true
        GROUP BY p.status
    """)
    List<Object[]> countByStatus();

    @Query("""
        SELECT p.dataSource, COUNT(p) FROM Project p
        WHERE p.dataSource = 'SYNTHETIC_ANOMALY'
        GROUP BY p.dataSource
    """)
    List<Object[]> countAnomalyProjects();

    @Query(value = """
        SELECT p.id, p.name, pl.latitude, pl.longitude,
               p.status, rs.risk_level, rs.overall_score, s.name
        FROM projects p
        JOIN project_locations pl ON pl.project_id = p.id
        JOIN states s ON s.id = p.state_id
        LEFT JOIN LATERAL (
            SELECT risk_level, overall_score FROM risk_scores
            WHERE project_id = p.id ORDER BY computed_at DESC LIMIT 1
        ) rs ON TRUE
        WHERE p.is_demo_data = TRUE
          AND pl.latitude IS NOT NULL
        LIMIT 600
    """, nativeQuery = true)
    List<Object[]> findMapPins();
}
