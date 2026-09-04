"""
Model Loader — Loads all trained models once at startup.
Routers import from here (singleton pattern).
"""
import os
import json
import logging
from pathlib import Path

import joblib
import numpy as np

logger = logging.getLogger(__name__)

# Models are saved to data/models/ by train_models.py
MODELS_DIR = Path(__file__).parents[2] / "data" / "models"


def _load(name: str):
    path = MODELS_DIR / name
    if not path.exists():
        logger.warning(f"Model file not found: {path}")
        return None
    try:
        obj = joblib.load(path)
        logger.info(f"Loaded {name}")
        return obj
    except Exception as e:
        logger.error(f"Failed to load {name}: {e}")
        return None


def _load_meta(name: str) -> dict:
    path = MODELS_DIR / name
    if not path.exists():
        return {}
    with open(path) as f:
        return json.load(f)


# ── Singletons ──────────────────────────────────────────────
_delay_bundle     = _load("xgb_delay.pkl")        # {"model": ..., "explainer": ...}
_overrun_bundle   = _load("xgb_overrun.pkl")
_iso_forest       = _load("isolation_forest.pkl")
_le_category      = _load("le_category.pkl")
_le_state         = _load("le_state.pkl")

delay_meta   = _load_meta("xgb_delay_meta.json")
overrun_meta = _load_meta("xgb_overrun_meta.json")
iso_meta     = _load_meta("isolation_forest_meta.json")

# Public accessors
def get_delay_model():
    return _delay_bundle["model"]   if _delay_bundle else None

def get_delay_explainer():
    return _delay_bundle["explainer"] if _delay_bundle else None

def get_overrun_model():
    return _overrun_bundle["model"]   if _overrun_bundle else None

def get_overrun_explainer():
    return _overrun_bundle["explainer"] if _overrun_bundle else None

def get_iso_forest():
    return _iso_forest

def get_le_category():
    return _le_category

def get_le_state():
    return _le_state

def models_ready() -> dict:
    return {
        "delay_classifier":    _delay_bundle is not None,
        "overrun_regressor":   _overrun_bundle is not None,
        "isolation_forest":    _iso_forest is not None,
        "label_encoders":      _le_category is not None and _le_state is not None,
    }

DELAY_FEATURES = [
    "elapsed_pct", "reported_progress_pct", "expected_progress_pct",
    "progress_gap", "utilization_pct", "cost_ratio", "payment_count",
    "payment_spike_ratio", "category_enc", "state_enc", "total_days",
]
OVERRUN_FEATURES = [
    "elapsed_pct", "utilization_pct", "cost_ratio", "payment_count",
    "payment_spike_ratio", "progress_gap", "category_enc", "state_enc",
    "reported_progress_pct",
]
FINANCIAL_FEATURES = [
    "utilization_pct", "cost_ratio", "payment_count",
    "payment_spike_ratio", "progress_gap",
]
