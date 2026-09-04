"""
MPLADS Sentinel — Synthetic Demo Data Generator
================================================
Generates realistic synthetic project data for SIH demonstration.
All generated data is clearly marked as is_demo_data = TRUE.
Never claimed as real government records.

Generates:
  - ~500 projects across 32 states
  - ~2500 payment records
  - ~500 progress snapshots
  - 5 controlled anomaly scenarios for the SIH demo
  - Districts, constituencies, agencies (synthetic)
  - Photo metadata (synthetic EXIF data)

Run: python generate_demo_data.py
"""

import psycopg2
import random
import json
import hashlib
from datetime import datetime, date, timedelta
from decimal import Decimal
import os
import sys

# ── Configuration ─────────────────────────────────────────────
DB_CONFIG = {
    "host": os.getenv("POSTGRES_HOST", "localhost"),
    "port": int(os.getenv("POSTGRES_PORT", 5432)),
    "dbname": os.getenv("POSTGRES_DB", "mplads_sentinel"),
    "user": os.getenv("POSTGRES_USER", "sentinel_user"),
    "password": os.getenv("POSTGRES_PASSWORD", "SentinelDB@2026!"),
}
random.seed(42)  # reproducible results

# ── State geography data ───────────────────────────────────────
STATE_GEO = {
    "Andhra Pradesh":    {"lat": (13.5, 19.0), "lon": (77.0, 84.5)},
    "Arunachal Pradesh": {"lat": (26.5, 29.5), "lon": (91.5, 97.5)},
    "Assam":             {"lat": (24.0, 27.5), "lon": (89.5, 96.0)},
    "Bihar":             {"lat": (24.0, 27.5), "lon": (83.5, 88.5)},
    "Chandigarh":        {"lat": (30.6, 30.8), "lon": (76.7, 76.9)},
    "Chhattisgarh":      {"lat": (17.5, 24.0), "lon": (80.0, 84.5)},
    "Delhi":             {"lat": (28.4, 28.9), "lon": (76.8, 77.4)},
    "Goa":               {"lat": (14.9, 15.8), "lon": (73.7, 74.3)},
    "Gujarat":           {"lat": (20.1, 24.8), "lon": (68.0, 74.5)},
    "Haryana":           {"lat": (27.7, 30.9), "lon": (74.5, 77.6)},
    "Himachal Pradesh":  {"lat": (30.4, 33.2), "lon": (75.6, 79.0)},
    "Jammu And Kashmir": {"lat": (32.5, 36.5), "lon": (73.0, 80.5)},
    "Jharkhand":         {"lat": (21.9, 25.3), "lon": (83.3, 87.9)},
    "Karnataka":         {"lat": (11.5, 18.4), "lon": (74.0, 78.6)},
    "Kerala":            {"lat": (8.2, 12.8),  "lon": (74.8, 77.4)},
    "Madhya Pradesh":    {"lat": (21.1, 26.9), "lon": (74.0, 82.8)},
    "Maharashtra":       {"lat": (15.6, 22.1), "lon": (72.6, 80.9)},
    "Manipur":           {"lat": (23.8, 25.7), "lon": (93.0, 94.8)},
    "Meghalaya":         {"lat": (25.0, 26.1), "lon": (89.8, 92.8)},
    "Mizoram":           {"lat": (21.9, 24.5), "lon": (92.3, 93.5)},
    "Nagaland":          {"lat": (25.1, 27.0), "lon": (93.3, 95.3)},
    "Odisha":            {"lat": (17.8, 22.6), "lon": (81.3, 87.5)},
    "Puducherry":        {"lat": (11.7, 12.1), "lon": (79.7, 80.0)},
    "Punjab":            {"lat": (29.5, 32.6), "lon": (73.9, 76.9)},
    "Rajasthan":         {"lat": (23.0, 30.2), "lon": (69.5, 78.3)},
    "Sikkim":            {"lat": (27.1, 28.1), "lon": (88.0, 88.9)},
    "Tamil Nadu":        {"lat": (8.0,  13.6), "lon": (77.0, 80.4)},
    "Telangana":         {"lat": (15.8, 19.9), "lon": (77.3, 81.4)},
    "Tripura":           {"lat": (22.9, 24.6), "lon": (91.1, 92.3)},
    "Uttar Pradesh":     {"lat": (23.9, 30.4), "lon": (77.1, 84.7)},
    "Uttarakhand":       {"lat": (28.7, 31.5), "lon": (77.6, 81.1)},
    "West Bengal":       {"lat": (21.4, 27.2), "lon": (85.8, 89.9)},
}

