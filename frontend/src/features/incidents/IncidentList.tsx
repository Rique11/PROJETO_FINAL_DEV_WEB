'use client';

import React from 'react';
import { Incident } from '@/types';
import { IncidentCard } from './IncidentCard';
import { EmptyState } from '@/components/EmptyState';

interface IncidentListProps {
  incidents: Incident[];
  showSessionLink?: boolean;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
}

export const IncidentList: React.FC<IncidentListProps> = ({
  incidents,
  showSessionLink = false,
  onResetFilters,
  hasActiveFilters = false,
}) => {
  if (incidents.length === 0) {
    return (
      <EmptyState
        title="Nenhuma ocorrência encontrada"
        description={
          hasActiveFilters
            ? 'Não há ocorrências que correspondam aos filtros selecionados. Tente ajustar a busca.'
            : 'Nenhuma ocorrência registrada até o momento nesta listagem.'
        }
        actionLabel={hasActiveFilters ? 'Limpar Filtros' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="space-y-3">
      {incidents.map((incident) => (
        <IncidentCard
          key={incident.id}
          incident={incident}
          showSessionLink={showSessionLink}
        />
      ))}
    </div>
  );
};
