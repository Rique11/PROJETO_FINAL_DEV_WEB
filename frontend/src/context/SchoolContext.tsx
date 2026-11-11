'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AIAnalysis,
  Classroom,
  CreateIncidentDTO,
  CreateSessionDTO,
  Device,
  Incident,
  IncidentStatus,
  LiveGuidance,
  LessonSession,
} from '@/types';
import { mockService } from '@/services/mockService';
import { requestLiveGuidance as requestLiveGuidanceFromApi } from '@/services/liveGuidanceService';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface SchoolContextValue {
  school: { id: string; name: string; city: string } | null;
  classrooms: Classroom[];
  devices: Device[];
  sessions: LessonSession[];
  incidents: Incident[];
  notifications: Notification[];
  dismissNotification: (id: string) => void;
  createSession: (dto: CreateSessionDTO) => Promise<LessonSession>;
  endSession: (id: string, justification: string) => Promise<LessonSession>;
  createIncident: (dto: CreateIncidentDTO) => Promise<Incident>;
  updateIncidentStatus: (id: string, status: IncidentStatus, justification?: string) => Promise<Incident>;
  requestAIAnalysis: (sessionId: string) => Promise<AIAnalysis>;
  requestLiveGuidance: (sessionId: string) => Promise<LiveGuidance>;
  reloadState: () => Promise<void>;
}

const SchoolContext = createContext<SchoolContextValue | undefined>(undefined);

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const [school, setSchool] = useState<{ id: string; name: string; city: string } | null>(null);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [sessions, setSessions] = useState<LessonSession[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (type: Notification['type'], message: string) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const reloadState = async () => {
    const [s, c, d, sess, inc] = await Promise.all([
      mockService.getSchool(),
      mockService.getClassrooms(),
      mockService.getDevices(),
      mockService.getSessions(),
      mockService.getIncidents(),
    ]);
    setSchool(s);
    setClassrooms(c);
    setDevices(d);
    setSessions(sess);
    setIncidents(inc);
  };

  useEffect(() => {
    reloadState();
  }, []);

  const handleCreateSession = async (dto: CreateSessionDTO): Promise<LessonSession> => {
    const created = await mockService.createSession(dto);
    await reloadState();
    addNotification('success', `Sessão aberta com sucesso para a turma selecionada.`);
    return created;
  };

  const handleEndSession = async (id: string, justification: string): Promise<LessonSession> => {
    const ended = await mockService.endSession(id, justification);
    await reloadState();
    addNotification('info', `Sessão encerrada com sucesso e equipamentos liberados.`);
    return ended;
  };

  const handleCreateIncident = async (dto: CreateIncidentDTO): Promise<Incident> => {
    const created = await mockService.createIncident(dto);
    await reloadState();
    addNotification('success', `Ocorrência registrada com sucesso na sessão de aula.`);
    return created;
  };

  const handleUpdateIncidentStatus = async (
    id: string,
    status: IncidentStatus,
    justification?: string
  ): Promise<Incident> => {
    const updated = await mockService.updateIncidentStatus(id, status, justification);
    await reloadState();
    const statusLabel =
      status === 'em_analise' ? 'Em Análise' : status === 'encerrada' ? 'Encerrada' : 'Aberta';
    addNotification('info', `Status da ocorrência alterado para "${statusLabel}".`);
    return updated;
  };

  const handleRequestAIAnalysis = async (sessionId: string): Promise<AIAnalysis> => {
    return await mockService.requestAIAnalysis(sessionId);
  };

  const handleRequestLiveGuidance = async (sessionId: string): Promise<LiveGuidance> => {
    const session = sessions.find((item) => item.id === sessionId);
    if (!session) {
      throw new Error('Sessão não encontrada para gerar orientação.');
    }

    const focus = {
      activeDevices: session.allocatedDeviceIds.length,
      focusLostEvents: incidents.filter(
        (incident) => incident.sessionId === sessionId && incident.category === 'desvio_foco'
      ).length,
      safetyAlerts: incidents.filter(
        (incident) =>
          incident.sessionId === sessionId &&
          ['privacidade_exposicao', 'acesso_indevido'].includes(incident.category)
      ).length,
      openIncidents: incidents.filter(
        (incident) => incident.sessionId === sessionId && incident.status !== 'encerrada'
      ).length,
      elapsedMinutes: Math.max(
        0,
        Math.round((Date.now() - new Date(session.startedAt).getTime()) / 60000)
      ),
    };

    try {
      const live = await requestLiveGuidanceFromApi({
        sessionId,
        objective: session.objective,
        focus,
      });
      if (live) return live;
    } catch {
      // A local fallback keeps the classroom flow usable when the API is unavailable.
    }

    const fallback = await mockService.requestAIAnalysis(sessionId);
    return {
      sessionId: fallback.sessionId,
      model: 'local-fallback',
      generatedAt: fallback.generatedAt,
      attentionLevel: 'atenção',
      observedPattern: fallback.summary,
      teacherSuggestions: fallback.pedagogicalRecommendations.slice(0, 2),
      intervention: {
        state: 'curiosidade',
        title: 'Proteca tem uma pergunta',
        message: 'Uma pista pode ajudar a turma a reencontrar o objetivo da aula.',
        prompt: 'Que parte do objetivo você consegue explicar com um exemplo?',
      },
      limitations: `${fallback.limitations} Esta orientação foi gerada localmente porque a API não está disponível.`,
      isMock: true,
    };
  };

  return (
    <SchoolContext.Provider
      value={{
        school,
        classrooms,
        devices,
        sessions,
        incidents,
        notifications,
        dismissNotification,
        createSession: handleCreateSession,
        endSession: handleEndSession,
        createIncident: handleCreateIncident,
        updateIncidentStatus: handleUpdateIncidentStatus,
        requestAIAnalysis: handleRequestAIAnalysis,
        requestLiveGuidance: handleRequestLiveGuidance,
        reloadState,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool deve ser utilizado dentro de um SchoolProvider');
  }
  return context;
}