PROJECT_NAMES_BY_CATEGORY = {
    "Road & Connectivity": [
        "Construction of CC Road from {v1} to {v2}",
        "Widening of Road connecting {v1} Village",
        "Repair and Strengthening of Bridge at {v1}",
        "Construction of Footpath along {v1} Main Road",
        "Rural Road Connectivity to {v1} Hamlet",
        "Construction of Culvert at {v1} Nala",
        "Blacktop Road from {v1} to {v2} Village",
    ],
    "Drinking Water": [
        "Installation of Hand Pumps in {v1} Village",
        "Construction of Overhead Water Tank at {v1}",
        "Extension of Water Supply Pipeline to {v1}",
        "Borewell with Motor Pump at {v1} Ward",
        "Renovation of Community Water Storage at {v1}",
        "Piped Drinking Water Supply Scheme for {v1}",
    ],
    "Education": [
        "Construction of Additional Classrooms at {v1} Government School",
        "Renovation of {v1} Primary School Building",
        "Supply of Furniture & Equipment to {v1} School",
        "Construction of Boundary Wall for {v1} School",
        "Digital Lab Setup at {v1} High School",
        "Construction of Girls Toilet Block at {v1} School",
    ],
    "Healthcare": [
        "Renovation of Primary Health Centre at {v1}",
        "Procurement of Medical Equipment for {v1} CHC",
        "Construction of Labour Room at {v1} PHC",
        "Supply of Ambulance to {v1} District Hospital",
        "Construction of Isolation Ward at {v1} Hospital",
    ],
    "Sanitation & Drainage": [
        "Construction of Drainage Channel in {v1} Ward",
        "Individual Household Toilets in {v1} Village",
        "Solid Waste Management System for {v1} Town",
        "Construction of Community Toilet Complex at {v1}",
        "Sewage Treatment Plant for {v1} Municipality",
    ],
    "Community Infrastructure": [
        "Construction of Community Hall at {v1} Village",
        "Development of {v1} Community Park",
        "Construction of Burial / Cremation Ground at {v1}",
        "Renovation of {v1} Panchayat Bhavan",
        "Construction of Shopping Complex at {v1}",
        "Community Centre at {v1} Colony",
    ],
    "Agriculture & Irrigation": [
        "Construction of Check Dam at {v1} River",
        "Farm Pond Construction for Farmers of {v1}",
        "Renovation of Irrigation Canal in {v1} Block",
        "Drip Irrigation System for {v1} Farmers Group",
        "Construction of Mini Percolation Tank at {v1}",
    ],
    "Sports & Recreation": [
        "Construction of Multi-Purpose Sports Ground at {v1}",
        "Development of {v1} Indoor Sports Stadium",
        "Construction of Swimming Pool at {v1}",
        "Renovation of {v1} Gymnasium",
    ],
    "Electrification": [
        "Solar Street Lighting in {v1} Village",
        "Rural Electrification of {v1} Hamlet",
        "Installation of LED Street Lights in {v1} Ward",
        "Solar Power Plant for {v1} Panchayat",
    ],
    "Digital Infrastructure": [
        "Wi-Fi Hotspot Installation at {v1} Public Areas",
        "Common Service Centre (CSC) at {v1}",
        "Digital Literacy Centre at {v1} Panchayat",
        "E-Governance Kiosk at {v1} Block Office",
    ],
}

VILLAGE_NAMES = [
    "Rampur", "Nandpur", "Krishnapur", "Laxmipur", "Shivpur",
    "Ganeshpur", "Mohanpur", "Rajpur", "Sundarpur", "Anandpur",
    "Devpur", "Vijaypur", "Sukhpur", "Madhavpur", "Chandrapur",
    "Indrapur", "Govindpur", "Vishnupur", "Saraswatipur", "Durgapur",
    "Lakshmipur", "Bhimnagar", "Sitapur", "Geetanagar", "Padmanagar",
    "Krishnanagar", "Ramnagar", "Anantnagar", "Suryapur", "Shivanagar",
]

AGENCY_NAMES = [
    "Public Works Department", "Municipal Corporation", "Zila Parishad",
    "Gram Panchayat Society", "CPWD Regional Office", "DRDA",
    "Urban Development Authority", "State Rural Dev Agency",
    "Block Development Office", "Panchayati Raj Department",
    "Water Resources Department", "Education Department PWD Cell",
    "Health Department Works Division", "Sports Authority State",
    "Irrigation Department", "Rural Engineering Department",
]

DISTRICT_SUFFIXES = ["North", "South", "East", "West", "Central", "Rural"]

STATUS_WEIGHTS = {
    "IN_PROGRESS": 0.55,
    "COMPLETED": 0.25,
    "STALLED": 0.10,
    "SANCTIONED": 0.07,
    "CANCELLED": 0.03,
}


def rand_lat_lon(state_name):
    geo = STATE_GEO.get(state_name, {"lat": (20.0, 28.0), "lon": (75.0, 85.0)})
    lat = round(random.uniform(*geo["lat"]), 6)
    lon = round(random.uniform(*geo["lon"]), 6)
    return lat, lon


