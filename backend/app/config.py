import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "TribEd - Ministry of Tribal Affairs Orchestrator"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://tribed_user:tribed_password_secure@localhost:5432/tribed_db"
    )
    SECRET_KEY: str = os.getenv("SECRET_KEY", "tribed_demo_secret_2026")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEMO_MODE: bool = True

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
