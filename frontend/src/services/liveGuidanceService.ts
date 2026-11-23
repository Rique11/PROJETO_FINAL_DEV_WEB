import { apiRequest } from './api';
import { LiveGuidance } from '@/types';

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

/**
 * Proteca Live da sessão. A API conta os sinais agregados da própria sessão
 * (ocorrências abertas e telemetria) e, se o Gemini falhar, devolve o fallback
 * local com is_mock=true. Erros de rede ou de autenticação sobem para a tela.
 */
export async function requestLiveGuidance(sessionId: string): Promise<LiveGuidance> {
  const data = await apiRequest<LiveGuidanceResponse>(
    `/sessions/${encodeURIComponent(sessionId)}/live`,
    {
      method: 'POST',
      token: localStorage.getItem('proteca_token') ?? undefined,
    }
  );

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