def rand_amount(category_name, anomaly_factor=1.0):
    """Return sanctioned amount in paise"""
    ranges = {
        "Road & Connectivity":     (1_500_000, 4_500_000),
        "Drinking Water":          (800_000, 3_000_000),
        "Education":               (500_000, 3_500_000),
        "Healthcare":              (1_000_000, 5_000_000),
        "Sanitation & Drainage":   (400_000, 2_500_000),
        "Community Infrastructure": (500_000, 2_000_000),
        "Agriculture & Irrigation": (800_000, 4_000_000),
        "Sports & Recreation":     (1_500_000, 5_000_000),
        "Electrification":         (600_000, 3_000_000),
        "Digital Infrastructure":  (300_000, 2_000_000),
    }
    lo, hi = ranges.get(category_name, (500_000, 3_000_000))
    amount = random.uniform(lo * anomaly_factor, hi * anomaly_factor)
    # Round to nearest 50,000
    amount = round(amount / 50000) * 50000
    return int(amount * 100)  # convert to paise


def weighted_choice(weights: dict):
    choices = list(weights.keys())
    probs = list(weights.values())
    return random.choices(choices, weights=probs, k=1)[0]


def generate_project_code(state_code, year, seq):
    return f"MPLADS-{state_code}-{year}-{seq:05d}"


def generate_payments(project_id, sanctioned_paise, start_date, status, is_anomalous=False):
    """Generate realistic payment records for a project"""
    payments = []
    total_budget = sanctioned_paise / 100  # in rupees

    if status == "SANCTIONED":
        return []

    num_payments = random.randint(3, 8)
    if is_anomalous:
        # Anomalous: mostly small then one big spike
        amounts = [random.uniform(0.04, 0.08) * total_budget for _ in range(num_payments - 1)]
        amounts.append(random.uniform(0.35, 0.55) * total_budget)  # spike
    else:
        # Normal: roughly even distribution
        raw = [random.uniform(0.5, 1.5) for _ in range(num_payments)]
        total_raw = sum(raw)
        pct_to_spend = 0.75 if status == "IN_PROGRESS" else 0.95
        amounts = [r / total_raw * total_budget * pct_to_spend for r in raw]

    cumulative = 0
    current_date = start_date + timedelta(days=random.randint(30, 90))
    for i, amt in enumerate(sorted(amounts)):
        amt = max(10000, int(amt))  # min ₹10,000
        cumulative += amt
        gap = random.randint(30, 120)
        current_date = current_date + timedelta(days=gap)
        if current_date > date.today():
            current_date = date.today() - timedelta(days=random.randint(1, 30))
        payments.append({
            "project_id": project_id,
            "payment_date": current_date,
            "amount_paise": int(amt * 100),
            "cumulative_total_paise": int(cumulative * 100),
            "payment_type": "DISBURSEMENT",
            "is_anomalous": is_anomalous and i == len(amounts) - 1,
        })
    return payments


def generate_progress(project_id, start_date, expected_end_date, status, is_delayed=False):
    """Generate progress snapshots"""
    if status == "SANCTIONED":
        return []

    today = date.today()
    total_days = (expected_end_date - start_date).days
    elapsed_days = (today - start_date).days
    elapsed_pct = min(100, (elapsed_days / max(total_days, 1)) * 100)

    if status == "COMPLETED":
        reported_pct = 100.0
    elif is_delayed:
        reported_pct = max(5, elapsed_pct * random.uniform(0.35, 0.60))
    elif status == "STALLED":
        reported_pct = random.uniform(15, 45)
    else:
        reported_pct = elapsed_pct * random.uniform(0.75, 0.98)

    reported_pct = min(99.9 if status != "COMPLETED" else 100, reported_pct)

    if reported_pct >= elapsed_pct * 0.9:
        prog_status = "ON_TRACK"
    elif reported_pct >= elapsed_pct * 0.7:
        prog_status = "SLIGHT_DELAY"
    elif reported_pct >= elapsed_pct * 0.5:
        prog_status = "DELAYED"
    elif status == "STALLED":
        prog_status = "STALLED"
    else:
        prog_status = "SEVERELY_DELAYED"

    delay_days = max(0, int((elapsed_pct - reported_pct) / 100 * total_days))

    return [{
        "project_id": project_id,
        "report_date": today,
        "reported_progress_pct": round(reported_pct, 2),
        "expected_progress_pct": round(min(100, elapsed_pct), 2),
        "progress_status": prog_status,
        "delay_days": delay_days,
    }]


