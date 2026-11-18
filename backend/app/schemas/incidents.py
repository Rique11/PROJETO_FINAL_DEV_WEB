from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field, model_validator


class IncidentCategory(str, Enum):
    USO_NAO_PEDAGOGICO = "uso_nao_pedagogico"
    ACESSO_INDEVIDO = "acesso_indevido"
    PRIVACIDADE_EXPOSICAO = "privacidade_exposicao"
    DANO_FISICO_EQUIPAMENTO = "dano_fisico_equipamento"
    DESVIO_FOCO = "desvio_foco"


class IncidentStatus(str, Enum):
    ABERTA = "aberta"
    EM_ANALISE = "em_analise"
    ENCERRADA = "encerrada"


class IncidentActionLog(BaseModel):
    id: str
    timestamp: datetime
    action: str
    author: str
    note: str = ""


class IncidentCreate(BaseModel):
    session_id: str = Field(min_length=1)
    device_id: str | None = None
    category: IncidentCategory
    description: str = Field(min_length=10, max_length=1000)


class IncidentStatusUpdate(BaseModel):
    status: IncidentStatus
    justification: str | None = Field(default=None, min_length=10, max_length=500)

    @model_validator(mode="after")
    def closing_requires_justification(self) -> "IncidentStatusUpdate":
        if self.status == IncidentStatus.ENCERRADA and not self.justification:
            raise ValueError("A justificativa é obrigatória para encerrar uma ocorrência.")
        return self


class IncidentResponse(BaseModel):
    id: str
    school_id: str
    session_id: str
    device_id: str | None = None
    category: IncidentCategory
    description: str
    status: IncidentStatus
    created_at: datetime
    updated_at: datetime | None = None
    closing_justification: str | None = None
    actions: list[IncidentActionLog] = Field(default_factory=list)
