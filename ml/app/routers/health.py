"""
Health Router — liveness + model readiness checks
"""
from fastapi import APIRouter
from app.model_loader import models_ready, delay_meta, overrun_meta, iso_meta

router = APIRouter()


@router.get("/")
def health():
    ready = models_ready()
    return {
        "status": "UP",
        "service": "MPLADS Sentinel ML Service",
        "version": "1.0.0",
        "models": ready,
        "all_models_ready": all(ready.values()),
        "mode": "DEMO",
        "note": "Predictions based on 558 synthetic MPLADS projects",
    }


@router.get("/models")
def model_info():
    return {
        "delay_classifier": {
            "ready": models_ready()["delay_classifier"],
            "meta": delay_meta,
        },
        "overrun_regressor": {
            "ready": models_ready()["overrun_regressor"],
            "meta": overrun_meta,
        },
        "isolation_forest": {
            "ready": models_ready()["isolation_forest"],
            "meta": iso_meta,
        },
    }
