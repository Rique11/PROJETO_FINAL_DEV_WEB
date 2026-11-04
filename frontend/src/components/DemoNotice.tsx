import React from 'react';

export const DemoNotice: React.FC = () => {
  return (
    <div
      role="region"
      aria-label="Aviso de demonstração"
      className="bg-brand-primary text-white text-xs sm:text-sm px-4 py-2 border-b border-brand-primary-hover flex flex-wrap items-center justify-between gap-2"
    >
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
        <span className="font-semibold uppercase tracking-wider text-[11px] bg-white/10 px-2 py-0.5 rounded">
          Sprint 1 — Frontend com Dados Mockados
        </span>
        <span className="text-slate-200">
          Modo demonstração com dados fictícios. Sem conexão a equipamentos reais nem agentes invasivos.
        </span>
      </div>
      <div className="text-[12px] text-slate-300">
        Perfil: <strong className="text-white">Prof. Carlos Eduardo</strong> (Simulação)
      </div>
    </div>
  );
};
