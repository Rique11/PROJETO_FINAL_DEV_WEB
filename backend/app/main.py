import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends
from app.core.config import settings
from app.core.errors import register_error_handlers
from app.auth.middleware import get_current_user
from app.routers import (
    auth,   
    devices,
    health,
    ia,
    incidents,
    learning,
    school,
    sessions,
    telemetry,
)

logging.basicConfig(level=logging.INFO)
logging.getLogger("httpx").setLevel(logging.WARNING)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description=(
        "API da Proteca: sessões de aula, dispositivos escolares, ocorrências, "
        "telemetria leve e orientação pedagógica com Gemini."
    ),
)

if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=False,
        allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type"],
    )

register_error_handlers(app)
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(health.router, prefix=settings.API_V1_STR)
for module in (school, devices, sessions, incidents, telemetry, ia, learning):
    app.include_router(
        module.router,
        prefix=settings.API_V1_STR,
        dependencies=[Depends(get_current_user)],
    )


@app.get("/", include_in_schema=False)
def root():
    return {
        "sistema": settings.PROJECT_NAME,
        "status": "online",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health",
    }
