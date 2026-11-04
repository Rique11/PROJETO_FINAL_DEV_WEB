from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Vigia Escolar API"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://plreis.github.io",
    ]
    SECRET_KEY: str = "insecure-default-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    GEMINI_MODEL: str = "gemini-1.5-flash"

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
