"""Dados de demonstração, os mesmos das fixtures do frontend da Sprint 1."""

from datetime import datetime

from app.repositories.memory_repo import MemoryRepository
from app.schemas.devices import DeviceResponse, DeviceStatus, DeviceType
from app.schemas.incidents import (
    IncidentActionLog,
    IncidentCategory,
    IncidentResponse,
    IncidentStatus,
)
from app.schemas.school import ClassroomResponse, SchoolResponse
from app.schemas.sessions import SessionActionEntry, SessionResponse, SessionStatus

SCHOOL = SchoolResponse(
    id="sch-01",
    name="Escola Municipal Alberto Santos Dumont",
    city="Curitiba - PR",
)


def _dt(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def _device(device_id: str, patrimonio: str, kind: DeviceType, model: str, status: DeviceStatus):
    return DeviceResponse(
        id=device_id,
        school_id=SCHOOL.id,
        patrimonio=patrimonio,
        type=kind,
        model=model,
        status=status,
    )


def _incident(
    incident_id: str,
    session_id: str,
    device_id: str | None,
    category: IncidentCategory,
    description: str,
    status: IncidentStatus,
    created_at: str,
    actions: list[tuple[str, str, str, str]],
    updated_at: str | None = None,
    closing_justification: str | None = None,
) -> IncidentResponse:
    return IncidentResponse(
        id=incident_id,
        school_id=SCHOOL.id,
        session_id=session_id,
        device_id=device_id,
        category=category,
        description=description,
        status=status,
        created_at=_dt(created_at),
        updated_at=_dt(updated_at) if updated_at else None,
        closing_justification=closing_justification,
        actions=[
            IncidentActionLog(
                id=f"{incident_id}-act-{index}",
                timestamp=_dt(timestamp),
                action=action,
                author=author,
                note=note,
            )
            for index, (timestamp, action, author, note) in enumerate(actions, 1)
        ],
    )


def load_demo_data(repository: MemoryRepository) -> MemoryRepository:
    repository.school = SCHOOL

    for classroom in (
        ClassroomResponse(id="cls-7a", school_id=SCHOOL.id, name="7º Ano A — Manhã", grade="7º Ano"),
        ClassroomResponse(id="cls-8b", school_id=SCHOOL.id, name="8º Ano B — Tarde", grade="8º Ano"),
    ):
        repository.add_classroom(classroom)

    lenovo = "Lenovo 300e Chromebook Gen 3"
    samsung = "Samsung Galaxy Tab A9+ Educação"
    for device in (
        _device("dev-01", "DEV-CR-0101", DeviceType.CHROMEBOOK, lenovo, DeviceStatus.EM_USO),
        _device("dev-02", "DEV-CR-0102", DeviceType.CHROMEBOOK, lenovo, DeviceStatus.EM_USO),
        _device("dev-03", "DEV-TB-0201", DeviceType.TABLET, samsung, DeviceStatus.DISPONIVEL),
        _device("dev-04", "DEV-TB-0202", DeviceType.TABLET, samsung, DeviceStatus.DISPONIVEL),
        _device(
            "dev-05",
            "DEV-NB-0301",
            DeviceType.NOTEBOOK,
            "Positivo Master N1250 Educacional",
            DeviceStatus.MANUTENCAO,
        ),
        _device("dev-06", "DEV-CR-0103", DeviceType.CHROMEBOOK, lenovo, DeviceStatus.DISPONIVEL),
    ):
        repository.add_device(device)

    repository.add_session(
        SessionResponse(
            id="sess-01",
            school_id=SCHOOL.id,
            classroom_id="cls-7a",
            teacher_name="Prof. Carlos Eduardo",
            objective="Pesquisa orientada de Geografia: Biomas Brasileiros e conservação ambiental",
            status=SessionStatus.ABERTA,
            started_at=_dt("2026-11-04T10:15:00Z"),
            allocated_device_ids=["dev-01", "dev-02"],
            action_log=[
                SessionActionEntry(
                    id="log-01",
                    timestamp=_dt("2026-11-04T10:15:00Z"),
                    action="Sessão aberta",
                    author="Prof. Carlos Eduardo",
                    note="Início da atividade com verificação inicial dos aparelhos.",
                ),
            ],
        )
    )
    repository.add_session(
        SessionResponse(
            id="sess-02",
            school_id=SCHOOL.id,
            classroom_id="cls-8b",
            teacher_name="Profa. Mariana Silveira",
            objective="Laboratório de Redação: Produção textual dissertativa orientada",
            status=SessionStatus.ENCERRADA,
            started_at=_dt("2026-11-03T14:00:00Z"),
            ended_at=_dt("2026-11-03T15:40:00Z"),
            allocated_device_ids=["dev-01"],
            closing_justification=(
                "Aula concluída sem intercorrências graves pendentes; "
                "equipamentos conferidos no carrinho de recarga."
            ),
            action_log=[
                SessionActionEntry(
                    id="log-03",
                    timestamp=_dt("2026-11-03T14:00:00Z"),
                    action="Sessão aberta",
                    author="Profa. Mariana Silveira",
                    note="Sessão iniciada na sala multimídia.",
                ),
                SessionActionEntry(
                    id="log-04",
                    timestamp=_dt("2026-11-03T15:40:00Z"),
                    action="Sessão encerrada",
                    author="Profa. Mariana Silveira",
                    note="Justificativa registrada e aparelhos liberados.",
                ),
            ],
        )
    )

    carlos = "Prof. Carlos Eduardo"
    mariana = "Profa. Mariana Silveira"
    for incident in (
        _incident(
            "inc-01", "sess-01", "dev-01", IncidentCategory.USO_NAO_PEDAGOGICO,
            "Aluno alternando repetidamente entre aba da pesquisa de Geografia e aba de jogo online de navegador.",
            IncidentStatus.ABERTA, "2026-11-04T10:35:00Z",
            [("2026-11-04T10:35:00Z", "Ocorrência registrada", carlos,
              "Identificado durante circulação pedagógica em sala.")],
        ),
        _incident(
            "inc-02", "sess-01", "dev-02", IncidentCategory.PRIVACIDADE_EXPOSICAO,
            "Tentativa de abertura do aplicativo de câmera para registrar imagem de colegas de classe sem autorização pedagógica.",
            IncidentStatus.EM_ANALISE, "2026-11-04T10:48:00Z",
            [
                ("2026-11-04T10:48:00Z", "Ocorrência registrada", carlos,
                 "Aparelho retido preventivamente para diálogo com a dupla."),
                ("2026-11-04T10:55:00Z", "Transição para Em Análise", carlos,
                 "Diálogo inicial realizado com reforço sobre privacidade escolar."),
            ],
            updated_at="2026-11-04T10:55:00Z",
        ),
        _incident(
            "inc-03", "sess-01", None, IncidentCategory.DESVIO_FOCO,
            "Dois estudantes compartilhando fones de ouvido e assistindo a vídeos de streaming desconectados do tema da aula.",
            IncidentStatus.ABERTA, "2026-11-04T11:02:00Z",
            [("2026-11-04T11:02:00Z", "Ocorrência registrada", carlos, "Aviso verbal realizado.")],
        ),
        _incident(
            "inc-04", "sess-02", None, IncidentCategory.ACESSO_INDEVIDO,
            "Tentativa de desativação do filtro DNS para acesso a fórum de jogos eletrônicos.",
            IncidentStatus.ENCERRADA, "2026-11-03T14:25:00Z",
            [
                ("2026-11-03T14:25:00Z", "Ocorrência registrada", mariana, "Detecção visual pelo professor."),
                ("2026-11-03T15:15:00Z", "Ocorrência encerrada", mariana,
                 "Conclusão pedagógica com mediação do gestor."),
            ],
            updated_at="2026-11-03T15:15:00Z",
            closing_justification=(
                "Equipamento reiniciado em presença da coordenação e estudante orientado "
                "pedagogicamente com registro na ata da turma."
            ),
        ),
        _incident(
            "inc-05", "sess-02", "dev-01", IncidentCategory.DANO_FISICO_EQUIPAMENTO,
            "Teclado do Chromebook com tecla 'Espaço' travada por pressão excessiva durante atividade.",
            IncidentStatus.ENCERRADA, "2026-11-03T14:40:00Z",
            [
                ("2026-11-03T14:40:00Z", "Ocorrência registrada", mariana, "Avaria mecânica informada."),
                ("2026-11-03T15:30:00Z", "Ocorrência encerrada", mariana,
                 "Equipamento isolado no setor técnico."),
            ],
            updated_at="2026-11-03T15:30:00Z",
            closing_justification=(
                "Dispositivo encaminhado à assistência técnica interna da escola e substituído na atividade."
            ),
        ),
        _incident(
            "inc-06", "sess-01", "dev-02", IncidentCategory.ACESSO_INDEVIDO,
            "Busca de termos impróprios em motor de busca com tentativa de burlar safe search durante a pesquisa de imagens.",
            IncidentStatus.ABERTA, "2026-11-04T11:10:00Z",
            [("2026-11-04T11:10:00Z", "Ocorrência registrada", carlos,
              "Intervenção imediata com fechamento das guias.")],
        ),
    ):
        repository.add_incident(incident)

    return repository
