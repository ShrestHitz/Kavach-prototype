package gov.mospi.sentinel.controller;

import gov.mospi.sentinel.dto.response.ProjectSummaryResponse;
import gov.mospi.sentinel.entity.Project;
import gov.mospi.sentinel.entity.RiskScore;
import gov.mospi.sentinel.exception.ResourceNotFoundException;
import gov.mospi.sentinel.repository.ProjectRepository;
import gov.mospi.sentinel.repository.RiskScoreRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Projects REST controller — CRUD, filters, and risk-based queries.
 */
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "MPLADS project management and querying")
@SecurityRequirement(name = "Bearer Authentication")
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final RiskScoreRepository riskScoreRepository;

    // ── GET /api/projects — paginated list with filters ──────

    @GetMapping
    @Operation(summary = "List projects with optional filters (state, status, category)")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> listProjects(
            @Parameter(description = "Filter by state ID")
            @RequestParam(required = false) Integer stateId,
            @Parameter(description = "Filter by status: IN_PROGRESS, COMPLETED, STALLED, SANCTIONED, CANCELLED")
            @RequestParam(required = false) String status,
            @Parameter(description = "Filter by category ID")
            @RequestParam(required = false) Integer categoryId,
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size (max 100)")
            @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field")
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction")
            @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        size = Math.min(size, 100);
        Sort sort = sortDir.equalsIgnoreCase("ASC")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Project> projectPage = projectRepository.findWithFilters(
                stateId, status, categoryId, pageable);

        List<ProjectSummaryResponse> content = projectPage.getContent()
                .stream().map(this::toSummary).toList();

        return ResponseEntity.ok(Map.of(
            "content",       content,
            "totalElements", projectPage.getTotalElements(),
            "totalPages",    projectPage.getTotalPages(),
            "page",          projectPage.getNumber(),
            "size",          projectPage.getSize(),
            "dataNote",      "DEMO DATA — Synthetic demo projects. Not real government records."
        ));
    }

    // ── GET /api/projects/{id} — single project detail ───────

    @GetMapping("/{id}")
    @Operation(summary = "Get full project detail by ID")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProjectSummaryResponse> getProject(@PathVariable Integer id) {
        Project p = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        return ResponseEntity.ok(toSummary(p));
    }

    // ── GET /api/projects/{id}/risk — risk score detail ──────

    @GetMapping("/{id}/risk")
    @Operation(summary = "Get latest risk score for a project")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getProjectRisk(@PathVariable Integer id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project", id);
        }
        Optional<RiskScore> rs = riskScoreRepository.findLatestByProjectId(id);
        return rs.map(ResponseEntity::ok)
                 .orElse(ResponseEntity.notFound().build());
    }

    // ── GET /api/projects/high-risk — top risk projects ──────

    @GetMapping("/high-risk")
    @Operation(summary = "Get top high-risk and critical projects")
    @PreAuthorize("hasAnyRole('MINISTRY','STATE_NODAL','DISTRICT_AUTH')")
    public ResponseEntity<List<ProjectSummaryResponse>> getHighRiskProjects(
            @RequestParam(defaultValue = "20") int limit) {
        Pageable pageable = PageRequest.of(0, Math.min(limit, 50));
        List<RiskScore> highRisk = riskScoreRepository.findHighRiskProjects(pageable).getContent();
        List<ProjectSummaryResponse> result = highRisk.stream()
                .map(rs -> projectRepository.findById(rs.getProjectId()).map(this::toSummary))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .toList();
        return ResponseEntity.ok(result);
    }

    // ── Mapper ────────────────────────────────────────────────

    private ProjectSummaryResponse toSummary(Project p) {
        Optional<RiskScore> rs = riskScoreRepository.findLatestByProjectId(p.getId());
        return ProjectSummaryResponse.builder()
                .id(p.getId())
                .projectCode(p.getProjectCode())
                .name(p.getName())
                .status(p.getStatus())
                .stateName(p.getState() != null ? p.getState().getName() : null)
                .stateCode(p.getState() != null ? p.getState().getCode() : null)
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .mpName(p.getMp() != null ? p.getMp().getName() : null)
                .sanctionedAmountRs(p.getSanctionedAmountRs())
                .estimatedCostRs(p.getEstimatedCostPaise() != null ? p.getEstimatedCostPaise() / 100.0 : null)
                .totalExpenditureRs(p.getExpenditureRs())
                .utilizationPct(Math.round(p.getUtilizationPct() * 10.0) / 10.0)
                .startDate(p.getStartDate())
                .expectedEndDate(p.getExpectedEndDate())
                .actualEndDate(p.getActualEndDate())
                .riskScore(rs.map(r -> r.getOverallScore().doubleValue()).orElse(null))
                .riskLevel(rs.map(RiskScore::getRiskLevel).orElse(null))
                .riskFlags(java.util.List.of())
                .demoData(p.isDemoData())
                .build();
    }

    /** Lightweight map pins — all projects with location + risk */
    @GetMapping("/map")
    @Operation(summary = "Map pins — lat/lon + risk for all projects")
    public ResponseEntity<List<Map<String, Object>>> getMapPins() {
        List<Object[]> rows = projectRepository.findMapPins();
        List<Map<String, Object>> result = rows.stream().map(r -> {
            Map<String, Object> m = new java.util.LinkedHashMap<>();
            m.put("id",         r[0]);
            m.put("name",       r[1]);
            m.put("latitude",   r[2]);
            m.put("longitude",  r[3]);
            m.put("status",     r[4]);
            m.put("riskLevel",  r[5]);
            m.put("riskScore",  r[6]);
            m.put("stateName",  r[7]);
            return m;
        }).toList();
        return ResponseEntity.ok(result);
    }
}
