-- ============================================================
-- MPLADS Sentinel — Demo User Seeds
-- Run AFTER 02_seed_mps.sql
-- Creates demo login accounts for SIH demonstration.
-- Password hash = BCrypt("Demo@1234")
-- ============================================================

-- Note: Users are also created by the Python generator.
-- This SQL file creates them directly for Docker init bootstrap.

-- BCrypt hash of "Demo@1234" (cost factor 10)
-- Generated offline — do NOT change unless regenerating
DO $$
DECLARE
    v_ministry_role  INTEGER;
    v_state_role     INTEGER;
    v_district_role  INTEGER;
    v_mp_role        INTEGER;
    v_agency_role    INTEGER;
    v_tn_state_id    INTEGER;
    v_mh_state_id    INTEGER;
    v_demo_hash      TEXT := '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKom7MZ2mtdF7e8BXMJDfQvqM1bK';
BEGIN
    SELECT id INTO v_ministry_role  FROM roles WHERE name = 'MINISTRY';
    SELECT id INTO v_state_role     FROM roles WHERE name = 'STATE_NODAL';
    SELECT id INTO v_district_role  FROM roles WHERE name = 'DISTRICT_AUTH';
    SELECT id INTO v_mp_role        FROM roles WHERE name = 'MP';
    SELECT id INTO v_agency_role    FROM roles WHERE name = 'AGENCY';
    SELECT id INTO v_tn_state_id    FROM states WHERE name = 'Tamil Nadu';
    SELECT id INTO v_mh_state_id    FROM states WHERE name = 'Maharashtra';

    INSERT INTO users (username, email, password_hash, full_name, role_id, state_id)
    VALUES
      ('ministry',    'ministry@sentinel.gov.in',   v_demo_hash, 'Ministry Admin (MoSPI)',           v_ministry_role, NULL),
      ('nodal.tn',   'nodal.tn@sentinel.gov.in',   v_demo_hash, 'Tamil Nadu State Nodal Officer',   v_state_role,    v_tn_state_id),
      ('nodal.mh',   'nodal.mh@sentinel.gov.in',   v_demo_hash, 'Maharashtra State Nodal Officer',  v_state_role,    v_mh_state_id),
      ('district',   'district@sentinel.gov.in',   v_demo_hash, 'District Authority Officer',       v_district_role, v_tn_state_id),
      ('mp_demo',    'mp@sentinel.gov.in',          v_demo_hash, 'Demo Member of Parliament',        v_mp_role,       v_tn_state_id),
      ('agency',     'agency@sentinel.gov.in',      v_demo_hash, 'Implementing Agency Officer',     v_agency_role,   v_tn_state_id)
    ON CONFLICT (email) DO NOTHING;

    RAISE NOTICE 'Demo users created. Login password: Demo@1234';
END $$;

-- ============================================================
-- Demo credentials summary (printed in logs)
-- ============================================================
DO $$ BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'MPLADS SENTINEL — DEMO LOGIN CREDENTIALS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'ministry@sentinel.gov.in  → Ministry (full access)';
    RAISE NOTICE 'nodal.tn@sentinel.gov.in  → Tamil Nadu State Nodal';
    RAISE NOTICE 'nodal.mh@sentinel.gov.in  → Maharashtra State Nodal';
    RAISE NOTICE 'district@sentinel.gov.in  → District Authority';
    RAISE NOTICE 'mp@sentinel.gov.in         → MP (own constituency)';
    RAISE NOTICE 'agency@sentinel.gov.in     → Implementing Agency';
    RAISE NOTICE 'Password for all: Demo@1234';
    RAISE NOTICE '========================================';
END $$;
