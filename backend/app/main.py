from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import health

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Backend FastAPI para o sistema Vigia Escolar. Gerencia sessões pedagógicas, registro de ocorrências e integração com Gemini.",
    version="0.1.0",
)

# Configuração de CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Roteador de saúde
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["Saúde"])


@app.get("/")
def root():
    return {
        "sistema": settings.PROJECT_NAME,
        "status": "online",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health",
    }
