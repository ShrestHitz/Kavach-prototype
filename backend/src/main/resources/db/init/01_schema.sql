-- ============================================================
-- MPLADS Sentinel — Database Initialization (No-PostGIS Mode)
-- PostgreSQL 18 (native install) — PostGIS gracefully skipped
-- PostGIS will be enabled when using Docker + postgis/postgis image
-- ============================================================

-- Extensions available in vanilla PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- PostGIS is OPTIONAL — skip silently if unavailable
DO $$ BEGIN
    BEGIN
        CREATE EXTENSION IF NOT EXISTS postgis;
        RAISE NOTICE 'PostGIS: ENABLED';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'PostGIS: NOT AVAILABLE (geometry columns will use numeric lat/lon instead)';
    END;
END $$;

-- ============================================================
-- REFERENCE / LOOKUP TABLES
-- ============================================================

CREATE TABLE states (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    code        VARCHAR(10)  NOT NULL UNIQUE,
    region      VARCHAR(50),
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE districts (
    id          SERIAL PRIMARY KEY,
    state_id    INTEGER NOT NULL REFERENCES states(id) ON DELETE CASCADE,
    name        VARCHAR(150) NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(state_id, name)
);

CREATE TABLE constituencies (
    id              SERIAL PRIMARY KEY,
    district_id     INTEGER NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
    state_id        INTEGER NOT NULL REFERENCES states(id),
    name            VARCHAR(150) NOT NULL,
    constituency_type VARCHAR(20) DEFAULT 'LOK_SABHA',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE implementing_agencies (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    agency_type VARCHAR(100),
    state_id    INTEGER REFERENCES states(id),
    contact     VARCHAR(255),
    is_demo     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE project_categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    typical_cost_min_paise  BIGINT,
    typical_cost_max_paise  BIGINT
);

-- ============================================================
-- MPs
-- ============================================================

CREATE TABLE mps (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(255) NOT NULL,
    state_id            INTEGER REFERENCES states(id),
    state_name          VARCHAR(100),
    mp_type             VARCHAR(30) DEFAULT 'ELECTED',
    term_start_year     INTEGER,
    term_end_year       INTEGER,
    allocated_amount_paise BIGINT,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- ROLES & USERS
-- ============================================================

CREATE TABLE roles (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(100) NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255),
    role_id         INTEGER NOT NULL REFERENCES roles(id),
    state_id        INTEGER REFERENCES states(id),
    district_id     INTEGER REFERENCES districts(id),
    mp_id           INTEGER REFERENCES mps(id),
    agency_id       INTEGER REFERENCES implementing_agencies(id),
    is_active       BOOLEAN DEFAULT TRUE,
    last_login      TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CORE PROJECT TABLE
-- ============================================================

CREATE TABLE projects (
    id                  SERIAL PRIMARY KEY,
    project_code        VARCHAR(50) NOT NULL UNIQUE,
    name                VARCHAR(500) NOT NULL,
    description         TEXT,
    mp_id               INTEGER REFERENCES mps(id),
    state_id            INTEGER NOT NULL REFERENCES states(id),
    district_id         INTEGER REFERENCES districts(id),
    constituency_id     INTEGER REFERENCES constituencies(id),
    category_id         INTEGER NOT NULL REFERENCES project_categories(id),
    agency_id           INTEGER REFERENCES implementing_agencies(id),
    status              VARCHAR(30) DEFAULT 'IN_PROGRESS',
    sanctioned_amount_paise     BIGINT NOT NULL DEFAULT 0,
    estimated_cost_paise        BIGINT NOT NULL DEFAULT 0,
    total_expenditure_paise     BIGINT DEFAULT 0,
    start_date          DATE,
    expected_end_date   DATE,
    actual_end_date     DATE,
    is_demo_data        BOOLEAN DEFAULT FALSE,
    data_source         VARCHAR(100) DEFAULT 'SYNTHETIC_DEMO',
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- PROJECT LOCATION (lat/lon only — PostGIS geometry optional)
-- ============================================================

CREATE TABLE project_locations (
    id              SERIAL PRIMARY KEY,
    project_id      INTEGER NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
    latitude        DOUBLE PRECISION,
    longitude       DOUBLE PRECISION,
    address         TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add PostGIS geometry column only if PostGIS is available
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
        EXECUTE 'SELECT AddGeometryColumn(''project_locations'', ''geom'', 4326, ''POINT'', 2)';
        EXECUTE 'CREATE INDEX idx_project_locations_geom ON project_locations USING GIST (geom)';
        RAISE NOTICE 'PostGIS geometry column added to project_locations';
    ELSE
        RAISE NOTICE 'PostGIS not available — using numeric lat/lon only (geom column skipped)';
    END IF;
END $$;

-- ============================================================
-- PROJECT FINANCIALS
-- ============================================================

CREATE TABLE project_financials (
    id                          SERIAL PRIMARY KEY,
    project_id                  INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sanctioned_amount_paise     BIGINT NOT NULL DEFAULT 0,
    estimated_cost_paise        BIGINT NOT NULL DEFAULT 0,
    total_expenditure_paise     BIGINT DEFAULT 0,
    remaining_amount_paise      BIGINT GENERATED ALWAYS AS
                                    (sanctioned_amount_paise - total_expenditure_paise) STORED,
    utilization_pct             NUMERIC(6,2),
    as_of_date                  DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- PAYMENTS
-- ============================================================

CREATE TABLE payments (
    id                      SERIAL PRIMARY KEY,
    project_id              INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    payment_date            DATE NOT NULL,
    amount_paise            BIGINT NOT NULL,
    cumulative_total_paise  BIGINT,
    payment_type            VARCHAR(50) DEFAULT 'DISBURSEMENT',
    notes                   TEXT,
    is_anomalous            BOOLEAN DEFAULT FALSE,
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- PROJECT PROGRESS
-- ============================================================

CREATE TABLE project_progress (
    id                      SERIAL PRIMARY KEY,
    project_id              INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    report_date             DATE NOT NULL,
    reported_progress_pct   NUMERIC(5,2) NOT NULL DEFAULT 0,
    expected_progress_pct   NUMERIC(5,2),
    progress_gap_pct        NUMERIC(5,2) GENERATED ALWAYS AS
                                (expected_progress_pct - reported_progress_pct) STORED,
    progress_status         VARCHAR(30) DEFAULT 'ON_TRACK',
    delay_days              INTEGER DEFAULT 0,
    notes                   TEXT,
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- PHOTOS
-- ============================================================

CREATE TABLE photos (
    id                      SERIAL PRIMARY KEY,
    project_id              INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    filename                VARCHAR(255) NOT NULL,
    file_path               VARCHAR(500),
    upload_timestamp        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    exif_timestamp          TIMESTAMP WITH TIME ZONE,
    exif_gps_lat            DOUBLE PRECISION,
    exif_gps_lon            DOUBLE PRECISION,
    exif_device             VARCHAR(255),
    hash_phash              VARCHAR(64),
    hash_dhash              VARCHAR(64),
    hash_ahash              VARCHAR(64),
    gps_distance_km         NUMERIC(10,4),
    gps_verdict             VARCHAR(30) DEFAULT 'UNVERIFIED',
    timestamp_verdict       VARCHAR(30) DEFAULT 'UNVERIFIED',
    reuse_verdict           VARCHAR(30) DEFAULT 'UNVERIFIED',
    matching_photo_id       INTEGER REFERENCES photos(id),
    stage_label             VARCHAR(100),
    is_demo                 BOOLEAN DEFAULT FALSE,
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- DOCUMENTS
-- ============================================================

CREATE TABLE documents (
    id              SERIAL PRIMARY KEY,
    project_id      INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    doc_type        VARCHAR(50),
    filename        VARCHAR(255),
    file_path       VARCHAR(500),
    upload_date     DATE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- AI / ML OUTPUTS
-- ============================================================

CREATE TABLE risk_scores (
    id                  SERIAL PRIMARY KEY,
    project_id          INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    overall_score       NUMERIC(5,2) NOT NULL DEFAULT 0,
    risk_level          VARCHAR(20) NOT NULL DEFAULT 'LOW',
    financial_score     NUMERIC(5,2) DEFAULT 0,
    payment_score       NUMERIC(5,2) DEFAULT 0,
    delay_score         NUMERIC(5,2) DEFAULT 0,
    geo_score           NUMERIC(5,2) DEFAULT 0,
    duplicate_score     NUMERIC(5,2) DEFAULT 0,
    photo_score         NUMERIC(5,2) DEFAULT 0,
    weights_used        JSONB DEFAULT '{}'::jsonb,
    model_versions      JSONB DEFAULT '{}'::jsonb,
    computed_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    computed_by         VARCHAR(100) DEFAULT 'RISK_ENGINE_V1'
);

CREATE TABLE anomalies (
    id              SERIAL PRIMARY KEY,
    project_id      INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    anomaly_type    VARCHAR(50) NOT NULL,
    severity        VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    description     TEXT NOT NULL,
    evidence        JSONB DEFAULT '{}'::jsonb,
    detected_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    model_name      VARCHAR(100),
    model_version   VARCHAR(50)
);

CREATE TABLE model_predictions (
    id                  SERIAL PRIMARY KEY,
    project_id          INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    model_name          VARCHAR(100) NOT NULL,
    model_version       VARCHAR(50) NOT NULL,
    prediction_type     VARCHAR(50) NOT NULL,
    prediction_value    NUMERIC(10,4) NOT NULL,
    confidence          NUMERIC(5,4),
    features_used       JSONB DEFAULT '{}'::jsonb,
    shap_values         JSONB DEFAULT '{}'::jsonb,
    predicted_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE duplicate_pairs (
    id              SERIAL PRIMARY KEY,
    project_a_id    INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    project_b_id    INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    similarity_score NUMERIC(5,4) NOT NULL,
    distance_km     NUMERIC(10,4),
    flagged_fields  JSONB DEFAULT '{}'::jsonb,
    verdict         VARCHAR(30) DEFAULT 'POSSIBLE_DUPLICATE',
    detected_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_a_id, project_b_id)
);

-- ============================================================
-- REPORTS
-- ============================================================

CREATE TABLE reports (
    id              SERIAL PRIMARY KEY,
    project_id      INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    generated_by    INTEGER REFERENCES users(id),
    report_uuid     UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    pdf_path        VARCHAR(500),
    risk_snapshot   JSONB DEFAULT '{}'::jsonb,
    status          VARCHAR(20) DEFAULT 'PENDING',
    generated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOG
-- ============================================================

CREATE TABLE audit_log (
    id              BIGSERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id),
    username        VARCHAR(100),
    action          VARCHAR(100) NOT NULL,
    entity_type     VARCHAR(50),
    entity_id       INTEGER,
    details         JSONB DEFAULT '{}'::jsonb,
    ip_address      VARCHAR(50),
    timestamp       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_projects_state        ON projects(state_id);
CREATE INDEX idx_projects_district     ON projects(district_id);
CREATE INDEX idx_projects_category     ON projects(category_id);
CREATE INDEX idx_projects_mp           ON projects(mp_id);
CREATE INDEX idx_projects_status       ON projects(status);
CREATE INDEX idx_projects_is_demo      ON projects(is_demo_data);
CREATE INDEX idx_projects_name_trgm    ON projects USING GIN (name gin_trgm_ops);

CREATE INDEX idx_risk_scores_project    ON risk_scores(project_id);
CREATE INDEX idx_risk_scores_level      ON risk_scores(risk_level);
CREATE INDEX idx_risk_scores_overall    ON risk_scores(overall_score DESC);

CREATE INDEX idx_payments_project  ON payments(project_id);
CREATE INDEX idx_payments_date     ON payments(payment_date);
CREATE INDEX idx_progress_project  ON project_progress(project_id);
CREATE INDEX idx_anomalies_project ON anomalies(project_id);
CREATE INDEX idx_photos_project    ON photos(project_id);
CREATE INDEX idx_audit_timestamp   ON audit_log(timestamp DESC);

-- ============================================================
-- TRIGGER: auto-update projects.updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SEED: Roles
-- ============================================================

INSERT INTO roles (name, description, permissions) VALUES
('MINISTRY',       'Ministry / MoSPI — full national access',
 '{"read_all":true,"export":true,"generate_report":true}'::jsonb),
('STATE_NODAL',    'State Nodal Authority — state-scoped access',
 '{"read_state":true,"export":true,"generate_report":true}'::jsonb),
('DISTRICT_AUTH',  'District Authority — district-scoped access',
 '{"read_district":true,"generate_report":true}'::jsonb),
('MP',             'Member of Parliament — own constituency access',
 '{"read_own":true}'::jsonb),
('AGENCY',         'Implementing Agency — own projects only',
 '{"read_own_projects":true}'::jsonb);

-- ============================================================
-- SEED: Project Categories
-- ============================================================

INSERT INTO project_categories (name, description, typical_cost_min_paise, typical_cost_max_paise) VALUES
('Road & Connectivity',     'Roads, bridges, culverts, footpaths',           1000000000,  5000000000),
('Drinking Water',          'Water supply, borewells, pipelines, tanks',       500000000,  3000000000),
('Education',               'Schools, classrooms, libraries, equipment',       500000000,  4000000000),
('Healthcare',              'Health centers, hospitals, medical equipment',     500000000,  5000000000),
('Sanitation & Drainage',   'Toilets, drainage, sewage, solid waste',          300000000,  2500000000),
('Community Infrastructure','Community halls, parks, playgrounds',             300000000,  2000000000),
('Agriculture & Irrigation','Canals, check dams, farm ponds, irrigation',      500000000,  4000000000),
('Sports & Recreation',     'Stadiums, sports complexes, gyms',               1000000000,  5000000000),
('Electrification',         'Street lights, solar, rural electrification',     500000000,  3000000000),
('Digital Infrastructure',  'WiFi, e-governance, digital centers',             200000000,  2000000000);

-- ============================================================
-- SEED: States
-- ============================================================

INSERT INTO states (name, code, region) VALUES
('Andhra Pradesh',      'AP',  'South'),
('Arunachal Pradesh',   'AR',  'Northeast'),
('Assam',               'AS',  'Northeast'),
('Bihar',               'BR',  'East'),
('Chandigarh',          'CH',  'North'),
('Chhattisgarh',        'CG',  'Central'),
('Delhi',               'DL',  'North'),
('Goa',                 'GA',  'West'),
('Gujarat',             'GJ',  'West'),
('Haryana',             'HR',  'North'),
('Himachal Pradesh',    'HP',  'North'),
('Jammu And Kashmir',   'JK',  'North'),
('Jharkhand',           'JH',  'East'),
('Karnataka',           'KA',  'South'),
('Kerala',              'KL',  'South'),
('Madhya Pradesh',      'MP',  'Central'),
('Maharashtra',         'MH',  'West'),
('Manipur',             'MN',  'Northeast'),
('Meghalaya',           'ML',  'Northeast'),
('Mizoram',             'MZ',  'Northeast'),
('Nagaland',            'NL',  'Northeast'),
('Odisha',              'OR',  'East'),
('Puducherry',          'PY',  'South'),
('Punjab',              'PB',  'North'),
('Rajasthan',           'RJ',  'North'),
('Sikkim',              'SK',  'Northeast'),
('Tamil Nadu',          'TN',  'South'),
('Telangana',           'TS',  'South'),
('Tripura',             'TR',  'Northeast'),
('Uttar Pradesh',       'UP',  'North'),
('Uttarakhand',         'UK',  'North'),
('West Bengal',         'WB',  'East');

DO $$ BEGIN
    RAISE NOTICE 'Schema initialized. Roles: 5, Categories: 10, States: 32';
    RAISE NOTICE 'Run 02_seed_mps.sql and 03_seed_users.sql next';
END $$;
