package gov.mospi.sentinel.repository;

import gov.mospi.sentinel.entity.RiskScore;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RiskScoreRepository extends JpaRepository<RiskScore, Integer> {

    /** Latest risk score for a project */
    @Query("SELECT r FROM RiskScore r WHERE r.projectId = :pid ORDER BY r.computedAt DESC LIMIT 1")
    Optional<RiskScore> findLatestByProjectId(@Param("pid") Integer projectId);

    /** Used by RiskEngineService — find existing score to update (avoid duplicates) */
    Optional<RiskScore> findTopByProjectIdOrderByComputedAtDesc(Integer projectId);


    /** All risk scores for a project (history) */
    List<RiskScore> findByProjectIdOrderByComputedAtDesc(Integer projectId);

    /** Top N high-risk projects (for dashboard) */
    @Query("""
        SELECT r FROM RiskScore r
        WHERE r.riskLevel IN ('HIGH', 'CRITICAL')
          AND r.computedAt = (
              SELECT MAX(r2.computedAt) FROM RiskScore r2 WHERE r2.projectId = r.projectId
          )
        ORDER BY r.overallScore DESC
    """)
    Page<RiskScore> findHighRiskProjects(Pageable pageable);

    /** Count by risk level */
    long countByRiskLevel(String riskLevel);
}
