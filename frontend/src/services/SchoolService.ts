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

export interface SchoolService {
  getSchool(): Promise<{ id: string; name: string; city: string }>;
  getClassrooms(): Promise<Classroom[]>;
  getDevices(): Promise<Device[]>;
  getSessions(): Promise<LessonSession[]>;
  getSession(id: string): Promise<LessonSession | null>;
  createSession(dto: CreateSessionDTO): Promise<LessonSession>;
  endSession(id: string, justification: string): Promise<LessonSession>;
  getIncidents(filters?: { sessionId?: string; category?: string; status?: string }): Promise<Incident[]>;
  getIncident(id: string): Promise<Incident | null>;
  createIncident(dto: CreateIncidentDTO): Promise<Incident>;
  updateIncidentStatus(id: string, status: IncidentStatus, justification?: string): Promise<Incident>;
  requestAIAnalysis(sessionId: string): Promise<AIAnalysis>;
}
