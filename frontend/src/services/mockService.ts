import {
  AIAnalysis,
  Classroom,
  CreateIncidentDTO,
  CreateSessionDTO,
  Device,
  Incident,
  IncidentStatus,
  LessonSession,
} from '@/types';
import {
  INITIAL_CLASSROOMS,
  INITIAL_DEVICES,
  INITIAL_INCIDENTS,
  INITIAL_SCHOOL,
  INITIAL_SESSIONS,
} from '@/data/fixtures';
import { SchoolService } from './SchoolService';

class MockSchoolServiceImpl implements SchoolService {
  private school = { ...INITIAL_SCHOOL };
  private classrooms: Classroom[] = [...INITIAL_CLASSROOMS];
  private devices: Device[] = [...INITIAL_DEVICES];
  private sessions: LessonSession[] = [...INITIAL_SESSIONS];
  private incidents: Incident[] = [...INITIAL_INCIDENTS];

  async getSchool() {
    return this.school;
  }

  async getClassrooms(): Promise<Classroom[]> {
    return [...this.classrooms];
  }

  async getDevices(): Promise<Device[]> {
    return [...this.devices];
  }

  async getSessions(): Promise<LessonSession[]> {
    return [...this.sessions].sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  }

  async getSession(id: string): Promise<LessonSession | null> {
    const session = this.sessions.find((s) => s.id === id);
    return session ? { ...session } : null;
  }

  async createSession(dto: CreateSessionDTO): Promise<LessonSession> {
    const newId = `sess-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const newSession: LessonSession = {
      id: newId,
      schoolId: this.school.id,
      classroomId: dto.classroomId,
      teacherName: dto.teacherName || 'Prof. Carlos Eduardo',
      objective: dto.objective,
      status: 'aberta',
      startedAt: now,
      allocatedDeviceIds: dto.deviceIds,
      actionLog: [
        {
          id: `log-${Date.now()}`,
          timestamp: now,
          action: 'Sessão aberta',
          author: dto.teacherName || 'Prof. Carlos Eduardo',
          note: `Objetivo: ${dto.objective}. Dispositivos vinculados: ${dto.deviceIds.length}.`,
        },
      ],
    };

    // Atualizar status dos dispositivos alocados para 'em_uso'
    this.devices = this.devices.map((d) =>
      dto.deviceIds.includes(d.id) ? { ...d, status: 'em_uso' as const } : d
    );

    this.sessions.unshift(newSession);
    return newSession;
  }

  async endSession(id: string, justification: string): Promise<LessonSession> {
    const sessionIndex = this.sessions.findIndex((s) => s.id === id);
    if (sessionIndex === -1) {
      throw new Error('Sessão não encontrada.');
    }

    const session = this.sessions[sessionIndex];
    if (session.status === 'encerrada') {
      return session;
    }

    const now = new Date().toISOString();
    const updatedSession: LessonSession = {
      ...session,
      status: 'encerrada',
      endedAt: now,
      closingJustification: justification,
      actionLog: [
        ...session.actionLog,
        {
          id: `log-${Date.now()}`,
          timestamp: now,
          action: 'Sessão encerrada',
          author: session.teacherName,
          note: `Justificativa: ${justification}`,
        },
      ],
    };

    // Liberar dispositivos alocados de volta para 'disponivel'
    const allocated = session.allocatedDeviceIds;
    this.devices = this.devices.map((d) =>
      allocated.includes(d.id) && d.status === 'em_uso'
        ? { ...d, status: 'disponivel' as const }
        : d
    );

    this.sessions[sessionIndex] = updatedSession;
    return updatedSession;
  }

  async getIncidents(filters?: {
    sessionId?: string;
    category?: string;
    status?: string;
  }): Promise<Incident[]> {
    let result = [...this.incidents];

    if (filters?.sessionId) {
      result = result.filter((i) => i.sessionId === filters.sessionId);
    }
    if (filters?.category) {
      result = result.filter((i) => i.category === filters.category);
    }
    if (filters?.status) {
      result = result.filter((i) => i.status === filters.status);
    }

    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getIncident(id: string): Promise<Incident | null> {
    const incident = this.incidents.find((i) => i.id === id);
    return incident ? { ...incident } : null;
  }

  async createIncident(dto: CreateIncidentDTO): Promise<Incident> {
    const newId = `inc-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const newIncident: Incident = {
      id: newId,
      schoolId: this.school.id,
      sessionId: dto.sessionId,
      deviceId: dto.deviceId,
      category: dto.category,
      description: dto.description.trim(),
      status: 'aberta',
      createdAt: now,
      actions: [
        {
          id: `act-${Date.now()}`,
          timestamp: now,
          action: 'Ocorrência registrada',
          author: 'Prof. Carlos Eduardo',
          note: 'Registro pedagógico efetuado durante a sessão de aula.',
        },
      ],
    };

    this.incidents.unshift(newIncident);
    return newIncident;
  }

  async updateIncidentStatus(
    id: string,
    status: IncidentStatus,
    justification?: string
  ): Promise<Incident> {
    const index = this.incidents.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error('Ocorrência não encontrada.');
    }

    const incident = this.incidents[index];
    const now = new Date().toISOString();

    const actionText =
      status === 'em_analise'
        ? 'Transição para Em Análise'
        : status === 'encerrada'
        ? 'Ocorrência encerrada'
        : 'Reabertura de ocorrência';

    const updated: Incident = {
      ...incident,
      status,
      updatedAt: now,
      closingJustification:
        status === 'encerrada' ? justification : incident.closingJustification,
      actions: [
        ...incident.actions,
        {
          id: `act-${Date.now()}`,
          timestamp: now,
          action: actionText,
          author: 'Prof. Carlos Eduardo',
          note: justification || 'Atualização de estado no fluxo pedagógico.',
        },
      ],
    };

    this.incidents[index] = updated;
    return updated;
  }

  async requestAIAnalysis(sessionId: string): Promise<AIAnalysis> {
    const sessionIncidents = this.incidents.filter((i) => i.sessionId === sessionId);
    const now = new Date().toISOString();

    return {
      sessionId,
      generatedAt: now,
      summary: `Durante a sessão analisada foram identificadas ${sessionIncidents.length} intercorrências envolvendo desvio de foco e tentativa de acesso não pedagógico. O uso dos dispositivos requereu mediação presencial ativa do docente.`,
      observedPatterns: [
        'Desvio de atenção concentrado em abas paralelas de jogos online e streaming.',
        'Curiosidade ou tentativa de registro de mídia em sala sem finalidade pedagógica formal.',
        'Nenhuma tentativa de dano físico intencional registrada nesta sessão.',
      ],
      pedagogicalRecommendations: [
        'Realizar alinhamento inicial de 5 minutos sobre privacidade e finalidade pedagógica dos dispositivos antes de distribuir os equipamentos.',
        'Organizar as duplas de trabalho com alternância de papéis (pesquisador e relator) para diminuir a ociosidade individual.',
        'Estabelecer pausas estruturadas de checagem do progresso da pesquisa para manter o foco na meta curricular.',
      ],
      limitations:
        'Esta síntese é uma demonstração assistida baseada exclusivamente nos registros textuais humanos preenchidos pelo professor. O sistema não monitora telas, rede ou histórico de navegação dos equipamentos.',
      evidenceIncidentIds: sessionIncidents.map((i) => i.id),
      isMock: true,
    };
  }
}

export const mockService = new MockSchoolServiceImpl();
