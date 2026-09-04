"""
MPLADS Sentinel ML Service — Configuration
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Service
    ML_SERVICE_PORT: int = 8000
    BACKEND_URL: str = "http://localhost:8080"

    # Database
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "mplads_sentinel"
    POSTGRES_USER: str = "sentinel_user"
    POSTGRES_PASSWORD: str = "SentinelDB@2026!"

    # Model paths
    MODELS_DIR: str = "models"

    # App mode
    APP_MODE: str = "demo"

    class Config:
        env_file = "../.env"
        extra = "ignore"


settings = Settings()
