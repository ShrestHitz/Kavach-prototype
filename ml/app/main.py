"""
MPLADS Sentinel — ML Service
FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health, anomaly, predict, similarity, photo, reports
from app.config import settings

app = FastAPI(
    title="MPLADS Sentinel ML Service",
    description="AI/ML inference service for MPLADS Sentinel platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow frontend + Spring Boot backend to call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.BACKEND_URL,
        "http://localhost:8080",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(health.router, prefix="/api/ml", tags=["Health"])
app.include_router(anomaly.router, prefix="/api/ml", tags=["Anomaly Detection"])
app.include_router(predict.router, prefix="/api/ml", tags=["Predictions"])
app.include_router(similarity.router, prefix="/api/ml", tags=["Similarity"])
app.include_router(photo.router, prefix="/api/ml", tags=["Photo Verification"])
app.include_router(reports.router, prefix="/api/ml", tags=["Reports"])


@app.get("/")
def root():
    return {
        "service": "MPLADS Sentinel ML Service",
        "version": "1.0.0",
        "status": "running",
        "note": "DEMO DATA MODE — All predictions based on synthetic demo data",
    }
