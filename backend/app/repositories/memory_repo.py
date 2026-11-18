from datetime import datetime, timezone
from threading import RLock
from uuid import uuid4

from app.core.errors import ConflictError, InvalidReferenceError, NotFoundError
from app.schemas.devices import DeviceCreate, DeviceResponse, DeviceStatus
from app.schemas.incidents import (
    IncidentActionLog,
    IncidentCategory,
    IncidentCreate,
    IncidentResponse,
    IncidentStatus,
)
from app.schemas.school import ClassroomResponse, SchoolResponse
from app.schemas.sessions import (
    SessionActionEntry,
    SessionCreate,
    SessionResponse,
    SessionStatus,
)
from app.schemas.telemetry import TelemetryEventCreate, TelemetryEventResponse

INCIDENT_TRANSITIONS: dict[IncidentStatus, set[IncidentStatus]] = {
    IncidentStatus.ABERTA: {IncidentStatus.EM_ANALISE, IncidentStatus.ENCERRADA},
    IncidentStatus.EM_ANALISE: {IncidentStatus.ABERTA, IncidentStatus.ENCERRADA},
    IncidentStatus.ENCERRADA: {IncidentStatus.ABERTA},
}

INCIDENT_ACTION_LABELS = {
    IncidentStatus.ABERTA: "Reabertura de ocorrência",
    IncidentStatus.EM_ANALISE: "Transição para Em Análise",
    IncidentStatus.ENCERRADA: "Ocorrência encerrada",
}


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _new_id(prefix: str) -> str:
    return f"{prefix}-{uuid4().hex[:8]}"


