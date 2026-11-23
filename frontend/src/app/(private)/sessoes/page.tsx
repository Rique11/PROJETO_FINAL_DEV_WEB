'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSchool } from '@/context/SchoolContext';
import { PageHeader } from '@/components/PageHeader';
import { FilterBar } from '@/components/FilterBar';
import { SessionCard } from '@/features/sessions/SessionCard';
import { EmptyState } from '@/components/EmptyState';

export default function SessoesPage() {
  const { sessions } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchesSearch =
        searchQuery === '' ||
        s.objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.teacherName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === '' || s.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sessions, searchQuery, statusFilter]);

  const hasActiveFilters = searchQuery !== '' || statusFilter !== '';

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
  };

  return (
    <div>
      <PageHeader
        title="Sessões de Aula"
        subtitle="Acompanhe as sessões abertas e o histórico de aulas com uso pedagógico de dispositivos."
        action={
          <Link
            href="/sessoes/nova"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold text-white bg-brand-action hover:bg-brand-action-hover shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Abrir Nova Sessão</span>
          </Link>
        }
      />

      <div className="mb-6">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          statusOptions={[
            { label: 'Sessões Abertas', value: 'aberta' },
            { label: 'Sessões Encerradas', value: 'encerrada' },
          ]}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
          searchPlaceholder="Buscar por objetivo da aula ou professor..."
        />
      </div>

      {filteredSessions.length === 0 ? (
        <EmptyState
          title="Nenhuma sessão encontrada"
          description={
            hasActiveFilters
              ? 'Nenhuma sessão de aula atende aos critérios do filtro aplicado.'
              : 'Nenhuma sessão de aula registrada até o momento.'
          }
          actionLabel={hasActiveFilters ? 'Limpar Filtros' : 'Abrir Nova Sessão'}
          onAction={hasActiveFilters ? handleClearFilters : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}
