'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { LiveGuidance, ProtecaState } from '@/types';
import { useSchool } from '@/context/SchoolContext';

interface AIDemoCardProps {
  sessionId: string;
}

const stateLabels: Record<ProtecaState, string> = {
  acolhimento: 'Acolhimento',
  curiosidade: 'Curiosidade',
  alerta: 'Alerta de segurança',
};

const stateStyles: Record<ProtecaState, string> = {
  acolhimento: 'from-emerald-400/20 to-cyan-400/10 border-emerald-300/30',
  curiosidade: 'from-amber-400/20 to-sky-400/10 border-amber-300/30',
  alerta: 'from-rose-400/20 to-orange-400/10 border-rose-300/30',
};

export const AIDemoCard: React.FC<AIDemoCardProps> = ({ sessionId }) => {
  const { requestLiveGuidance } = useSchool();
  const [guidance, setGuidance] = useState<LiveGuidance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setGuidance(await requestLiveGuidance(sessionId));
    } catch {
      setError('Não foi possível gerar a orientação agora. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [requestLiveGuidance, sessionId]);

  useEffect(() => {
    if (!isAutoMode) return;
    const intervalId = window.setInterval(() => {
      void handleGenerate();
    }, 120000);
    return () => window.clearInterval(intervalId);
  }, [isAutoMode, handleGenerate]);

  const intervention = guidance?.intervention;

  return (
    <section className="proteca-panel rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-950 via-brand-primary to-slate-900 p-5 text-white shadow-lg sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-start gap-3">
          <div className="proteca-orb flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-300 text-xl font-black text-slate-950 shadow-lg shadow-amber-300/20" aria-hidden="true">
            P
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Proteca Live</p>
            <h3 className="mt-1 text-xl font-bold">Foco, segurança e curiosidade</h3>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-300">
              Apoio ao professor com sinais agregados e sugestões formativas. A decisão continua humana.
            </p>
          </div>
        </div>
        <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-200">
          Sem vigilância invasiva
        </span>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
          <strong className="mb-1 block text-amber-200">Modo de acompanhamento</strong>
          {isAutoMode ? 'Proteca fará uma leitura agregada a cada 2 minutos.' : 'Faça uma leitura quando quiser mudar o ritmo da aula.'}
        </div>
        <button
          type="button"
          onClick={() => setIsAutoMode((current) => !current)}
          className="rounded-xl border border-white/20 px-4 py-3 text-sm font-bold transition hover:bg-white/10"
          aria-pressed={isAutoMode}
        >
          {isAutoMode ? 'Pausar Live' : 'Ativar a cada 2 min'}
        </button>
      </div>

      {!guidance && !isLoading && (
        <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-6 text-center">
          <p className="mb-4 text-sm text-slate-300">
            O que está acontecendo na turma agora? Peça uma sugestão sem interromper o fluxo.
          </p>
          <button
            type="button"
            onClick={handleGenerate}
            className="rounded-xl bg-amber-300 px-4 py-2.5 text-sm font-bold text-slate-950 shadow transition hover:bg-amber-200"
          >
            Ler o momento da aula
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-white/5 py-10 text-sm text-slate-300">
          <div className="proteca-orb h-8 w-8 rounded-full border-2 border-amber-300 border-t-transparent" />
          <span>Proteca está organizando uma sugestão...</span>
        </div>
      )}

      {error && <p className="mt-3 rounded-lg bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}

      {guidance && !isLoading && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-300">Leitura do momento</p>
              <p className="mt-1 text-lg font-bold capitalize">{guidance.attentionLevel}</p>
            </div>
            <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-300">
              {guidance.isMock ? 'Fallback local' : guidance.model}
            </span>
          </div>

          <p className="rounded-xl bg-white/10 p-4 text-sm leading-relaxed text-slate-100">{guidance.observedPattern}</p>

          <div className="grid gap-2 sm:grid-cols-2">
            {guidance.teacherSuggestions.map((suggestion, index) => (
              <div key={suggestion} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
                <span className="mr-2 font-bold text-amber-300">{index + 1}.</span>
                {suggestion}
              </div>
            ))}
          </div>

          {intervention && (
            <div className={`rounded-2xl border bg-gradient-to-br p-4 ${stateStyles[intervention.state]}`}>
              <div className="flex items-start gap-3">
                <div className="proteca-orb flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/90 font-black text-slate-900" aria-hidden="true">
                  P
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white/70">Prévia para a turma · {stateLabels[intervention.state]}</p>
                  <h4 className="mt-1 font-bold">{intervention.title}</h4>
                  <p className="mt-1 text-sm text-white/90">{intervention.message}</p>
                  <p className="mt-3 rounded-lg bg-black/10 p-2 text-sm font-medium text-white">{intervention.prompt}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
            <p className="max-w-2xl text-[11px] leading-relaxed text-slate-400">{guidance.limitations}</p>
            <button type="button" onClick={handleGenerate} className="text-xs font-bold text-amber-300 underline hover:text-amber-200">
              Ler novamente
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
