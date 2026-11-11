from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4

from app.schemas.schemas import (
    TelemetryEventCreate,
    TelemetryEventResponse,
)


class MemoryRepository:
    def __init__(self):
        self._telemetry_events: dict[str, TelemetryEventResponse] = {}
        self._devices = {}
        self._sessions = {}
        self._incidents = {}

    # ---------- Dispositivos ----------
    def list_devices(self):
        pass

    def get_device(self, device_id: str):
        pass

    # ---------- Sessões ----------
    def list_sessions(self):
        pass

    def get_session(self, session_id: str):
        pass

    def create_session(self, data):
        pass

    def close_session(self, session_id: str, justification: str):
        pass
    # ---------- Ocorrências ----------
    def list_incidents(self, session_id=None, category=None, incident_status=None):
        pass

    def get_incident(self, incident_id: str):
        pass

    def create_incident(self, data):
        pass

    def update_incident_status(
        self,
        incident_id: str,
        new_status,
        justification=None,
    ):
        pass
    # ---------- Telemetria ----------
    def create_telemetry_event(
        self,
        data: TelemetryEventCreate,
    ) -> TelemetryEventResponse:
        event = TelemetryEventResponse(
            id=str(uuid4()),
            received_at=datetime.now(timezone.utc),
            **data.model_dump(),
        )

        self._telemetry_events[event.id] = event
        return event

    def list_telemetry_events(
        self,
        session_id: Optional[str] = None,
        device_id: Optional[str] = None,
    ) -> list[TelemetryEventResponse]:
        events = list(self._telemetry_events.values())

        if session_id:
            events = [
                event
                for event in events
                if event.session_id == session_id
            ]

        if device_id:
            events = [
                event
                for event in events
                if event.device_id == device_id
            ]

        return sorted(
            events,
            key=lambda event: event.occurred_at,
            reverse=True,
        )