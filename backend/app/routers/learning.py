from fastapi import APIRouter, Query

from app.schemas.schemas import LearningContextResponse
from app.services.learning_context import search_learning_context


router = APIRouter(
    prefix="/learning",
    tags=["Contexto de aprendizagem"],
)


@router.get(
    "/context",
    response_model=LearningContextResponse,
)
def learning_context(
    query: str = Query(min_length=3, max_length=120),
):
    return search_learning_context(query)
