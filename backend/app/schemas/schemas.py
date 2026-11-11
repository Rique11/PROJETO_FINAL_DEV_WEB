from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from pydantic import BaseModel, Field

class ClassroomBase(BaseModel):
    id: str
    name: str
    grade: str


class DeviceBase(BaseModel):
    id: str
    patrimonio: str
    type: str  # chromebook, tablet, notebook
    model: str
    status: str  # disponivel, em_uso, manutencao


class IncidentBase(BaseModel):
    id: str
    session_id: str
    device_id: Optional[str] = None
    category: str
    description: str = Field(min_length=10, max_length=1000)
    status: str  # aberta, em_analise, encerrada
    created_at: datetime
    updated_at: Optional[datetime] = None
    closing_justification: Optional[str] = None


class LessonSessionBase(BaseModel):
    id: str
    classroom_id: str
    teacher_name: str
    objective: str
    status: str  # aberta, encerrada
    started_at: datetime
    ended_at: Optional[datetime] = None
    device_ids: List[str] = []
    closing_justification: Optional[str] = None


class AIAnalysisResponse(BaseModel):
    session_id: str
    model: str
    generated_at: datetime
    summary: str
    observed_patterns: List[str]
    pedagogical_recommendations: List[str]
    limitations: str
    evidence_incident_ids: List[str]
    is_mock: bool = True


## Telemetria

class TelemetryEventType(str, Enum):
    FOCO_PERDIDO = "foco_perdido"
    FOCO_RECUPERADO = "foco_recuperado"
    ALERTA = "alerta"

class TelemetryEventCreate(BaseModel):
    session_id: str = Field(min_length=1)
    device_id: str = Field(min_length=1)
    event_type: TelemetryEventType
    occurred_at: datetime
    duration_seconds: Optional[int] = Field(
        default=None,
        ge=0,
        le=86400,
    )

class TelemetryEventResponse(TelemetryEventCreate):
    id: str
    received_at: datetime