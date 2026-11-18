from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field

from app.schemas.incidents import IncidentCategory


class LiveFocusSummary(BaseModel):
    """Sinais agregados da sessão. Nenhum campo identifica estudantes."""

    active_devices: int = Field(default=0, ge=0)
    focus_lost_events: int = Field(default=0, ge=0)
    safety_alerts: int = Field(default=0, ge=0)
    open_incidents: int = Field(default=0, ge=0)
    elapsed_minutes: int = Field(default=0, ge=0)
    incident_categories: dict[IncidentCategory, int] = Field(default_factory=dict)


class AILiveGuidanceRequest(BaseModel):
    session_id: str = Field(min_length=1)
    objective: str = Field(min_length=10, max_length=500)
    focus: LiveFocusSummary = Field(default_factory=LiveFocusSummary)


class ProtecaState(str, Enum):
    ACOLHIMENTO = "acolhimento"
    CURIOSIDADE = "curiosidade"
    ALERTA = "alerta"


class ProtecaIntervention(BaseModel):
    state: ProtecaState
    title: str = Field(min_length=1, max_length=120)
    message: str = Field(min_length=1, max_length=500)
    prompt: str = Field(min_length=1, max_length=300)


class AILiveGuidanceResponse(BaseModel):
    session_id: str
    model: str
    generated_at: datetime
    attention_level: str
    observed_pattern: str
    teacher_suggestions: list[str] = Field(min_length=1, max_length=2)
    intervention: ProtecaIntervention | None = None
    limitations: str
    signals: LiveFocusSummary
    is_mock: bool = True
