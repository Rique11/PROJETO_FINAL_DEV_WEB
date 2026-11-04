'use client';

import React, { useState } from 'react';
import { AIAnalysis } from '@/types';
import { useSchool } from '@/context/SchoolContext';

interface AIDemoCardProps {
  sessionId: string;
}

export const AIDemoCard: React.FC<AIDemoCardProps> = ({ sessionId }) => {
  const { requestAIAnalysis } = useSchool();
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    // Simula um delay realista de análise local
    setTimeout(async () => {
      const result = await requestAIAnalysis(sessionId);
      setAnalysis(result);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-brand-primary text-white rounded-lg p-5 sm:p-6 shadow-md border border-slate-700">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-amber-400 text-slate-900">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </span>
            <h3 className="text-lg font-bold">Orientação Pedagógica Assistida</h3>
          </div>
          <p className="text-xs text-slate-300">
            Apoio assistido para síntese de intercorrências e sugestão de mediação formativa.
          </p>
        </div>

        {/* Rótulo de Demonstração Obrigatório */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
          Demonstração — sem chamada à IA
        </span>
      </div>

      <div className="text-xs text-slate-300 mb-4 bg-white/5 p-3 rounded border border-white/10">
        <strong className="text-amber-300 block mb-1">Papel planejado para o Google Gemini (Sprint 2):</strong>
        Na próxima sprint, o backend em FastAPI processará os registros autorizados desta sessão e acionará o modelo Gemini para gerar recomendações educativas contextualizadas. Todas as intervenções são sempre sugestões para julgamento soberano do professor.
      </div>

      {!analysis && !isLoading && (
        <div className="text-center py-6 bg-white/5 rounded-lg border border-dashed border-white/20">
          <p className="text-sm text-slate-300 mb-3">
            Gere uma demonstração da estrutura de orientação com base nas ocorrências desta sessão.
          </p>
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Gerar Sugestão Demonstrativa
          </button>
        </div>
      )}

      {isLoading && (
        <div className="py-8 text-center text-sm text-slate-300 flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span>Estruturando síntese pedagógica demonstrativa...</span>
        </div>
      )}

      {analysis && !isLoading && (
        <div className="space-y-4 bg-white/10 p-4 rounded-lg border border-white/15">
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-amber-300 mb-1">
              Síntese Pedagógica da Sessão
            </h4>
            <p className="text-sm text-slate-100 leading-relaxed">{analysis.summary}</p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-amber-300 mb-1.5">
              Padrões Observados nos Registros
            </h4>
            <ul className="list-disc list-inside text-xs text-slate-200 space-y-1">
              {analysis.observedPatterns.map((pat, idx) => (
                <li key={idx}>{pat}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-amber-300 mb-1.5">
              Recomendações Formativas Sugeridas
            </h4>
            <div className="space-y-2">
              {analysis.pedagogicalRecommendations.map((rec, idx) => (
                <div key={idx} className="p-2.5 rounded bg-white/10 text-xs text-slate-100 flex items-start gap-2">
                  <span className="font-bold text-amber-400 shrink-0">{idx + 1}.</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400">
            <strong className="text-slate-300">Salvaguarda e Limites:</strong> {analysis.limitations}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleGenerate}
              className="text-xs text-amber-300 hover:text-amber-200 underline font-medium"
            >
              Regenerar simulação
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
