'use client';

import React, { useState } from 'react';
import { Incident, IncidentStatus } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { useSchool } from '@/context/SchoolContext';
import { Modal } from '@/components/Modal';

interface IncidentCardProps {
  incident: Incident;
  showSessionLink?: boolean;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, showSessionLink = false }) => {
  const { devices, sessions, updateIncidentStatus } = useSchool();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<IncidentStatus>('em_analise');
  const [justification, setJustification] = useState('');
  const [errorJustification, setErrorJustification] = useState('');

  const device = devices.find((d) => d.id === incident.deviceId);
  const session = sessions.find((s) => s.id === incident.sessionId);

  const handleOpenStatusModal = (status: IncidentStatus) => {
    setTargetStatus(status);
    setJustification('');
    setErrorJustification('');
    setIsModalOpen(true);
  };

  const handleConfirmStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (targetStatus === 'encerrada' && !justification.trim()) {
      setErrorJustification('A justificativa de encerramento é obrigatória.');
      return;
    }

    await updateIncidentStatus(incident.id, targetStatus, justification.trim() || undefined);
    setIsModalOpen(false);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-5 hover:border-slate-300 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge type="incident" value={incident.status} />
          <StatusBadge type="category" value={incident.category} />
          {device && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {device.patrimonio} ({device.model})
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400">{formatDate(incident.createdAt)}</span>
      </div>

      <p className="text-sm text-brand-text mb-3 leading-relaxed whitespace-pre-wrap">
        {incident.description}
      </p>

      {incident.closingJustification && (
        <div className="p-3 bg-slate-50 rounded-md border-l-4 border-emerald-500 text-xs text-slate-700 mb-3">
          <strong className="block text-slate-900 mb-0.5">Justificativa de Encerramento:</strong>
          {incident.closingJustification}
        </div>
      )}

      {showSessionLink && session && (
        <div className="text-xs text-slate-500 mb-3 pt-2 border-t border-slate-100 flex items-center justify-between">
          <span>
            Sessão: <strong className="text-slate-700">{session.objective}</strong>
          </span>
          <a
            href={`/sessoes/${session.id}`}
            className="text-brand-action hover:underline font-medium"
          >
            Ver sessão →
          </a>
        </div>
      )}

      {/* Histórico resumido */}
      {incident.actions && incident.actions.length > 0 && (
        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-700">Histórico ({incident.actions.length}):</span>{' '}
          {incident.actions[incident.actions.length - 1].action} por{' '}
          {incident.actions[incident.actions.length - 1].author} em{' '}
          {formatDate(incident.actions[incident.actions.length - 1].timestamp)}
        </div>
      )}

      {/* Botões de Ação para avançar o estado */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
        {incident.status === 'aberta' && (
          <button
            type="button"
            onClick={() => handleOpenStatusModal('em_analise')}
            className="px-2.5 py-1 text-xs font-semibold rounded text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
          >
            Colocar Em Análise
          </button>
        )}
        {incident.status !== 'encerrada' && (
          <button
            type="button"
            onClick={() => handleOpenStatusModal('encerrada')}
            className="px-2.5 py-1 text-xs font-semibold rounded text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            Encerrar com Justificativa
          </button>
        )}
        {incident.status === 'encerrada' && (
          <button
            type="button"
            onClick={() => handleOpenStatusModal('aberta')}
            className="px-2.5 py-1 text-xs font-semibold rounded text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            Reabrir Ocorrência
          </button>
        )}
      </div>

      {/* Modal de Mudança de Status */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          targetStatus === 'encerrada'
            ? 'Encerrar Ocorrência Pedagógica'
            : targetStatus === 'em_analise'
            ? 'Mover para Em Análise'
            : 'Reabrir Ocorrência'
        }
      >
        <form onSubmit={handleConfirmStatusChange} className="space-y-4">
          <p className="text-sm text-slate-600">
            {targetStatus === 'encerrada'
              ? 'Para encerrar a ocorrência, forneça a justificativa pedagógica com a mediação efetuada.'
              : 'Confirme a transição do estado desta ocorrência para acompanhamento da equipe.'}
          </p>

          <div>
            <label htmlFor="modal-justification" className="block text-sm font-semibold text-slate-700 mb-1">
              Justificativa / Nota Pedagógica {targetStatus === 'encerrada' && <span className="text-brand-danger">*</span>}
            </label>
            <textarea
              id="modal-justification"
              rows={3}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Ex: Orientação individual prestada ao estudante e restabelecimento da atividade curricular..."
              className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-action"
            />
            {errorJustification && (
              <p className="mt-1 text-xs text-brand-danger font-semibold">{errorJustification}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3 py-1.5 border border-slate-300 text-sm rounded text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-brand-action text-white text-sm font-medium rounded hover:bg-brand-action-hover"
            >
              Confirmar Alteração
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
