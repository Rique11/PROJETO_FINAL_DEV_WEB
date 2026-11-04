'use client';

import React from 'react';
import Link from 'next/link';
import { LessonSession } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { useSchool } from '@/context/SchoolContext';

interface SessionCardProps {
  session: LessonSession;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const { classrooms, incidents } = useSchool();

  const classroom = classrooms.find((c) => c.id === session.classroomId);
  const sessionIncidents = incidents.filter((i) => i.sessionId === session.id);
  const openIncidents = sessionIncidents.filter((i) => i.status !== 'encerrada');

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
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 hover:border-slate-300 hover:shadow transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            {classroom?.name || 'Turma'}
          </span>
          <StatusBadge type="session" value={session.status} />
        </div>

        <h3 className="text-base font-bold text-brand-text mb-2 line-clamp-2">
          {session.objective}
        </h3>

        <div className="text-xs text-slate-500 space-y-1 mb-4">
          <p>
            Docente: <strong className="text-slate-700">{session.teacherName}</strong>
          </p>
          <p>Início: {formatDate(session.startedAt)}</p>
          {session.endedAt && <p>Término: {formatDate(session.endedAt)}</p>}
        </div>

        <div className="grid grid-cols-2 gap-2 py-3 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-2 rounded text-center">
            <span className="text-slate-500 block">Dispositivos</span>
            <span className="text-base font-bold text-brand-primary">
              {session.allocatedDeviceIds.length}
            </span>
          </div>
          <div className="bg-slate-50 p-2 rounded text-center">
            <span className="text-slate-500 block">Ocorrências</span>
            <span
              className={`text-base font-bold ${
                openIncidents.length > 0 ? 'text-brand-danger' : 'text-emerald-700'
              }`}
            >
              {sessionIncidents.length}
              {openIncidents.length > 0 && (
                <span className="text-[10px] font-normal text-brand-danger ml-1">
                  ({openIncidents.length} abertas)
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <Link
          href={`/sessoes/${session.id}`}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-sm font-semibold text-brand-action bg-brand-action-light hover:bg-teal-100 transition-colors"
        >
          <span>Abrir Detalhes da Sessão</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};
