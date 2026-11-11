from typing import Annotated, Optional

from fastapi import APIRouter, Depends, status

from app.core.dependencies import get_memory_repository
from app.repositories.memory_repo import MemoryRepository
from app.schemas.schemas import (
    TelemetryEventCreate,
    TelemetryEventResponse,
)


router = APIRouter(
    prefix="/telemetry",
    tags=["Telemetria"],
)

RepositoryDependency = Annotated[
    MemoryRepository,
    Depends(get_memory_repository),
]


@router.post(
    "",
    response_model=TelemetryEventResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_telemetry_event(
    data: TelemetryEventCreate,
    repository: RepositoryDependency,
):
    return repository.create_telemetry_event(data)


@router.get(
    "",
    response_model=list[TelemetryEventResponse],
)
def list_telemetry_events(
    repository: RepositoryDependency,
    session_id: Optional[str] = None,
    device_id: Optional[str] = None,
):
    return repository.list_telemetry_events(
        session_id=session_id,
        device_id=device_id,
    )