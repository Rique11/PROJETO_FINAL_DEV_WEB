import React from 'react';
import { DeviceStatus, IncidentCategory, IncidentStatus, SessionStatus } from '@/types';

interface StatusBadgeProps {
  type: 'session' | 'incident' | 'device' | 'category';
  value: SessionStatus | IncidentStatus | DeviceStatus | IncidentCategory | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value }) => {
  if (type === 'session') {
    if (value === 'aberta') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
          Sessão Aberta
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" aria-hidden="true" />
        Sessão Encerrada
      </span>
    );
  }

  if (type === 'incident') {
    if (value === 'aberta') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600" aria-hidden="true" />
          Aberta
        </span>
      );
    }
    if (value === 'em_analise') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" aria-hidden="true" />
          Em Análise
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
        Encerrada
      </span>
    );
  }

  if (type === 'device') {
    if (value === 'disponivel') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
          Disponível
        </span>
      );
    }
    if (value === 'em_uso') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" aria-hidden="true" />
          Em Uso
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" aria-hidden="true" />
        Em Manutenção
      </span>
    );
  }

  // Category
  const categoryLabels: Record<string, { label: string; bg: string; text: string; border: string }> = {
    uso_nao_pedagogico: {
      label: 'Uso Não Pedagógico',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
    },
    acesso_indevido: {
      label: 'Tentativa de Acesso Indevido',
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
    },
    privacidade_exposicao: {
      label: 'Risco de Privacidade / Imagem',
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-200',
    },
    dano_fisico_equipamento: {
      label: 'Dano Físico / Avaria',
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-200',
    },
    desvio_foco: {
      label: 'Desvio de Foco / Desatenção',
      bg: 'bg-slate-100',
      text: 'text-slate-800',
      border: 'border-slate-200',
    },
  };

  const config = categoryLabels[value as string] || {
    label: value as string,
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      {config.label}
    </span>
  );
};
