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
        return list(self._devices.values())

    def get_device(self, device_id: str):
        return self._devices.get(device_id)

    # ---------- Sessões ----------
    def list_sessions(self):
        return list(self._sessions.values())

    def get_session(self, session_id: str):
        return self._sessions.get(session_id)

    def create_session(self, data):
        for device_id in data.device_ids:
            device = self.get_device(device_id)

            if device is None:
                raise LookupError(f"Dispositivo '{device_id}' não encontrado.")
            
            if device.status != "disponivel":
                raise ValueError(f"Dispositivo '{device_id}' não está disponível.")              
        #Criando sessão 
        self._sessions[data.id] = data
        #Atualizando status dos dispositivos    
        for device_id in data.device_ids:
            device = self.get_device(device_id)
            device.status = "em_uso"

        
    def close_session(self, session_id: str, justification: str):
        session = self.get_session(session_id)

        if session is None:
            raise LookupError(f"Sessão '{session_id}' não encontrada.")

        # Atualizando status dos dispositivos
        for device in self._devices.values():
            if device.session_id == session_id:
                device.status = "disponivel"
                device.session_id = None
            
    # ---------- Ocorrências ----------
    def list_incidents(self):
        return list(self._incidents.values())

    def get_incident(self, incident_id: str):
        return self._incidents.get(incident_id)

    def create_incident(self, data):
        session = self.get_session(data.session_id)

        if session is None:
            raise LookupError(f"Sessão '{data.session_id}' não encontrada.")

        incident = data
        self._incidents[incident.id] = incident
        return incident

    def update_incident_status(
        self,
        incident_id: str,
        new_status,
        justification=None,
    ):
        incident = self.get_incident(incident_id)

        if incident is None:
            raise LookupError(f"Ocorrência '{incident_id}' não encontrada.")

        incident.status = new_status
        if justification:
            incident.justification = justification

        self._incidents[incident.id] = incident
        return incident
    
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