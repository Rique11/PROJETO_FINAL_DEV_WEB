export type DeviceType = 'chromebook' | 'tablet' | 'notebook';

export type DeviceStatus = 'disponivel' | 'em_uso' | 'manutencao';

export interface Device {
  id: string;
  schoolId: string;
  patrimonio: string;
  type: DeviceType;
  model: string;
  status: DeviceStatus;
}

export interface Classroom {
  id: string;
  schoolId: string;
  name: string;
  grade: string;
}

export type SessionStatus = 'aberta' | 'encerrada';

export interface SessionActionEntry {
  id: string;
  timestamp: string;
  action: string;
  author: string;
  note?: string;
}

export interface LessonSession {
  id: string;
  schoolId: string;
  classroomId: string;
  teacherName: string;
  objective: string;
  status: SessionStatus;
  startedAt: string;
  endedAt?: string;
  allocatedDeviceIds: string[];
  closingJustification?: string;
  actionLog: SessionActionEntry[];
}

export type IncidentCategory =
  | 'uso_nao_pedagogico'
  | 'acesso_indevido'
  | 'privacidade_exposicao'
  | 'dano_fisico_equipamento'
  | 'desvio_foco';

export type IncidentStatus = 'aberta' | 'em_analise' | 'encerrada';

export interface IncidentActionLog {
  id: string;
  timestamp: string;
  action: string;
  author: string;
  note: string;
}

export interface Incident {
  id: string;
  schoolId: string;
  sessionId: string;
  deviceId?: string;
  category: IncidentCategory;
  description: string;
  status: IncidentStatus;
  createdAt: string;
  updatedAt?: string;
  closingJustification?: string;
  actions: IncidentActionLog[];
}

export interface AIAnalysis {
  sessionId: string;
  generatedAt: string;
  summary: string;
  observedPatterns: string[];
  pedagogicalRecommendations: string[];
  limitations: string;
  evidenceIncidentIds: string[];
  isMock: boolean;
}

export type ProtecaState = 'acolhimento' | 'curiosidade' | 'alerta';

export interface ProtecaIntervention {
  state: ProtecaState;
  title: string;
  message: string;
  prompt: string;
}

export interface LiveGuidance {
  sessionId: string;
  model: string;
  generatedAt: string;
  attentionLevel: string;
  observedPattern: string;
  teacherSuggestions: string[];
  intervention?: ProtecaIntervention | null;
  limitations: string;
  isMock: boolean;
}

export interface CreateSessionDTO {
  classroomId: string;
  objective: string;
  teacherName: string;
  deviceIds: string[];
}

export interface CreateIncidentDTO {
  sessionId: string;
  deviceId?: string;
  category: IncidentCategory;
  description: string;
}