def main():
    print("=" * 60)
    print("MPLADS Sentinel — Synthetic Demo Data Generator")
    print("=" * 60)

    conn = psycopg2.connect(**DB_CONFIG)
    conn.autocommit = False
    cur = conn.cursor()

    # ── Load reference data ──────────────────────────────────
    cur.execute("SELECT id, name, code FROM states ORDER BY name")
    states = {row[1]: {"id": row[0], "code": row[2]} for row in cur.fetchall()}

    cur.execute("SELECT id, name FROM project_categories")
    categories = {row[1]: row[0] for row in cur.fetchall()}

    print(f"States loaded: {len(states)}")
    print(f"Categories loaded: {len(categories)}")

    # ── Create Districts ─────────────────────────────────────
    print("\n[1/6] Creating districts...")
    district_map = {}  # (state_id, district_name) -> district_id
    district_id_by_state = {}  # state_id -> [district_ids]

    for state_name, state_info in states.items():
        state_id = state_info["id"]
        num_districts = random.randint(4, 12)
        district_ids = []
        for i in range(num_districts):
            dname = f"{random.choice(VILLAGE_NAMES)} {random.choice(DISTRICT_SUFFIXES)} District"
            try:
                cur.execute(
                    "INSERT INTO districts (state_id, name) VALUES (%s, %s) "
                    "ON CONFLICT (state_id, name) DO UPDATE SET name=EXCLUDED.name RETURNING id",
                    (state_id, dname)
                )
                did = cur.fetchone()[0]
            except Exception:
                conn.rollback()
                cur.execute("SELECT id FROM districts WHERE state_id=%s AND name=%s", (state_id, dname))
                did = cur.fetchone()[0]
            district_map[(state_id, dname)] = did
            district_ids.append(did)
        district_id_by_state[state_id] = district_ids
    conn.commit()
    print(f"   Districts created: {len(district_map)}")

    # ── Create Implementing Agencies ──────────────────────────
    print("[2/6] Creating implementing agencies...")
    agency_ids = []
    for state_name, state_info in states.items():
        state_id = state_info["id"]
        for agency_name in random.sample(AGENCY_NAMES, k=min(4, len(AGENCY_NAMES))):
            full_name = f"{agency_name} — {state_name}"
            cur.execute(
                "INSERT INTO implementing_agencies (name, agency_type, state_id, is_demo) "
                "VALUES (%s, %s, %s, TRUE) RETURNING id",
                (full_name, agency_name.split()[0], state_id)
            )
            agency_ids.append(cur.fetchone()[0])
    conn.commit()
    print(f"   Agencies created: {len(agency_ids)}")

    # ── Create Demo Users ─────────────────────────────────────
    print("[3/6] Creating demo users...")
    # BCrypt hash of "Demo@1234" — pre-computed to avoid dependency
    DEMO_HASH = "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKom7MZ2mtdF7e8BXMJDfQvqM1bK"

    cur.execute("SELECT id FROM roles WHERE name = 'MINISTRY'")
    ministry_role = cur.fetchone()[0]
    cur.execute("SELECT id FROM roles WHERE name = 'STATE_NODAL'")
    state_role = cur.fetchone()[0]
    cur.execute("SELECT id FROM roles WHERE name = 'DISTRICT_AUTH'")
    dist_role = cur.fetchone()[0]
    cur.execute("SELECT id FROM roles WHERE name = 'MP'")
    mp_role = cur.fetchone()[0]
    cur.execute("SELECT id FROM roles WHERE name = 'AGENCY'")
    agency_role = cur.fetchone()[0]

    demo_users = [
        ("ministry@sentinel.gov.in", "Ministry Admin", ministry_role, None),
        ("nodal.tn@sentinel.gov.in", "TN State Nodal", state_role, states.get("Tamil Nadu", {}).get("id")),
        ("nodal.mh@sentinel.gov.in", "MH State Nodal", state_role, states.get("Maharashtra", {}).get("id")),
        ("district@sentinel.gov.in", "District Authority", dist_role, None),
        ("mp@sentinel.gov.in", "Demo MP", mp_role, None),
        ("agency@sentinel.gov.in", "Implementing Agency", agency_role, None),
    ]
    for email, name, role_id, sid in demo_users:
        uname = email.split("@")[0]
        cur.execute(
            "INSERT INTO users (username, email, password_hash, full_name, role_id, state_id) "
            "VALUES (%s, %s, %s, %s, %s, %s) ON CONFLICT (email) DO NOTHING",
            (uname, email, DEMO_HASH, name, role_id, sid)
        )
    conn.commit()
    print("   Demo users created (6 accounts)")

    # ── Generate Projects ─────────────────────────────────────
    print("[4/6] Generating synthetic projects...")
    cat_names = list(categories.keys())
    status_list = list(STATUS_WEIGHTS.keys())

    # Load MP IDs
    cur.execute("SELECT id, state_id FROM mps WHERE state_id IS NOT NULL")
    mp_rows = cur.fetchall()
    mp_by_state = {}
    for mid, sid in mp_rows:
        mp_by_state.setdefault(sid, []).append(mid)

    project_ids_all = []
    state_seq = {s: 1 for s in states}
    total_projects = 0

    TODAY = date.today()
    YEAR_NOW = TODAY.year

    for state_name, state_info in states.items():
        state_id = state_info["id"]
        state_code = state_info["code"]
        n_projects = random.randint(12, 22)  # ~500 total across 32 states

        dist_ids = district_id_by_state.get(state_id, [None])
        mp_ids_for_state = mp_by_state.get(state_id, [None])
        state_agencies = [aid for aid in agency_ids
                          if random.random() < 0.3][:8] or [random.choice(agency_ids)]

        for _ in range(n_projects):
            cat_name = random.choice(cat_names)
            cat_id = categories[cat_name]
            v1, v2 = random.sample(VILLAGE_NAMES, 2)
            templates = PROJECT_NAMES_BY_CATEGORY[cat_name]
            proj_name = random.choice(templates).format(v1=v1, v2=v2)

            status = weighted_choice(STATUS_WEIGHTS)
            year = random.randint(YEAR_NOW - 4, YEAR_NOW - 1)
            seq = state_seq[state_name]
            state_seq[state_name] += 1
            code = generate_project_code(state_code, year, seq)

            # Dates
            start_date = date(year, random.randint(1, 12), random.randint(1, 28))
            duration_months = random.randint(12, 36)
            expected_end = start_date + timedelta(days=duration_months * 30)
            actual_end = None
            if status == "COMPLETED":
                actual_end = expected_end + timedelta(days=random.randint(-30, 90))

            sanctioned_paise = rand_amount(cat_name)
            estimated_paise = int(sanctioned_paise * random.uniform(0.90, 1.10))

            if status == "COMPLETED":
                expend_paise = int(estimated_paise * random.uniform(0.92, 1.08))
            elif status in ("IN_PROGRESS", "STALLED"):
                expend_paise = int(sanctioned_paise * random.uniform(0.15, 0.75))
            else:
                expend_paise = 0

            lat, lon = rand_lat_lon(state_name)
            dist_id = random.choice(dist_ids)
            mp_id = random.choice(mp_ids_for_state) if mp_ids_for_state[0] else None
            agency_id = random.choice(state_agencies) if state_agencies else None

            cur.execute("""
                INSERT INTO projects
                  (project_code, name, description, mp_id, state_id, district_id,
                   category_id, agency_id, status, sanctioned_amount_paise,
                   estimated_cost_paise, total_expenditure_paise,
                   start_date, expected_end_date, actual_end_date,
                   is_demo_data, data_source)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,TRUE,'SYNTHETIC_DEMO')
                RETURNING id
            """, (code, proj_name, f"DEMO: {proj_name} — {state_name}",
                  mp_id, state_id, dist_id, cat_id, agency_id, status,
                  sanctioned_paise, estimated_paise, expend_paise,
                  start_date, expected_end, actual_end))
            proj_id = cur.fetchone()[0]

            # Location
            cur.execute("""
                INSERT INTO project_locations (project_id, latitude, longitude, address)
                VALUES (%s, %s, %s, %s)
            """, (proj_id, lat, lon, f"{v1} Village, {state_name}"))

            # Financials
            util = round(expend_paise / sanctioned_paise * 100, 2) if sanctioned_paise > 0 else 0
            cur.execute("""
                INSERT INTO project_financials
                  (project_id, sanctioned_amount_paise, estimated_cost_paise,
                   total_expenditure_paise, utilization_pct, as_of_date)
                VALUES (%s,%s,%s,%s,%s,%s)
            """, (proj_id, sanctioned_paise, estimated_paise, expend_paise, util, TODAY))

            # Payments
            for p in generate_payments(proj_id, sanctioned_paise, start_date, status):
                cur.execute("""
                    INSERT INTO payments
                      (project_id, payment_date, amount_paise, cumulative_total_paise,
                       payment_type, is_anomalous)
                    VALUES (%s,%s,%s,%s,%s,%s)
                """, (p["project_id"], p["payment_date"], p["amount_paise"],
                      p["cumulative_total_paise"], p["payment_type"], p["is_anomalous"]))

            # Progress
            for pg in generate_progress(proj_id, start_date, expected_end, status):
                cur.execute("""
                    INSERT INTO project_progress
                      (project_id, report_date, reported_progress_pct,
                       expected_progress_pct, progress_status, delay_days)
                    VALUES (%s,%s,%s,%s,%s,%s)
                """, (pg["project_id"], pg["report_date"], pg["reported_progress_pct"],
                      pg["expected_progress_pct"], pg["progress_status"], pg["delay_days"]))

            project_ids_all.append(proj_id)
            total_projects += 1

    conn.commit()
    print(f"   Projects created: {total_projects}")

    # ── Controlled Anomaly Scenarios (SIH Demo) ───────────────
    print("[5/6] Injecting controlled anomaly scenarios...")
    tn_state = states.get("Tamil Nadu", states.get("Karnataka"))
    tn_id = tn_state["id"]
    tn_code = tn_state["code"]
    cat_id_road = categories["Road & Connectivity"]
    cat_id_comm = categories["Community Infrastructure"]
    agency_id_demo = random.choice(agency_ids)

    # Get a district for TN
    cur.execute("SELECT id FROM districts WHERE state_id=%s LIMIT 1", (tn_id,))
    tn_dist = cur.fetchone()
    tn_dist_id = tn_dist[0] if tn_dist else None

    # SCENARIO 1: HIGH RISK — cost anomaly + payment spike + delay
    cur.execute("""
        INSERT INTO projects
          (project_code, name, description, state_id, district_id, category_id, agency_id,
           status, sanctioned_amount_paise, estimated_cost_paise, total_expenditure_paise,
           start_date, expected_end_date, is_demo_data, data_source)
        VALUES
          ('DEMO-ANOMALY-001',
           'Construction of CC Road from Rampur to Nandpur Village',
           'DEMO ANOMALY SCENARIO 1: Cost 68%% above peer median. Payment spike detected. High delay probability.',
           %s, %s, %s, %s,
           'IN_PROGRESS',
           4200000000, 7050000000, 3800000000,
           '2023-03-01', '2025-03-01',
           TRUE, 'SYNTHETIC_ANOMALY')
        RETURNING id
    """, (tn_id, tn_dist_id, cat_id_road, agency_id_demo))
    demo1_id = cur.fetchone()[0]
    BASE_LAT, BASE_LON = 13.0827, 80.2707
    cur.execute("""
        INSERT INTO project_locations (project_id, latitude, longitude, address)
        VALUES (%s, %s, %s, %s)
    """, (demo1_id, BASE_LAT, BASE_LON, "Rampur Village, Tamil Nadu"))

    # Anomalous payments: normal, normal, SPIKE
    cur.execute("INSERT INTO payments (project_id, payment_date, amount_paise, cumulative_total_paise, payment_type, is_anomalous) VALUES (%s,'2023-06-01',500000000,500000000,'DISBURSEMENT',FALSE)", (demo1_id,))
    cur.execute("INSERT INTO payments (project_id, payment_date, amount_paise, cumulative_total_paise, payment_type, is_anomalous) VALUES (%s,'2023-09-15',480000000,980000000,'DISBURSEMENT',FALSE)", (demo1_id,))
    cur.execute("INSERT INTO payments (project_id, payment_date, amount_paise, cumulative_total_paise, payment_type, is_anomalous) VALUES (%s,'2024-01-20',2100000000,3080000000,'DISBURSEMENT',TRUE)", (demo1_id,))
    cur.execute("INSERT INTO payments (project_id, payment_date, amount_paise, cumulative_total_paise, payment_type, is_anomalous) VALUES (%s,'2024-06-10',720000000,3800000000,'DISBURSEMENT',FALSE)", (demo1_id,))

    cur.execute("INSERT INTO project_financials (project_id, sanctioned_amount_paise, estimated_cost_paise, total_expenditure_paise, utilization_pct, as_of_date) VALUES (%s,4200000000,7050000000,3800000000,90.48,'2024-08-30')", (demo1_id,))
    cur.execute("INSERT INTO project_progress (project_id, report_date, reported_progress_pct, expected_progress_pct, progress_status, delay_days) VALUES (%s,'2024-08-30',41.0,72.0,'SEVERELY_DELAYED',221)", (demo1_id,))

    # SCENARIO 2A + 2B: NEAR-DUPLICATE COMMUNITY HALLS
    cur.execute("""
        INSERT INTO projects
          (project_code, name, description, state_id, district_id, category_id, agency_id,
           status, sanctioned_amount_paise, estimated_cost_paise, total_expenditure_paise,
           start_date, expected_end_date, is_demo_data, data_source)
        VALUES
          ('DEMO-DUP-002A', 'Construction of Community Hall at Sundarpur Village',
           'DEMO DUPLICATE SCENARIO 2A: Possibly overlapping with DEMO-DUP-002B.',
           %s, %s, %s, %s, 'IN_PROGRESS',
           1500000000, 1550000000, 800000000,
           '2024-01-15', '2025-07-15', TRUE, 'SYNTHETIC_ANOMALY')
        RETURNING id
    """, (tn_id, tn_dist_id, cat_id_comm, agency_id_demo))
    demo2a = cur.fetchone()[0]
    cur.execute("""
        INSERT INTO projects
          (project_code, name, description, state_id, district_id, category_id, agency_id,
           status, sanctioned_amount_paise, estimated_cost_paise, total_expenditure_paise,
           start_date, expected_end_date, is_demo_data, data_source)
        VALUES
          ('DEMO-DUP-002B', 'Community Centre Construction at Sundarpur Village',
           'DEMO DUPLICATE SCENARIO 2B: Possibly overlapping with DEMO-DUP-002A.',
           %s, %s, %s, %s, 'IN_PROGRESS',
           1600000000, 1650000000, 700000000,
           '2024-02-01', '2025-08-01', TRUE, 'SYNTHETIC_ANOMALY')
        RETURNING id
    """, (tn_id, tn_dist_id, cat_id_comm, agency_id_demo))
    demo2b = cur.fetchone()[0]
    # Place them 0.7 km apart
    LAT_A, LON_A = 12.9716, 80.2200
    LAT_B, LON_B = 12.9716 + 0.0063, 80.2200 + 0.0058  # ~0.7 km
    for proj_id, lat, lon in [(demo2a, LAT_A, LON_A), (demo2b, LAT_B, LON_B)]:
        cur.execute("""
            INSERT INTO project_locations (project_id, latitude, longitude, address)
            VALUES (%s,%s,%s,'Sundarpur Village, Tamil Nadu')
        """, (proj_id, lat, lon))
        cur.execute("INSERT INTO project_financials (project_id, sanctioned_amount_paise, estimated_cost_paise, total_expenditure_paise, utilization_pct, as_of_date) VALUES (%s,1500000000,1550000000,800000000,53.33,'2024-08-30')", (proj_id,))
        cur.execute("INSERT INTO project_progress (project_id, report_date, reported_progress_pct, expected_progress_pct, progress_status, delay_days) VALUES (%s,'2024-08-30',55.0,65.0,'SLIGHT_DELAY',30)", (proj_id,))

    # Register the duplicate pair
    cur.execute("""
        INSERT INTO duplicate_pairs (project_a_id, project_b_id, similarity_score, distance_km, verdict)
        VALUES (%s, %s, 0.91, 0.7, 'POSSIBLE_DUPLICATE')
    """, (demo2a, demo2b))

    # SCENARIO 3: GPS PHOTO MISMATCH
    cur.execute("""
        INSERT INTO projects
          (project_code, name, description, state_id, district_id, category_id, agency_id,
           status, sanctioned_amount_paise, estimated_cost_paise, total_expenditure_paise,
           start_date, expected_end_date, is_demo_data, data_source)
        VALUES
          ('DEMO-PHOTO-003', 'Renovation of Primary Health Centre at Krishnapur',
           'DEMO PHOTO SCENARIO 3: Photo GPS 4.2km from registered project location.',
           %s, %s, %s, %s, 'COMPLETED',
           2000000000, 2050000000, 2030000000,
           '2023-01-10', '2024-01-10', TRUE, 'SYNTHETIC_ANOMALY')
        RETURNING id
    """, (tn_id, tn_dist_id, categories["Healthcare"], agency_id_demo))
    demo3_id = cur.fetchone()[0]
    REG_LAT, REG_LON = 12.9716, 80.2200
    PHOTO_LAT, PHOTO_LON = 12.9716 + 0.038, 80.2200 + 0.033  # ~4.2 km offset
    cur.execute("""
        INSERT INTO project_locations (project_id, latitude, longitude, address)
        VALUES (%s,%s,%s,'Krishnapur Village, Tamil Nadu')
    """, (demo3_id, REG_LAT, REG_LON))
    cur.execute("""
        INSERT INTO photos
          (project_id, filename, exif_gps_lat, exif_gps_lon,
           gps_distance_km, gps_verdict, timestamp_verdict, reuse_verdict, stage_label, is_demo,
           exif_timestamp, upload_timestamp)
        VALUES
          (%s, 'site_photo_demo003.jpg', %s, %s,
           4.2, 'MISMATCH', 'CONSISTENT', 'CLEAN', 'Completion', TRUE,
           '2024-01-08 14:30:00+05:30', '2024-01-09 10:00:00+05:30')
    """, (demo3_id, PHOTO_LAT, PHOTO_LON))
    cur.execute("INSERT INTO project_financials (project_id, sanctioned_amount_paise, estimated_cost_paise, total_expenditure_paise, utilization_pct, as_of_date) VALUES (%s,2000000000,2050000000,2030000000,101.50,'2024-01-15')", (demo3_id,))
    cur.execute("INSERT INTO project_progress (project_id, report_date, reported_progress_pct, expected_progress_pct, progress_status, delay_days) VALUES (%s,'2024-01-10',100.0,100.0,'ON_TRACK',0)", (demo3_id,))

    # SCENARIO 4: TIMESTAMP INCONSISTENCY (photo before project sanction)
    cur.execute("""
        INSERT INTO projects
          (project_code, name, description, state_id, district_id, category_id, agency_id,
           status, sanctioned_amount_paise, estimated_cost_paise, total_expenditure_paise,
           start_date, expected_end_date, is_demo_data, data_source)
        VALUES
          ('DEMO-TSTAMP-004', 'Construction of Drainage Channel in Anandpur Ward',
           'DEMO TIMESTAMP SCENARIO 4: Photo timestamp predates project sanction by 2 months.',
           %s, %s, %s, %s, 'COMPLETED',
           800000000, 820000000, 815000000,
           '2024-03-01', '2024-12-01', TRUE, 'SYNTHETIC_ANOMALY')
        RETURNING id
    """, (tn_id, tn_dist_id, categories["Sanitation & Drainage"], agency_id_demo))
    demo4_id = cur.fetchone()[0]
    D4_LAT, D4_LON = 12.85, 80.15
    cur.execute("""
        INSERT INTO project_locations (project_id, latitude, longitude, address)
        VALUES (%s,%s,%s,'Anandpur Ward, Tamil Nadu')
    """, (demo4_id, D4_LAT, D4_LON))
    # Photo timestamp = January (2 months BEFORE March sanction)
    cur.execute("""
        INSERT INTO photos
          (project_id, filename, exif_gps_lat, exif_gps_lon,
           gps_distance_km, gps_verdict, timestamp_verdict, reuse_verdict, stage_label, is_demo,
           exif_timestamp, upload_timestamp)
        VALUES
          (%s, 'site_photo_demo004.jpg', %s, %s,
           0.1, 'CONSISTENT', 'INCONSISTENCY', 'CLEAN', 'Pre-construction', TRUE,
           '2024-01-15 10:00:00+05:30', '2024-03-10 09:00:00+05:30')
    """, (demo4_id, D4_LAT + 0.001, D4_LON + 0.001))
    cur.execute("INSERT INTO project_financials (project_id, sanctioned_amount_paise, estimated_cost_paise, total_expenditure_paise, utilization_pct, as_of_date) VALUES (%s,800000000,820000000,815000000,101.88,'2024-12-01')", (demo4_id,))
    cur.execute("INSERT INTO project_progress (project_id, report_date, reported_progress_pct, expected_progress_pct, progress_status, delay_days) VALUES (%s,'2024-12-01',100.0,100.0,'ON_TRACK',0)", (demo4_id,))

    conn.commit()
    print("   Anomaly scenarios injected: 4 (cost+payment+delay, 2x duplicate, GPS mismatch, timestamp)")

    # ── Compute initial risk scores ────────────────────────────
    print("[6/6] Computing initial risk scores for all projects...")
    cur.execute("SELECT id, status FROM projects")
    all_projects = cur.fetchall()
    for pid, pstatus in all_projects:
        # Simple heuristic risk score (will be replaced by ML engine in Phase 13)
        base = random.uniform(10, 40)
        if pstatus == "STALLED":
            base += 25
        elif pstatus == "CANCELLED":
            base += 15

        overall = min(100, base)
        level = "LOW" if overall < 31 else "MEDIUM" if overall < 61 else "HIGH" if overall < 81 else "CRITICAL"

        cur.execute("""
            INSERT INTO risk_scores
              (project_id, overall_score, risk_level,
               financial_score, payment_score, delay_score,
               geo_score, duplicate_score, photo_score,
               model_versions, computed_by)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            ON CONFLICT DO NOTHING
        """, (pid, round(overall, 2), level,
              round(random.uniform(5, 35), 2),
              round(random.uniform(5, 30), 2),
              round(random.uniform(5, 35), 2),
              round(random.uniform(0, 20), 2),
              round(random.uniform(0, 15), 2),
              round(random.uniform(0, 20), 2),
              json.dumps({"risk_engine": "heuristic-v0", "note": "Pre-ML heuristic"}),
              "HEURISTIC_V0"))
    conn.commit()

    # Override anomaly project risk scores with realistic high values
    anomaly_scores = [
        (demo1_id,  87, "CRITICAL", 82, 78, 75, 45, 30, 35),
        (demo2a,    52, "MEDIUM",   30, 25, 40, 65, 72, 10),
        (demo2b,    52, "MEDIUM",   28, 22, 38, 65, 72, 10),
        (demo3_id,  74, "HIGH",     35, 20, 10, 60, 10, 88),
        (demo4_id,  68, "HIGH",     20, 15, 10, 15, 10, 82),
    ]
    for pid, overall, level, fin, pay, delay, geo, dup, photo in anomaly_scores:
        cur.execute("""
            UPDATE risk_scores SET
                overall_score=%s, risk_level=%s, financial_score=%s,
                payment_score=%s, delay_score=%s, geo_score=%s,
                duplicate_score=%s, photo_score=%s,
                model_versions=%s, computed_by='HEURISTIC_V0'
            WHERE project_id=%s
        """, (overall, level, fin, pay, delay, geo, dup, photo,
              json.dumps({"risk_engine": "heuristic-v0"}), pid))
    conn.commit()

    # ── Summary ───────────────────────────────────────────────
    cur.execute("SELECT COUNT(*) FROM projects")
    total_proj = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM payments")
    total_pay = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM project_progress")
    total_prog = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM risk_scores")
    total_risk = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM mps")
    total_mps = cur.fetchone()[0]

    print("\n" + "=" * 60)
    print("SYNTHETIC DATA GENERATION COMPLETE")
    print("=" * 60)
    print(f"  MPs (real data):     {total_mps}")
    print(f"  Projects (demo):     {total_proj}")
    print(f"  Payments:            {total_pay}")
    print(f"  Progress records:    {total_prog}")
    print(f"  Risk scores:         {total_risk}")
    print(f"  Anomaly scenarios:   4 controlled demo projects")
    print(f"  Demo users:          6 accounts")
    print()
    print("KEY DEMO PROJECT IDs FOR SIH PRESENTATION:")
    print(f"  DEMO-ANOMALY-001 (id={demo1_id}) → CRITICAL RISK")
    print(f"  DEMO-DUP-002A/B  (id={demo2a}/{demo2b}) → POSSIBLE DUPLICATE")
    print(f"  DEMO-PHOTO-003   (id={demo3_id}) → GPS MISMATCH")
    print(f"  DEMO-TSTAMP-004  (id={demo4_id}) → TIMESTAMP INCONSISTENCY")
    print("=" * 60)

    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
