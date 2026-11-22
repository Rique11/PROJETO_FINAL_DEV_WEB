import { apiRequest } from './api';
import { LiveGuidance } from '@/types';

interface LiveGuidanceRequest {
  sessionId: string;
  objective: string;
  focus: {
    activeDevices: number;
    focusLostEvents: number;
    safetyAlerts: number;
    openIncidents: number;
    elapsedMinutes: number;
  };
}

interface LiveGuidanceResponse {
  session_id: string;
  model: string;
  generated_at: string;
  attention_level: string;
  observed_pattern: string;
  teacher_suggestions: string[];
  intervention: LiveGuidance['intervention'];
  limitations: string;
  is_mock: boolean;
}

export async function requestLiveGuidance(
  request: LiveGuidanceRequest
): Promise<LiveGuidance> {
  const data = await apiRequest<LiveGuidanceResponse>('/ia/live', {
    method: 'POST',
    body: {
      session_id: request.sessionId,
      objective: request.objective,
      focus: {
        active_devices: request.focus.activeDevices,
        focus_lost_events: request.focus.focusLostEvents,
        safety_alerts: request.focus.safetyAlerts,
        open_incidents: request.focus.openIncidents,
        elapsed_minutes: request.focus.elapsedMinutes,
      },
    },
  });

  return {
    sessionId: data.session_id,
    model: data.model,
    generatedAt: data.generated_at,
    attentionLevel: data.attention_level,
    observedPattern: data.observed_pattern,
    teacherSuggestions: data.teacher_suggestions,
    intervention: data.intervention,
    limitations: data.limitations,
    isMock: data.is_mock,
  };
}