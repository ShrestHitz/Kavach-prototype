"""
Prediction Router — XGBoost Delay Classifier + Cost Overrun Regressor
Both models load from trained .pkl files via model_loader.py
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import numpy as np

from app.model_loader import (
    get_delay_model, get_delay_explainer,
    get_overrun_model, get_overrun_explainer,
    get_le_category, get_le_state,
    DELAY_FEATURES, OVERRUN_FEATURES, models_ready,
)

router = APIRouter()

MODEL_VERSION = "1.0.0"


# ── Request / Response models ─────────────────────────────────

class DelayRequest(BaseModel):
    project_id: str
    category: str
    state: str
    sanctioned_amount: float        # in Rs
    estimated_cost: float           # in Rs
    total_expenditure: float        # in Rs
    project_duration_days: int
    elapsed_days: int
    reported_progress_pct: float
    expected_progress_pct: float = 0.0
    payment_count: int = 0
    max_single_payment: float = 0.0
    agency_id: Optional[str] = None


class DelayResponse(BaseModel):
    project_id: str
    delay_probability: float
    prediction_label: str           # ON_TRACK | LIKELY_DELAYED
    confidence_pct: float
    shap_top_factors: list
    risk_drivers: list
    model_version: str
    status: str
    note: str


class OverrunRequest(BaseModel):
    project_id: str
    category: str
    state: str
    sanctioned_amount: float
    estimated_cost: float
    total_expenditure: float
    reported_progress_pct: float
    expected_progress_pct: float = 0.0
    project_duration_days: int
    elapsed_days: int
    payment_count: int = 0
    max_single_payment: float = 0.0


class OverrunResponse(BaseModel):
    project_id: str
    predicted_overrun_ratio: float
    predicted_final_cost: float
    overrun_amount: float
    overrun_pct: float
    prediction_label: str           # ON_BUDGET | OVERRUN_RISK | MAJOR_OVERRUN
    shap_top_factors: list
    model_version: str
    status: str
    note: str


# ── Feature builder helpers ───────────────────────────────────

def _encode_cat(le, value: str) -> int:
    try:
        return int(le.transform([value])[0])
    except Exception:
        return 0  # fallback: unknown category → 0


def _build_delay_features(req: DelayRequest) -> np.ndarray:
    le_cat   = get_le_category()
    le_state = get_le_state()

    total_days   = max(req.project_duration_days, 1)
    elapsed_days = max(req.elapsed_days, 0)
    sanctioned   = max(req.sanctioned_amount, 1)

    elapsed_pct        = min(elapsed_days / total_days * 100, 150)
    utilization_pct    = min(req.total_expenditure / sanctioned * 100, 300)
    cost_ratio         = min(req.estimated_cost / sanctioned, 5)
    progress_gap       = req.expected_progress_pct - req.reported_progress_pct
    payment_spike_ratio = min(req.max_single_payment / sanctioned, 5)
    category_enc       = _encode_cat(le_cat,   req.category)  if le_cat   else 0
    state_enc          = _encode_cat(le_state, req.state)     if le_state else 0

    row = {
        "elapsed_pct":          elapsed_pct,
        "reported_progress_pct": req.reported_progress_pct,
        "expected_progress_pct": req.expected_progress_pct,
        "progress_gap":         progress_gap,
        "utilization_pct":      utilization_pct,
        "cost_ratio":           cost_ratio,
        "payment_count":        req.payment_count,
        "payment_spike_ratio":  payment_spike_ratio,
        "category_enc":         category_enc,
        "state_enc":            state_enc,
        "total_days":           total_days,
    }
    return np.array([[row[f] for f in DELAY_FEATURES]])


def _build_overrun_features(req: OverrunRequest) -> np.ndarray:
    le_cat   = get_le_category()
    le_state = get_le_state()

    total_days   = max(req.project_duration_days, 1)
    elapsed_days = max(req.elapsed_days, 0)
    sanctioned   = max(req.sanctioned_amount, 1)

    elapsed_pct         = min(elapsed_days / total_days * 100, 150)
    utilization_pct     = min(req.total_expenditure / sanctioned * 100, 300)
    cost_ratio          = min(req.estimated_cost / sanctioned, 5)
    progress_gap        = req.expected_progress_pct - req.reported_progress_pct
    payment_spike_ratio = min(req.max_single_payment / sanctioned, 5)
    category_enc        = _encode_cat(le_cat,   req.category)  if le_cat   else 0
    state_enc           = _encode_cat(le_state, req.state)     if le_state else 0

    row = {
        "elapsed_pct":           elapsed_pct,
        "utilization_pct":       utilization_pct,
        "cost_ratio":            cost_ratio,
        "payment_count":         req.payment_count,
        "payment_spike_ratio":   payment_spike_ratio,
        "progress_gap":          progress_gap,
        "category_enc":          category_enc,
        "state_enc":             state_enc,
        "reported_progress_pct": req.reported_progress_pct,
    }
    return np.array([[row[f] for f in OVERRUN_FEATURES]])


def _shap_top(explainer, X: np.ndarray, feature_names: list, n: int = 5) -> list:
    """Return top N SHAP factors with human-readable names."""
    try:
        sv = explainer.shap_values(X)
        # For classifier, sv may be a list [class0, class1]
        vals = sv[1][0] if isinstance(sv, list) else sv[0]
        pairs = sorted(zip(feature_names, vals), key=lambda x: abs(x[1]), reverse=True)[:n]
        return [{"feature": f, "shap_value": round(float(v), 4)} for f, v in pairs]
    except Exception:
        return []


DELAY_LABELS = {
    "elapsed_pct":           "Timeline elapsed %",
    "reported_progress_pct": "Reported progress",
    "expected_progress_pct": "Expected progress",
    "progress_gap":          "Progress gap (expected − actual)",
    "utilization_pct":       "Fund utilization %",
    "cost_ratio":            "Cost ratio (estimated/sanctioned)",
    "payment_count":         "Number of payments",
    "payment_spike_ratio":   "Payment spike ratio",
    "category_enc":          "Project category",
    "state_enc":             "State",
    "total_days":            "Project duration (days)",
}


# ── Endpoints ─────────────────────────────────────────────────

@router.post("/predict-delay", response_model=DelayResponse)
def predict_delay(req: DelayRequest):
    """XGBoost delay classifier — predicts probability project will be delayed > 30 days."""
    model     = get_delay_model()
    explainer = get_delay_explainer()

    if model is None:
        raise HTTPException(503, "Delay model not loaded. Run data/synthetic/train_models.py first.")

    X    = _build_delay_features(req)
    prob = float(model.predict_proba(X)[0][1])
    label = "LIKELY_DELAYED" if prob >= 0.5 else "ON_TRACK"
    conf  = round(max(prob, 1 - prob) * 100, 1)

    shap_factors = _shap_top(explainer, X, DELAY_FEATURES) if explainer else []
    risk_drivers = [
        DELAY_LABELS.get(f["feature"], f["feature"])
        for f in shap_factors if abs(f["shap_value"]) > 0.01
    ]

    return DelayResponse(
        project_id=req.project_id,
        delay_probability=round(prob, 4),
        prediction_label=label,
        confidence_pct=conf,
        shap_top_factors=shap_factors,
        risk_drivers=risk_drivers,
        model_version=MODEL_VERSION,
        status="OK",
        note="DEMO DATA — Prediction based on synthetic training data",
    )


@router.post("/predict-cost-overrun", response_model=OverrunResponse)
def predict_cost_overrun(req: OverrunRequest):
    """XGBoost cost overrun regressor — predicts final cost ratio vs sanctioned amount."""
    model     = get_overrun_model()
    explainer = get_overrun_explainer()

    if model is None:
        raise HTTPException(503, "Overrun model not loaded. Run data/synthetic/train_models.py first.")

    X             = _build_overrun_features(req)
    overrun_ratio = float(model.predict(X)[0])
    final_cost    = overrun_ratio * req.sanctioned_amount
    overrun_amt   = max(final_cost - req.sanctioned_amount, 0)
    overrun_pct   = round((overrun_ratio - 1) * 100, 2)

    if overrun_ratio > 1.25:
        label = "MAJOR_OVERRUN"
    elif overrun_ratio > 1.05:
        label = "OVERRUN_RISK"
    else:
        label = "ON_BUDGET"

    shap_factors = _shap_top(explainer, X, OVERRUN_FEATURES) if explainer else []

    return OverrunResponse(
        project_id=req.project_id,
        predicted_overrun_ratio=round(overrun_ratio, 4),
        predicted_final_cost=round(final_cost, 2),
        overrun_amount=round(overrun_amt, 2),
        overrun_pct=overrun_pct,
        prediction_label=label,
        shap_top_factors=shap_factors,
        model_version=MODEL_VERSION,
        status="OK",
        note="DEMO DATA — Prediction based on synthetic training data",
    )


@router.get("/models/status")
def model_status():
    """Check which models are loaded and ready."""
    ready = models_ready()
    return {
        "models": ready,
        "all_ready": all(ready.values()),
        "version": MODEL_VERSION,
    }
