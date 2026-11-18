from collections import Counter
from datetime import datetime, timezone

from app.repositories.memory_repo import MemoryRepository
from app.schemas.ai import AILiveGuidanceRequest, LiveFocusSummary
from app.schemas.incidents import IncidentCategory, IncidentStatus
from app.schemas.sessions import SessionResponse
from app.schemas.telemetry import TelemetryEventType

SAFETY_CATEGORIES = {
    IncidentCategory.PRIVACIDADE_EXPOSICAO,
    IncidentCategory.ACESSO_INDEVIDO,
}


def summarize_session(
    repository: MemoryRepository,
    session: SessionResponse,
    now: datetime | None = None,
) -> LiveFocusSummary:
    """Conta eventos e ocorrências da sessão sem expor descrições ou dispositivos."""
    now = now or datetime.now(timezone.utc)
    events = repository.list_telemetry_events(session_id=session.id)
    open_incidents = [
        incident
        for incident in repository.list_incidents(session_id=session.id)
        if incident.status != IncidentStatus.ENCERRADA
    ]
    event_counts = Counter(event.event_type for event in events)
    safety_incidents = sum(
        1 for incident in open_incidents if incident.category in SAFETY_CATEGORIES
    )

    return LiveFocusSummary(
        active_devices=len(session.allocated_device_ids),
        focus_lost_events=event_counts[TelemetryEventType.FOCO_PERDIDO],
        safety_alerts=event_counts[TelemetryEventType.ALERTA] + safety_incidents,
        open_incidents=len(open_incidents),
        elapsed_minutes=max(0, int((now - session.started_at).total_seconds() // 60)),
        incident_categories=dict(Counter(incident.category for incident in open_incidents)),
    )


def build_live_request(
    repository: MemoryRepository,
    session: SessionResponse,
) -> AILiveGuidanceRequest:
    return AILiveGuidanceRequest(
        session_id=session.id,
        objective=session.objective,
        focus=summarize_session(repository, session),
    )
