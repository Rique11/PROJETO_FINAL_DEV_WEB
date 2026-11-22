'use client';

import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { IncidentForm } from '@/features/incidents/IncidentForm';

export default function NovaOcorrenciaPage() {
  return (
    <div>
      <PageHeader
        title="Registrar Ocorrência Pedagógica"
        subtitle="Descreva a intercorrência observada em aula para acompanhamento e orientação formativa."
        backHref="/ocorrencias"
        backLabel="Voltar para Ocorrências"
      />

      <div className="max-w-2xl">
        <IncidentForm />
      </div>
    </div>
  );
}
