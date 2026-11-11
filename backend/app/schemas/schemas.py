from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from enum import Enum

class UserBase(BaseModel):
    id: str
    name: str
    email: str
    role: str  # admin, aluno, professor




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



## Secções de Aula
class SessionCreate(BaseModel):
    classroom_id: str
    teacher_name: str = Field(min_length=3, max_length=120)
    objective: str = Field(min_length=10, max_length=500)
    device_ids: list[str] = Field(default_factory=list)


class SessionClose(BaseModel):
    justification: str = Field(min_length=10, max_length=500)

class SessionStatus(str, Enum):
    ABERTA = "aberta"
    ENCERRADA = "encerrada"

class SessionResponse(BaseModel):
    id: str
    classroom_id: str
    teacher_name: str
    objective: str
    status: SessionStatus
    started_at: datetime
    ended_at: datetime | None = None
    device_ids: list[str] = Field(default_factory=list)
    closing_justification: str | None = None


### Incidentes
class IncidentStatus(str, Enum):
    ABERTA = "aberta"
    EM_ANALISE = "em_analise"
    ENCERRADA = "encerrada"


class IncidentCategory(str, Enum):
    USO_NAO_PEDAGOGICO = "uso_nao_pedagogico"
    ACESSO_INDEVIDO = "acesso_indevido"
    PRIVACIDADE_EXPOSICAO = "privacidade_exposicao"
    DANO_FISICO_EQUIPAMENTO = "dano_fisico_equipamento"
    DESVIO_FOCO = "desvio_foco"

class IncidentCreate(BaseModel):
    session_id: str
    device_id: str | None = None
    category: IncidentCategory
    description: str = Field(min_length=10, max_length=1000)


class IncidentStatusUpdate(BaseModel):
    status: IncidentStatus
    justification: str | None = Field(
        default=None,
        min_length=10,
        max_length=500,
    )


class IncidentResponse(BaseModel):
    id: str
    session_id: str
    device_id: str | None = None
    category: IncidentCategory
    description: str
    status: IncidentStatus
    created_at: datetime
    updated_at: datetime | None = None
    closing_justification: str | None = None

### IA 
class AIPedagogicalAdviceRequest(BaseModel):
    session_id: str


class AIPedagogicalAdviceResponse(BaseModel):
    session_id: str
    model: str
    generated_at: datetime
    summary: str
    observed_patterns: list[str]
    pedagogical_recommendations: list[str]
    limitations: str
    evidence_incident_ids: list[str]
    is_mock: bool = False