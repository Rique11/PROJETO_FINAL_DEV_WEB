from typing import Optional

from fastapi import APIRouter, status

from app.core.dependencies import MemoryRepositoryDependency
from app.schemas.schemas import (
    TelemetryEventCreate,
    TelemetryEventResponse,
)


router = APIRouter(
    prefix="/telemetry",
    tags=["Telemetria"],
)


@router.post(
    "",
    response_model=TelemetryEventResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_telemetry_event(
    data: TelemetryEventCreate,
    repository: MemoryRepositoryDependency,
):
    return repository.create_telemetry_event(data)


@router.get(
    "",
    response_model=list[TelemetryEventResponse],
)
def list_telemetry_events(
    repository: MemoryRepositoryDependency,
    session_id: Optional[str] = None,
    device_id: Optional[str] = None,
):
    return repository.list_telemetry_events(
        session_id=session_id,
        device_id=device_id,
    )