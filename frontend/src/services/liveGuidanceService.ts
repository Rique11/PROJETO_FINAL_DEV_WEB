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

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

function toGuidance(data: {
  session_id: string;
  model: string;
  generated_at: string;
  attention_level: string;
  observed_pattern: string;
  teacher_suggestions: string[];
  intervention?: {
    state: 'acolhimento' | 'curiosidade' | 'alerta';
    title: string;
    message: string;
    prompt: string;
  } | null;
  limitations: string;
  is_mock: boolean;
}): LiveGuidance {
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

export async function requestLiveGuidance(
  request: LiveGuidanceRequest
): Promise<LiveGuidance | null> {
  if (!apiBaseUrl) return null;

  const response = await fetch(`${apiBaseUrl}/ia/live`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: request.sessionId,
      objective: request.objective,
      focus: {
        active_devices: request.focus.activeDevices,
        focus_lost_events: request.focus.focusLostEvents,
        safety_alerts: request.focus.safetyAlerts,
        open_incidents: request.focus.openIncidents,
        elapsed_minutes: request.focus.elapsedMinutes,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Live guidance request failed with status ${response.status}`);
  }

  return toGuidance(await response.json());
}
