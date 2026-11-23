'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSchool } from '@/context/SchoolContext';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { Modal } from '@/components/Modal';
import { IncidentList } from '@/features/incidents/IncidentList';
import { AIDemoCard } from '@/features/sessions/AIDemoCard';
import { IncidentForm } from '@/features/incidents/IncidentForm';

interface SessionDetailClientProps {
  sessionId: string;
}

export default function SessionDetailClient({ sessionId }: SessionDetailClientProps) {
  const { sessions, classrooms, devices, incidents, endSession } = useSchool();

  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [isNewIncidentModalOpen, setIsNewIncidentModalOpen] = useState(false);
  const [justification, setJustification] = useState('');
  const [justificationError, setJustificationError] = useState('');
  const [isSubmittingEnd, setIsSubmittingEnd] = useState(false);

  const session = sessions.find((s) => s.id === sessionId);
  const classroom = classrooms.find((c) => c.id === session?.classroomId);
  const allocatedDevices = devices.filter((d) =>
    session?.allocatedDeviceIds.includes(d.id)
  );
  const sessionIncidents = incidents.filter((i) => i.sessionId === sessionId);

  if (!session) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <h2 className="text-xl font-bold text-brand-text mb-2">Sessão não encontrada</h2>
        <p className="text-sm text-slate-500 mb-4">
          A sessão de aula com identificador &quot;{sessionId}&quot; não existe ou foi removida.
        </p>
        <Link
          href="/sessoes"
          className="inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold text-white bg-brand-action hover:bg-brand-action-hover"
        >
          Voltar para Lista de Sessões
        </Link>
      </div>
    );
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
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

  const handleConfirmEndSession = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = justification.trim();
    if (!trimmed) {
      setJustificationError('A justificativa de encerramento da sessão é obrigatória.');
      return;
    }

    setIsSubmittingEnd(true);
    try {
      await endSession(session.id, trimmed);
      setIsEndModalOpen(false);
      setJustification('');
    } finally {
      setIsSubmittingEnd(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={session.objective}
        subtitle={`Turma: ${classroom?.name || 'Não informada'} • Docente: ${session.teacherName}`}
        backHref="/sessoes"
        backLabel="Voltar para Sessões"
        action={
          <div className="flex items-center gap-2">
            {session.status === 'aberta' && (
              <>
                <button
                  type="button"
                  onClick={() => setIsNewIncidentModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold text-brand-text bg-white border border-slate-300 hover:bg-slate-50 shadow-sm"
                >
                  <svg className="w-4 h-4 text-brand-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Registrar Ocorrência</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setJustification('');
                    setJustificationError('');
                    setIsEndModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Encerrar Sessão</span>
                </button>
              </>
            )}
          </div>
        }
      />

      {/* Cartão de Resumo da Sessão */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <StatusBadge type="session" value={session.status} />
            <span className="text-xs text-slate-500">ID: {session.id}</span>
          </div>
          <div className="text-xs text-slate-500">
            Iniciada em: <strong className="text-slate-700">{formatDate(session.startedAt)}</strong>
            {session.endedAt && (
              <> • Encerrada em: <strong className="text-slate-700">{formatDate(session.endedAt)}</strong></>
            )}
          </div>
        </div>

        {session.closingJustification && (
          <div className="mt-4 p-3.5 bg-slate-50 rounded-md border-l-4 border-slate-600 text-xs text-slate-700">
            <strong className="block text-slate-900 mb-1">Justificativa de Encerramento da Sessão:</strong>
            {session.closingJustification}
          </div>
        )}

        {/* Equipamentos Alocados */}
        <div className="mt-5">
          <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-2.5">
            Dispositivos Vinculados ({allocatedDevices.length})
          </h3>

          {allocatedDevices.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              Nenhum equipamento vinculado a esta sessão (ou já devolvidos ao carrinho após encerramento).
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {allocatedDevices.map((d) => (
                <div
                  key={d.id}
                  className="p-3 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-xs text-brand-text block">{d.patrimonio}</span>
                    <span className="text-[11px] text-slate-500">{d.model}</span>
                  </div>
                  <StatusBadge type="device" value={d.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid com Ocorrências da Sessão + AIDemoCard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Coluna da Esquerda (2 cols): Ocorrências da Sessão */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-brand-text">
              Ocorrências Registradas Nesta Sessão ({sessionIncidents.length})
            </h2>
            {session.status === 'aberta' && (
              <button
                type="button"
                onClick={() => setIsNewIncidentModalOpen(true)}
                className="text-xs font-semibold text-brand-action hover:underline"
              >
                + Nova Ocorrência
              </button>
            )}
          </div>

          <IncidentList
            incidents={sessionIncidents}
            showSessionLink={false}
          />
        </div>

        {/* Coluna da Direita (1 col): IA Demo e Histórico da Sessão */}
        <div className="space-y-6">
          {/* Card da IA Demonstrativa */}
          <AIDemoCard sessionId={session.id} />

          {/* Histórico de Ações da Sessão */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
            <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-3">
              Histórico da Sessão ({session.actionLog.length})
            </h3>
            <div className="space-y-3">
              {session.actionLog.map((log) => (
                <div key={log.id} className="text-xs border-l-2 border-slate-300 pl-3 py-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>{formatDate(log.timestamp)}</span>
                    <span className="font-medium text-slate-600">{log.author}</span>
                  </div>
                  <strong className="block text-slate-800 mt-0.5">{log.action}</strong>
                  {log.note && <p className="text-slate-500 text-[11px] mt-0.5">{log.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Encerramento de Sessão */}
      <Modal
        isOpen={isEndModalOpen}
        onClose={() => setIsEndModalOpen(false)}
        title="Encerrar Sessão de Aula"
      >
        <form onSubmit={handleConfirmEndSession} className="space-y-4">
          <p className="text-sm text-slate-600">
            Ao encerrar a sessão, todos os dispositivos vinculados serão liberados de volta para o status
            &quot;Disponível&quot;. É obrigatório registrar a justificativa pedagógica de fechamento.
          </p>

          <div>
            <label htmlFor="end-justification" className="block text-sm font-semibold text-slate-700 mb-1">
              Justificativa de Encerramento <span className="text-brand-danger">*</span>
            </label>
            <textarea
              id="end-justification"
              rows={3}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Ex: Aula finalizada, intercorrências mediadas e todos os aparelhos recolhidos no carrinho de recarga..."
              className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-action"
            />
            {justificationError && (
              <p className="mt-1 text-xs text-brand-danger font-semibold">{justificationError}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEndModalOpen(false)}
              className="px-3.5 py-1.5 border border-slate-300 text-sm rounded text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmittingEnd}
              className="px-4 py-1.5 bg-brand-primary text-white text-sm font-semibold rounded hover:bg-brand-primary-hover disabled:opacity-50"
            >
              {isSubmittingEnd ? 'Encerrando...' : 'Confirmar Encerramento'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Nova Ocorrência dentro da Sessão */}
      <Modal
        isOpen={isNewIncidentModalOpen}
        onClose={() => setIsNewIncidentModalOpen(false)}
        title="Registrar Ocorrência na Sessão"
      >
        <IncidentForm
          defaultSessionId={session.id}
          onSuccess={() => setIsNewIncidentModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