class MemoryRepository:
    """Armazenamento da Sprint 2. Os dados se perdem quando a API reinicia."""

    def __init__(self, school: SchoolResponse | None = None):
        self._lock = RLock()
        self.school = school or SchoolResponse(
            id="sch-01",
            name="Escola de demonstração",
            city="Paraná",
        )
        self._classrooms: dict[str, ClassroomResponse] = {}
        self._devices: dict[str, DeviceResponse] = {}
        self._sessions: dict[str, SessionResponse] = {}
        self._incidents: dict[str, IncidentResponse] = {}
        self._telemetry_events: dict[str, TelemetryEventResponse] = {}

    # ---------- Carga inicial ----------
    def add_classroom(self, classroom: ClassroomResponse) -> None:
        self._classrooms[classroom.id] = classroom

    def add_device(self, device: DeviceResponse) -> None:
        self._devices[device.id] = device

    def add_session(self, session: SessionResponse) -> None:
        self._sessions[session.id] = session

    def add_incident(self, incident: IncidentResponse) -> None:
        self._incidents[incident.id] = incident

    # ---------- Escola e turmas ----------
    def get_school(self) -> SchoolResponse:
        return self.school

    def list_classrooms(self) -> list[ClassroomResponse]:
        return sorted(self._classrooms.values(), key=lambda item: item.name)

    def get_classroom(self, classroom_id: str) -> ClassroomResponse:
        classroom = self._classrooms.get(classroom_id)
        if classroom is None:
            raise NotFoundError(f"Turma '{classroom_id}' não encontrada.")
        return classroom

    # ---------- Dispositivos ----------
    def list_devices(self, status: DeviceStatus | None = None) -> list[DeviceResponse]:
        devices = sorted(self._devices.values(), key=lambda item: item.patrimonio)
        if status:
            devices = [device for device in devices if device.status == status]
        return devices

    def get_device(self, device_id: str) -> DeviceResponse:
        device = self._devices.get(device_id)
        if device is None:
            raise NotFoundError(f"Dispositivo '{device_id}' não encontrado.")
        return device

    def create_device(self, data: DeviceCreate) -> DeviceResponse:
        patrimonio = data.patrimonio.strip().upper()
        with self._lock:
            if any(device.patrimonio == patrimonio for device in self._devices.values()):
                raise ConflictError(f"Já existe um dispositivo com patrimônio '{patrimonio}'.")
            device = DeviceResponse(
                id=_new_id("dev"),
                school_id=self.school.id,
                patrimonio=patrimonio,
                type=data.type,
                model=data.model.strip(),
                status=DeviceStatus.DISPONIVEL,
            )
            self._devices[device.id] = device
            return device

    def update_device_status(self, device_id: str, status: DeviceStatus) -> DeviceResponse:
        if status == DeviceStatus.EM_USO:
            raise InvalidReferenceError(
                "O status 'em_uso' é definido ao abrir uma sessão de aula."
            )
        with self._lock:
            device = self.get_device(device_id)
            if device.status == DeviceStatus.EM_USO:
                raise ConflictError(
                    "Dispositivo em uso em uma sessão aberta. Encerre a sessão antes."
                )
            updated = device.model_copy(update={"status": status})
            self._devices[device_id] = updated
            return updated

    def _set_devices_status(self, device_ids: list[str], status: DeviceStatus) -> None:
        for device_id in device_ids:
            device = self._devices[device_id]
            self._devices[device_id] = device.model_copy(update={"status": status})

    # ---------- Sessões ----------
    def list_sessions(self, status: SessionStatus | None = None) -> list[SessionResponse]:
        sessions = sorted(
            self._sessions.values(),
            key=lambda item: item.started_at,
            reverse=True,
        )
        if status:
            sessions = [session for session in sessions if session.status == status]
        return sessions

    def get_session(self, session_id: str) -> SessionResponse:
        session = self._sessions.get(session_id)
        if session is None:
            raise NotFoundError(f"Sessão '{session_id}' não encontrada.")
        return session

    def get_open_session(self, session_id: str) -> SessionResponse:
        session = self.get_session(session_id)
        if session.status != SessionStatus.ABERTA:
            raise ConflictError("A sessão já foi encerrada.")
        return session

    def create_session(self, data: SessionCreate) -> SessionResponse:
        device_ids = list(dict.fromkeys(data.device_ids))
        with self._lock:
            self.get_classroom(data.classroom_id)
            for device_id in device_ids:
                device = self.get_device(device_id)
                if device.status != DeviceStatus.DISPONIVEL:
                    raise ConflictError(
                        f"Dispositivo '{device.patrimonio}' não está disponível."
                    )

            now = _now()
            session = SessionResponse(
                id=_new_id("sess"),
                school_id=self.school.id,
                classroom_id=data.classroom_id,
                teacher_name=data.teacher_name.strip(),
                objective=data.objective.strip(),
                status=SessionStatus.ABERTA,
                started_at=now,
                allocated_device_ids=device_ids,
                action_log=[
                    SessionActionEntry(
                        id=_new_id("log"),
                        timestamp=now,
                        action="Sessão aberta",
                        author=data.teacher_name.strip(),
                        note=f"Dispositivos vinculados: {len(device_ids)}.",
                    )
                ],
            )
            self._sessions[session.id] = session
            self._set_devices_status(device_ids, DeviceStatus.EM_USO)
            return session

    def close_session(self, session_id: str, justification: str) -> SessionResponse:
        with self._lock:
            session = self.get_open_session(session_id)
            now = _now()
            closed = session.model_copy(
                update={
                    "status": SessionStatus.ENCERRADA,
                    "ended_at": now,
                    "closing_justification": justification.strip(),
                    "action_log": [
                        *session.action_log,
                        SessionActionEntry(
                            id=_new_id("log"),
                            timestamp=now,
                            action="Sessão encerrada",
                            author=session.teacher_name,
                            note=f"Justificativa: {justification.strip()}",
                        ),
                    ],
                }
            )
            self._sessions[session_id] = closed
            in_use = [
                device_id
                for device_id in session.allocated_device_ids
                if self._devices[device_id].status == DeviceStatus.EM_USO
            ]
            self._set_devices_status(in_use, DeviceStatus.DISPONIVEL)
            return closed

    def _check_device_in_session(self, session: SessionResponse, device_id: str) -> None:
        self.get_device(device_id)
        if device_id not in session.allocated_device_ids:
            raise InvalidReferenceError(
                f"Dispositivo '{device_id}' não está vinculado à sessão '{session.id}'."
            )

    # ---------- Ocorrências ----------
    def list_incidents(
        self,
        session_id: str | None = None,
        category: IncidentCategory | None = None,
        status: IncidentStatus | None = None,
    ) -> list[IncidentResponse]:
        incidents = sorted(
            self._incidents.values(),
            key=lambda item: item.created_at,
            reverse=True,
        )
        if session_id:
            incidents = [item for item in incidents if item.session_id == session_id]
        if category:
            incidents = [item for item in incidents if item.category == category]
        if status:
            incidents = [item for item in incidents if item.status == status]
        return incidents

    def get_incident(self, incident_id: str) -> IncidentResponse:
        incident = self._incidents.get(incident_id)
        if incident is None:
            raise NotFoundError(f"Ocorrência '{incident_id}' não encontrada.")
        return incident

    def create_incident(self, data: IncidentCreate) -> IncidentResponse:
        with self._lock:
            session = self.get_open_session(data.session_id)
            if data.device_id:
                self._check_device_in_session(session, data.device_id)

            now = _now()
            incident = IncidentResponse(
                id=_new_id("inc"),
                school_id=self.school.id,
                session_id=session.id,
                device_id=data.device_id,
                category=data.category,
                description=data.description.strip(),
                status=IncidentStatus.ABERTA,
                created_at=now,
                actions=[
                    IncidentActionLog(
                        id=_new_id("act"),
                        timestamp=now,
                        action="Ocorrência registrada",
                        # Na Sprint 3 o autor passa a ser o usuário autenticado.
                        author=session.teacher_name,
                        note="Registro feito durante a sessão de aula.",
                    )
                ],
            )
            self._incidents[incident.id] = incident
            return incident

    def update_incident_status(
        self,
        incident_id: str,
        new_status: IncidentStatus,
        justification: str | None = None,
    ) -> IncidentResponse:
        with self._lock:
            incident = self.get_incident(incident_id)
            if new_status not in INCIDENT_TRANSITIONS[incident.status]:
                raise ConflictError(
                    f"Não é possível mudar a ocorrência de '{incident.status.value}' "
                    f"para '{new_status.value}'."
                )

            session = self.get_session(incident.session_id)
            now = _now()
            closing = (
                justification.strip()
                if new_status == IncidentStatus.ENCERRADA and justification
                else incident.closing_justification
            )
            updated = incident.model_copy(
                update={
                    "status": new_status,
                    "updated_at": now,
                    "closing_justification": closing,
                    "actions": [
                        *incident.actions,
                        IncidentActionLog(
                            id=_new_id("act"),
                            timestamp=now,
                            action=INCIDENT_ACTION_LABELS[new_status],
                            author=session.teacher_name,
                            note=justification or "Atualização de estado no fluxo pedagógico.",
                        ),
                    ],
                }
            )
            self._incidents[incident_id] = updated
            return updated

    # ---------- Telemetria ----------
    def create_telemetry_event(self, data: TelemetryEventCreate) -> TelemetryEventResponse:
        with self._lock:
            session = self.get_open_session(data.session_id)
            self._check_device_in_session(session, data.device_id)
            event = TelemetryEventResponse(
                id=_new_id("evt"),
                received_at=_now(),
                **data.model_dump(),
            )
            self._telemetry_events[event.id] = event
            return event

    def list_telemetry_events(
        self,
        session_id: str | None = None,
        device_id: str | None = None,
    ) -> list[TelemetryEventResponse]:
        events = list(self._telemetry_events.values())
        if session_id:
            events = [event for event in events if event.session_id == session_id]
        if device_id:
            events = [event for event in events if event.device_id == device_id]
        return sorted(events, key=lambda event: event.occurred_at, reverse=True)
