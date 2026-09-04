"""
Anomaly Detection Router — Isolation Forest for financial anomalies
Also provides batch scoring for all projects from the DB.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import numpy as np
import os
import psycopg2

from app.model_loader import get_iso_forest, FINANCIAL_FEATURES, models_ready

router = APIRouter()

DB_CONFIG = {
    "host":     os.getenv("POSTGRES_HOST", "localhost"),
    "port":     int(os.getenv("POSTGRES_PORT", 5432)),
    "dbname":   os.getenv("POSTGRES_DB", "mplads_sentinel"),
    "user":     os.getenv("POSTGRES_USER", "sentinel_user"),
    "password": os.getenv("POSTGRES_PASSWORD", "SentinelDB@2026!"),
}


# ── Request / Response ────────────────────────────────────────

class AnomalyRequest(BaseModel):
    project_id: str
    utilization_pct: float
    cost_ratio: float
    payment_count: int
    max_single_payment: float
    sanctioned_amount: float
    progress_gap: float = 0.0


class AnomalyResponse(BaseModel):
    project_id: str
    is_anomaly: bool
    anomaly_score: float            # lower = more anomalous
    anomaly_score_normalized: float # 0–100, higher = more anomalous
    anomaly_label: str              # NORMAL | SUSPICIOUS | ANOMALY
    flags: List[str]
    model_version: str
    status: str


# ── Helpers ───────────────────────────────────────────────────

def _normalize_score(raw: float) -> float:
    """Isolation Forest score: roughly [-0.2, +0.2]. Normalize to 0–100 anomaly scale."""
    # More negative = more anomalous. Flip and scale.
    clipped = max(-0.3, min(0.3, raw))
    normalized = (0.3 - clipped) / 0.6 * 100
    return round(normalized, 1)


def _build_rule_flags(req: AnomalyRequest) -> List[str]:
    """Rule-based flags complement the ML anomaly score."""
    flags = []
    payment_spike = req.max_single_payment / max(req.sanctioned_amount, 1)
    if payment_spike > 0.5:
        flags.append(f"Single payment = {payment_spike*100:.0f}% of total sanction")
    if req.cost_ratio > 1.3:
        flags.append(f"Estimated cost {(req.cost_ratio - 1)*100:.0f}% above sanction")
    if req.utilization_pct > 100:
        flags.append(f"Expenditure exceeds sanction ({req.utilization_pct:.0f}%)")
    if req.progress_gap > 30:
        flags.append(f"Progress gap: {req.progress_gap:.0f}% behind expected")
    if req.payment_count == 0 and req.utilization_pct > 10:
        flags.append("Expenditure recorded but no payment entries found")
    return flags


# ── Endpoints ─────────────────────────────────────────────────

@router.post("/detect-anomaly", response_model=AnomalyResponse)
def detect_anomaly(req: AnomalyRequest):
    """Isolation Forest — detects financial anomalies in a single project."""
    iso = get_iso_forest()
    if iso is None:
        raise HTTPException(503, "Isolation Forest not loaded. Run data/synthetic/train_models.py first.")

    payment_spike = req.max_single_payment / max(req.sanctioned_amount, 1)
    X = np.array([[
        req.utilization_pct,
        req.cost_ratio,
        req.payment_count,
        payment_spike,
        req.progress_gap,
    ]])

    prediction = iso.predict(X)[0]          # -1 = anomaly, 1 = normal
    raw_score  = float(iso.decision_function(X)[0])
    norm_score = _normalize_score(raw_score)
    is_anomaly = (prediction == -1)

    if norm_score > 70:
        label = "ANOMALY"
    elif norm_score > 45:
        label = "SUSPICIOUS"
    else:
        label = "NORMAL"

    flags = _build_rule_flags(req)

    return AnomalyResponse(
        project_id=req.project_id,
        is_anomaly=is_anomaly,
        anomaly_score=round(raw_score, 4),
        anomaly_score_normalized=norm_score,
        anomaly_label=label,
        flags=flags,
        model_version="1.0.0",
        status="OK",
    )


@router.get("/anomaly-batch")
def anomaly_batch_score():
    """
    Batch-score all demo projects from the DB.
    Returns top 20 most anomalous with scores and flags.
    """
    iso = get_iso_forest()
    if iso is None:
        raise HTTPException(503, "Isolation Forest not loaded.")

    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur  = conn.cursor()
        cur.execute("""
            SELECT
                p.id, p.project_code, p.name,
                COALESCE(p.total_expenditure_paise::float / NULLIF(p.sanctioned_amount_paise,0) * 100, 0) AS utilization_pct,
                COALESCE(p.estimated_cost_paise::float / NULLIF(p.sanctioned_amount_paise,0), 1)          AS cost_ratio,
                COALESCE(pay_agg.payment_count, 0) AS payment_count,
                COALESCE(pay_agg.max_payment::float / NULLIF(p.sanctioned_amount_paise,0), 0)             AS payment_spike_ratio,
                COALESCE(pp.expected_progress_pct - pp.reported_progress_pct, 0)                          AS progress_gap,
                p.status,
                s.name AS state_name
            FROM projects p
            JOIN states s ON s.id = p.state_id
            LEFT JOIN LATERAL (
                SELECT COUNT(*) AS payment_count, MAX(amount_paise) AS max_payment
                FROM payments WHERE project_id = p.id
            ) pay_agg ON TRUE
            LEFT JOIN LATERAL (
                SELECT expected_progress_pct, reported_progress_pct
                FROM project_progress WHERE project_id = p.id
                ORDER BY report_date DESC LIMIT 1
            ) pp ON TRUE
            WHERE p.is_demo_data = TRUE
        """)
        rows = cur.fetchall()
        cur.close(); conn.close()
    except Exception as e:
        raise HTTPException(500, f"DB error: {e}")

    results = []
    for row in rows:
        pid, code, name, util, cost_ratio, pay_count, spike, gap, status, state = row
        X = np.array([[float(util), float(cost_ratio), int(pay_count), float(spike), float(gap)]])
        raw  = float(iso.decision_function(X)[0])
        norm = _normalize_score(raw)
        pred = iso.predict(X)[0]
        results.append({
            "project_id":   pid,
            "project_code": code,
            "name":         name,
            "state":        state,
            "status":       status,
            "anomaly_score": norm,
            "is_anomaly":   bool(pred == -1),
            "anomaly_label": "ANOMALY" if norm > 70 else "SUSPICIOUS" if norm > 45 else "NORMAL",
        })

    # Sort by anomaly score descending, return top 20
    results.sort(key=lambda x: x["anomaly_score"], reverse=True)
    return {
        "total_scored":  len(results),
        "anomalies_found": sum(1 for r in results if r["is_anomaly"]),
        "top_anomalies": results[:20],
        "note": "DEMO DATA — Isolation Forest scores on synthetic project data",
    }
