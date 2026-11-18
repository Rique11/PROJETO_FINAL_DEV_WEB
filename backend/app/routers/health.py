from fastapi import APIRouter

from app.core.config import settings

router = APIRouter(tags=["Saúde"])


@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "storage": "memory",
        "ai_provider": "gemini" if settings.ai_enabled else "local-fallback",
        "ai_model": settings.GEMINI_MODEL if settings.ai_enabled else None,
    }
