"""
MPLADS Sentinel — Database Verification Script
Run after data ingestion to verify everything loaded correctly.
Usage: python verify_db.py
"""
import psycopg2
import os
import sys

DB_CONFIG = {
    "host": os.getenv("POSTGRES_HOST", "localhost"),
    "port": int(os.getenv("POSTGRES_PORT", 5432)),
    "dbname": os.getenv("POSTGRES_DB", "mplads_sentinel"),
    "user": os.getenv("POSTGRES_USER", "sentinel_user"),
    "password": os.getenv("POSTGRES_PASSWORD", "SentinelDB@2026!"),
}

CHECKS = [
    ("States",              "SELECT COUNT(*) FROM states",                         32),
    ("Project Categories",  "SELECT COUNT(*) FROM project_categories",             10),
    ("MPs (real data)",     "SELECT COUNT(*) FROM mps",                           None),
    ("Projects (demo)",     "SELECT COUNT(*) FROM projects WHERE is_demo_data",   None),
    ("Anomaly projects",    "SELECT COUNT(*) FROM projects WHERE data_source='SYNTHETIC_ANOMALY'", 4),
    ("Payments",            "SELECT COUNT(*) FROM payments",                       None),
    ("Progress records",    "SELECT COUNT(*) FROM project_progress",              None),
    ("Risk scores",         "SELECT COUNT(*) FROM risk_scores",                   None),
    ("Demo users",          "SELECT COUNT(*) FROM users",                          6),
    ("Locations (lat/lon)", "SELECT COUNT(*) FROM project_locations WHERE latitude IS NOT NULL", None),
    ("Duplicate pairs",     "SELECT COUNT(*) FROM duplicate_pairs",                None),
    ("Photos",              "SELECT COUNT(*) FROM photos",                         None),
    ("DB Version",          "SELECT version()",                                    None),
]

DEMO_PROJECTS = [
    "DEMO-ANOMALY-001",
    "DEMO-DUP-002A",
    "DEMO-DUP-002B",
    "DEMO-PHOTO-003",
    "DEMO-TSTAMP-004",
]

def main():
    print("=" * 60)
    print("MPLADS Sentinel — Database Verification")
    print("=" * 60)

    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        print(f"✅ Connected to PostgreSQL at {DB_CONFIG['host']}:{DB_CONFIG['port']}\n")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        sys.exit(1)

    all_pass = True
    for label, query, expected in CHECKS:
        try:
            cur.execute(query)
            result = cur.fetchone()[0]
            if expected is not None and int(result if isinstance(result, int) else 1) < expected:
                status = f"⚠️  WARN (got {result}, expected >={expected})"
                all_pass = False
            else:
                status = f"✅ {result}"
            print(f"  {label:30s} {status}")
        except Exception as e:
            print(f"  {label:30s} ❌ ERROR: {e}")
            all_pass = False

    print()
    print("── Demo Project Verification ─────────────────────────")
    for code in DEMO_PROJECTS:
        cur.execute("""
            SELECT p.id, p.name, rs.overall_score, rs.risk_level
            FROM projects p
            LEFT JOIN risk_scores rs ON rs.project_id = p.id
            WHERE p.project_code = %s
            ORDER BY rs.computed_at DESC LIMIT 1
        """, (code,))
        row = cur.fetchone()
        if row:
            pid, name, score, level = row
            print(f"  ✅ {code} (id={pid}) → Risk: {score}/{level}")
            print(f"     {name[:70]}")
        else:
            print(f"  ❌ {code} — NOT FOUND")
            all_pass = False

    print()
    print("── Dashboard KPIs ────────────────────────────────────")
    cur.execute("SELECT * FROM v_dashboard_kpis")
    row = cur.fetchone()
    if row:
        cols = [desc[0] for desc in cur.description]
        for col, val in zip(cols, row):
            print(f"  {col:30s} {val}")
    else:
        print("  ❌ Dashboard view returned no data")
        all_pass = False

    print()
    print("-- Location Coverage Check --")
    cur.execute("""
        SELECT COUNT(*) FROM project_locations
        WHERE latitude BETWEEN 8.0 AND 37.0
          AND longitude BETWEEN 68.0 AND 97.0
    """)
    spatial_result = cur.fetchone()[0]
    print(f"  Projects with valid India coordinates: {spatial_result}")

    cur.close()
    conn.close()

    print()
    print("=" * 60)
    if all_pass:
        print("✅ ALL CHECKS PASSED — Database is ready for Phase 3")
    else:
        print("⚠️  SOME CHECKS FAILED — Review above output")
    print("=" * 60)


if __name__ == "__main__":
    main()
