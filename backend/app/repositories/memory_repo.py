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