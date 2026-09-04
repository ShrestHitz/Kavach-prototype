-- ============================================================
-- MPLADS Sentinel — Useful Views
-- Run AFTER 03_seed_users.sql
-- ============================================================

-- ── View: project summary with risk and location ──────────
CREATE OR REPLACE VIEW v_project_summary AS
SELECT
    p.id,
    p.project_code,
    p.name,
    p.status,
    p.is_demo_data,
    s.name                              AS state_name,
    s.code                              AS state_code,
    d.name                              AS district_name,
    pc.name                             AS category_name,
    ia.name                             AS agency_name,
    mp.name                             AS mp_name,

    -- Financial (display in Rupees)
    ROUND(p.sanctioned_amount_paise / 100.0, 2)     AS sanctioned_amount_rs,
    ROUND(p.estimated_cost_paise / 100.0, 2)        AS estimated_cost_rs,
    ROUND(p.total_expenditure_paise / 100.0, 2)     AS total_expenditure_rs,
    ROUND((p.sanctioned_amount_paise - p.total_expenditure_paise) / 100.0, 2)
                                                     AS remaining_amount_rs,
    ROUND(
        CASE WHEN p.sanctioned_amount_paise > 0
             THEN (p.total_expenditure_paise::NUMERIC / p.sanctioned_amount_paise) * 100
             ELSE 0 END, 2
    )                                               AS utilization_pct,

    -- Dates
    p.start_date,
    p.expected_end_date,
    p.actual_end_date,
    (p.expected_end_date - CURRENT_DATE)            AS days_to_deadline,

    -- Location
    pl.latitude,
    pl.longitude,
    pl.address,

    -- Progress
    pp.reported_progress_pct,
    pp.expected_progress_pct,
    pp.progress_gap_pct,
    pp.progress_status,
    pp.delay_days,

    -- Risk
    rs.overall_score                    AS risk_score,
    rs.risk_level,
    rs.financial_score,
    rs.payment_score,
    rs.delay_score,
    rs.geo_score,
    rs.duplicate_score,
    rs.photo_score,
    rs.computed_at                      AS risk_computed_at

FROM projects p
JOIN states s           ON s.id = p.state_id
LEFT JOIN districts d   ON d.id = p.district_id
JOIN project_categories pc ON pc.id = p.category_id
LEFT JOIN implementing_agencies ia ON ia.id = p.agency_id
LEFT JOIN mps mp        ON mp.id = p.mp_id
LEFT JOIN project_locations pl ON pl.project_id = p.id
LEFT JOIN LATERAL (
    SELECT * FROM project_progress
    WHERE project_id = p.id
    ORDER BY report_date DESC LIMIT 1
) pp ON TRUE
LEFT JOIN LATERAL (
    SELECT * FROM risk_scores
    WHERE project_id = p.id
    ORDER BY computed_at DESC LIMIT 1
) rs ON TRUE;

-- ── View: dashboard KPIs ──────────────────────────────────
CREATE OR REPLACE VIEW v_dashboard_kpis AS
SELECT
    COUNT(*)                                                        AS total_projects,
    COUNT(*) FILTER (WHERE status = 'COMPLETED')                    AS completed_projects,
    COUNT(*) FILTER (WHERE status = 'IN_PROGRESS')                  AS in_progress_projects,
    COUNT(*) FILTER (WHERE status = 'STALLED')                      AS stalled_projects,
    ROUND(
        COUNT(*) FILTER (WHERE status = 'COMPLETED')::NUMERIC
        / NULLIF(COUNT(*), 0) * 100, 1
    )                                                               AS completion_rate_pct,
    ROUND(SUM(sanctioned_amount_paise) / 1e9, 2)                    AS total_sanctioned_cr,
    ROUND(SUM(total_expenditure_paise) / 1e9, 2)                    AS total_expenditure_cr,
    COUNT(*) FILTER (WHERE rs.risk_level IN ('HIGH','CRITICAL'))    AS high_risk_projects,
    COUNT(*) FILTER (WHERE rs.risk_level = 'CRITICAL')              AS critical_projects
