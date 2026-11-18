from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class TelemetryEventType(str, Enum):
    FOCO_PERDIDO = "foco_perdido"
    FOCO_RECUPERADO = "foco_recuperado"
    ALERTA = "alerta"


class TelemetryEventCreate(BaseModel):
    session_id: str = Field(min_length=1)
    device_id: str = Field(min_length=1)
    event_type: TelemetryEventType
    occurred_at: datetime
    duration_seconds: int | None = Field(default=None, ge=0, le=86400)


class TelemetryEventResponse(TelemetryEventCreate):
    id: str
    received_at: datetime
