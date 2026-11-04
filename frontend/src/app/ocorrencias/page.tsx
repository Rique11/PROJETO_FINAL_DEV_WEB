'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSchool } from '@/context/SchoolContext';
import { PageHeader } from '@/components/PageHeader';
import { FilterBar } from '@/components/FilterBar';
import { IncidentList } from '@/features/incidents/IncidentList';

export default function OcorrenciasPage() {
  const { incidents } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredIncidents = useMemo(() => {
    return incidents.filter((i) => {
      const matchesSearch =
        searchQuery === '' ||
        i.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === '' || i.status === statusFilter;
      const matchesCategory = categoryFilter === '' || i.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [incidents, searchQuery, statusFilter, categoryFilter]);

  const hasActiveFilters = searchQuery !== '' || statusFilter !== '' || categoryFilter !== '';

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setCategoryFilter('');
  };

  return (
    <div>
      <PageHeader
        title="Ocorrências Registradas"
        subtitle="Registro factual e mediação de intercorrências no uso pedagógico dos dispositivos."
        action={
          <Link
            href="/ocorrencias/nova"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold text-white bg-brand-action hover:bg-brand-action-hover shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Nova Ocorrência</span>
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
            { label: 'Ocorrências Abertas', value: 'aberta' },
            { label: 'Em Análise', value: 'em_analise' },
            { label: 'Encerradas', value: 'encerrada' },
          ]}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          categoryOptions={[
            { label: 'Uso Não Pedagógico', value: 'uso_nao_pedagogico' },
            { label: 'Acesso Indevido', value: 'acesso_indevido' },
            { label: 'Risco de Privacidade / Imagem', value: 'privacidade_exposicao' },
            { label: 'Dano Físico / Avaria', value: 'dano_fisico_equipamento' },
            { label: 'Desvio de Foco', value: 'desvio_foco' },
          ]}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
          searchPlaceholder="Buscar na descrição da ocorrência..."
        />
      </div>

      <IncidentList
        incidents={filteredIncidents}
        showSessionLink={true}
        onResetFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
}