FROM projects p
LEFT JOIN LATERAL (
    SELECT risk_level FROM risk_scores
    WHERE project_id = p.id
    ORDER BY computed_at DESC LIMIT 1
) rs ON TRUE
WHERE p.is_demo_data = TRUE;

-- ── View: state performance ────────────────────────────────
CREATE OR REPLACE VIEW v_state_performance AS
SELECT
    s.id                                                            AS state_id,
    s.name                                                          AS state_name,
    s.code                                                          AS state_code,
    COUNT(p.id)                                                     AS total_projects,
    COUNT(p.id) FILTER (WHERE p.status = 'COMPLETED')              AS completed,
    COUNT(p.id) FILTER (WHERE p.status = 'STALLED')                AS stalled,
    ROUND(
        COUNT(p.id) FILTER (WHERE p.status = 'COMPLETED')::NUMERIC
        / NULLIF(COUNT(p.id), 0) * 100, 1
    )                                                               AS completion_rate_pct,
    ROUND(SUM(p.sanctioned_amount_paise) / 1e7, 2)                 AS total_sanctioned_lakh,
    ROUND(SUM(p.total_expenditure_paise) / 1e7, 2)                 AS total_expenditure_lakh,
    COUNT(p.id) FILTER (WHERE rs.risk_level IN ('HIGH','CRITICAL')) AS high_risk_count,
    ROUND(AVG(rs.overall_score), 1)                                 AS avg_risk_score
FROM states s
LEFT JOIN projects p ON p.state_id = s.id AND p.is_demo_data = TRUE
LEFT JOIN LATERAL (
    SELECT overall_score, risk_level FROM risk_scores
    WHERE project_id = p.id ORDER BY computed_at DESC LIMIT 1
) rs ON TRUE
GROUP BY s.id, s.name, s.code
ORDER BY high_risk_count DESC, avg_risk_score DESC;

-- ── View: risk distribution ────────────────────────────────
CREATE OR REPLACE VIEW v_risk_distribution AS
SELECT
    rs.risk_level,
    COUNT(*)                AS project_count,
    ROUND(AVG(rs.overall_score), 1) AS avg_score,
    ROUND(MIN(rs.overall_score), 1) AS min_score,
    ROUND(MAX(rs.overall_score), 1) AS max_score
FROM risk_scores rs
JOIN projects p ON p.id = rs.project_id AND p.is_demo_data = TRUE
WHERE rs.computed_at = (
    SELECT MAX(computed_at) FROM risk_scores r2 WHERE r2.project_id = rs.project_id
)
GROUP BY rs.risk_level
ORDER BY
    CASE rs.risk_level
        WHEN 'CRITICAL' THEN 1
        WHEN 'HIGH' THEN 2
        WHEN 'MEDIUM' THEN 3
        WHEN 'LOW' THEN 4
    END;

-- ── View: map data (lightweight for Leaflet) ──────────────
CREATE OR REPLACE VIEW v_map_projects AS
SELECT
    p.id,
    p.project_code,
    p.name,
    p.status,
    pc.name             AS category,
    s.name              AS state_name,
    pl.latitude,
    pl.longitude,
    rs.overall_score    AS risk_score,
    rs.risk_level,
    ROUND(p.sanctioned_amount_paise / 1e7, 2) AS sanctioned_lakh,
    pp.reported_progress_pct
FROM projects p
JOIN states s ON s.id = p.state_id
JOIN project_categories pc ON pc.id = p.category_id
JOIN project_locations pl ON pl.project_id = p.id
LEFT JOIN LATERAL (
    SELECT overall_score, risk_level FROM risk_scores
    WHERE project_id = p.id ORDER BY computed_at DESC LIMIT 1
) rs ON TRUE
LEFT JOIN LATERAL (
    SELECT reported_progress_pct FROM project_progress
    WHERE project_id = p.id ORDER BY report_date DESC LIMIT 1
) pp ON TRUE
WHERE p.is_demo_data = TRUE
  AND pl.latitude IS NOT NULL
  AND pl.longitude IS NOT NULL;

DO $$ BEGIN
    RAISE NOTICE 'Views created: v_project_summary, v_dashboard_kpis, v_state_performance, v_risk_distribution, v_map_projects';
END $$;
