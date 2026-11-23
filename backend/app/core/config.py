from typing import Annotated, List

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

INSECURE_SECRET_KEY = "insecure-default-change-in-production"
EXAMPLE_SECRET_KEYS = {
    INSECURE_SECRET_KEY,
    "troque-esta-chave",
    "exemplo-chave-secreta-alterar-em-producao",
}


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )

    PROJECT_NAME: str = "Proteca API"
    VERSION: str = "0.2.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    BACKEND_CORS_ORIGINS: Annotated[List[str], NoDecode] = [
        "http://localhost:3000",
    ]

    # JWT (Sprint 3)
    SECRET_KEY: str = INSECURE_SECRET_KEY
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    SENHA_TESTE_HASH: str = "COLE_AQUI_O_HASH_GERADO"  # Hash de senha para teste (Sprint 3)
    # Banco de dados (Sprint 4). Sem valor, a API usa o repositório em memória.
    DATABASE_URL: str | None = None
    SEED_DEMO_DATA: bool = True

    # Gemini: a chave fica só no servidor.
    GEMINI_API_KEY: str | None = None
    GEMINI_MODEL: str = "gemini-flash-latest"
    GEMINI_TIMEOUT_SECONDS: float = 20.0

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | List[str]) -> List[str]:
        if isinstance(value, str):
            return [origin.strip().rstrip("/") for origin in value.split(",") if origin.strip()]
        return value

    @field_validator("GEMINI_API_KEY", "DATABASE_URL", mode="before")
    @classmethod
    def empty_string_is_none(cls, value: str | None) -> str | None:
        if isinstance(value, str) and not value.strip():
            return None
        return value

    @model_validator(mode="after")
    def require_real_secret_in_production(self) -> "Settings":
        weak = self.SECRET_KEY in EXAMPLE_SECRET_KEYS or len(self.SECRET_KEY) < 32
        if self.ENVIRONMENT == "production" and weak:
            raise ValueError("Defina uma SECRET_KEY forte (32+ caracteres) em produção.")
        return self

    @property
    def ai_enabled(self) -> bool:
        return bool(self.GEMINI_API_KEY)


settings = Settings()
