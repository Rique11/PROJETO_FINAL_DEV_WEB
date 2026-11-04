'use client';

import React from 'react';
import Link from 'next/link';
import { useSchool } from '@/context/SchoolContext';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { IncidentCard } from '@/features/incidents/IncidentCard';

export default function DashboardPage() {
  const { sessions, incidents, devices } = useSchool();

  const openSessions = sessions.filter((s) => s.status === 'aberta');
  const openIncidents = incidents.filter((i) => i.status !== 'encerrada');
  const devicesInUse = devices.filter((d) => d.status === 'em_uso');
  const availableDevices = devices.filter((d) => d.status === 'disponivel');
  const maintenanceDevices = devices.filter((d) => d.status === 'manutencao');

  const recentIncidents = incidents.slice(0, 4);

  return (
    <div>
      <PageHeader
        title="Painel de Controle Pedagógico"
        subtitle="Acompanhamento de sessões ativas, uso de dispositivos escolares e intervenções formativas."
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/sessoes/nova"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-semibold text-white bg-brand-action hover:bg-brand-action-hover shadow-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Abrir Sessão</span>
            </Link>
            <Link
              href="/ocorrencias/nova"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-semibold text-brand-text bg-white border border-slate-300 hover:bg-slate-50 shadow-sm transition-colors"
            >
              <svg className="w-4 h-4 text-brand-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Registrar Ocorrência</span>
            </Link>
          </div>
        }
      />

      {/* Cartões de Indicadores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Sessões em Andamento</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-brand-text">{openSessions.length}</span>
            <span className="text-xs text-slate-500">de {sessions.length} total</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Salas de aula com equipamentos em uso</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Ocorrências Abertas</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-brand-danger">{openIncidents.length}</span>
            <span className="text-xs text-slate-500">demandam mediação</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Aguardando intervenção ou encerramento</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Dispositivos em Uso</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-700">{devicesInUse.length}</span>
            <span className="text-xs text-slate-500">de {devices.length} aparelhos</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Alocados nas sessões abertas</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Disponíveis / Manutenção</span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700">{availableDevices.length}</span>
            <span className="text-xs text-amber-700 font-semibold">({maintenanceDevices.length} manut.)</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Prontos no carrinho de recarga</p>
        </div>
      </div>

      {/* Sessões Abertas no Momento */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-brand-text flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            Sessão Ativa no Momento
          </h2>
          <Link href="/sessoes" className="text-xs font-semibold text-brand-action hover:underline">
            Ver todas as sessões ({sessions.length}) →
          </Link>
        </div>

        {openSessions.length === 0 ? (
          <div className="p-6 bg-white rounded-lg border border-slate-200 text-center text-sm text-slate-500">
            Nenhuma sessão de aula em andamento. Inicie uma nova sessão para acompanhar a turma e vincular aparelhos.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openSessions.map((s) => (
              <div key={s.id} className="bg-white rounded-lg border-2 border-emerald-500/40 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    Em Andamento
                  </span>
                  <StatusBadge type="session" value={s.status} />
                </div>
                <h3 className="text-base font-bold text-brand-text mb-2">{s.objective}</h3>
                <p className="text-xs text-slate-500 mb-3">
                  Professor: <strong className="text-slate-700">{s.teacherName}</strong> • {s.allocatedDeviceIds.length} dispositivos alocados
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <Link
                    href={`/sessoes/${s.id}`}
                    className="text-sm font-semibold text-brand-action hover:text-brand-action-hover"
                  >
                    Abrir Gestão da Sessão →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ocorrências Recentes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-brand-text">Ocorrências Recentes Registradas</h2>
          <Link href="/ocorrencias" className="text-xs font-semibold text-brand-action hover:underline">
            Ver todas as ocorrências ({incidents.length}) →
          </Link>
        </div>

        <div className="space-y-3">
          {recentIncidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} showSessionLink={true} />
          ))}
        </div>
      </div>
    </div>
  );
}
