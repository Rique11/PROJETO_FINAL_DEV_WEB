'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IncidentCategory } from '@/types';
import { useSchool } from '@/context/SchoolContext';
import { FieldError } from '@/components/FieldError';

interface IncidentFormProps {
  defaultSessionId?: string;
  onSuccess?: () => void;
}

export const IncidentForm: React.FC<IncidentFormProps> = ({ defaultSessionId, onSuccess }) => {
  const router = useRouter();
  const { sessions, devices, createIncident } = useSchool();

  const openSessions = sessions.filter((s) => s.status === 'aberta');

  const [sessionId, setSessionId] = useState<string>(
    defaultSessionId || (openSessions[0]?.id || '')
  );
  const [deviceId, setDeviceId] = useState<string>('');
  const [category, setCategory] = useState<IncidentCategory>('uso_nao_pedagogico');
  const [description, setDescription] = useState<string>('');

  const [errors, setErrors] = useState<{
    sessionId?: string;
    category?: string;
    description?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successSaved, setSuccessSaved] = useState<boolean>(false);

  // Encontrar os dispositivos alocados na sessão selecionada
  const selectedSession = sessions.find((s) => s.id === sessionId);
  const allocatedDevices = devices.filter((d) =>
    selectedSession?.allocatedDeviceIds.includes(d.id)
  );

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!sessionId) {
      newErrors.sessionId = 'Selecione uma sessão de aula ativa.';
    }

    if (!category) {
      newErrors.category = 'Selecione a categoria da ocorrência.';
    }

    const trimmed = description.trim();
    if (!trimmed) {
      newErrors.description = 'A descrição do fato ocorrido é obrigatória.';
    } else if (trimmed.length < 10) {
      newErrors.description = 'A descrição deve conter no mínimo 10 caracteres.';
    } else if (trimmed.length > 1000) {
      newErrors.description = 'A descrição deve conter no máximo 1000 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessSaved(false);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createIncident({
        sessionId,
        deviceId: deviceId ? deviceId : undefined,
        category,
        description,
      });

      setSuccessSaved(true);
      setDescription('');
      setDeviceId('');

      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => {
          router.push(`/sessoes/${sessionId}`);
        }, 800);
      }
    } catch {
      setErrors({ description: 'Erro ao salvar a ocorrência. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (openSessions.length === 0 && !defaultSessionId) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
        <h3 className="text-base font-semibold text-amber-900 mb-2">
          Nenhuma sessão de aula aberta no momento
        </h3>
        <p className="text-sm text-amber-700 mb-4">
          Para registrar uma ocorrência pedagógica, é necessário que haja ao menos uma sessão de aula em andamento.
        </p>
        <button
          type="button"
          onClick={() => router.push('/sessoes/nova')}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-brand-action hover:bg-brand-action-hover"
        >
          Abrir Nova Sessão de Aula
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
      {successSaved && (
        <div
          role="status"
          className="mb-6 p-4 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Ocorrência registrada com sucesso e integrada à sessão!</span>
        </div>
      )}

      <div className="space-y-5">
        {/* Sessão */}
        <div>
          <label htmlFor="incident-session" className="block text-sm font-semibold text-brand-text mb-1">
            Sessão de Aula <span className="text-brand-danger">*</span>
          </label>
          <select
            id="incident-session"
            value={sessionId}
            onChange={(e) => {
              setSessionId(e.target.value);
              setDeviceId('');
            }}
            aria-describedby={errors.sessionId ? 'incident-session-error' : undefined}
            disabled={Boolean(defaultSessionId)}
            className="w-full py-2.5 px-3 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-action focus:border-brand-action disabled:bg-slate-100 disabled:text-slate-500"
          >
            <option value="">Selecione uma sessão...</option>
            {openSessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.objective.length > 50 ? `${s.objective.slice(0, 50)}...` : s.objective} ({s.teacherName})
              </option>
            ))}
          </select>
          <FieldError id="incident-session-error" message={errors.sessionId} />
        </div>

        {/* Categoria */}
        <div>
          <label htmlFor="incident-category" className="block text-sm font-semibold text-brand-text mb-1">
            Categoria da Ocorrência <span className="text-brand-danger">*</span>
          </label>
          <select
            id="incident-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as IncidentCategory)}
            aria-describedby={errors.category ? 'incident-category-error' : undefined}
            className="w-full py-2.5 px-3 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-action focus:border-brand-action"
          >
            <option value="uso_nao_pedagogico">Uso Não Pedagógico (jogos, redes sociais em aula)</option>
            <option value="acesso_indevido">Tentativa de Acesso Indevido (sites bloqueados ou evasão de filtro)</option>
            <option value="privacidade_exposicao">Risco de Privacidade / Imagem (gravação ou foto não autorizada)</option>
            <option value="dano_fisico_equipamento">Dano Físico / Avaria no Equipamento</option>
            <option value="desvio_foco">Desvio de Foco / Desatenção Persistente</option>
          </select>
          <FieldError id="incident-category-error" message={errors.category} />
        </div>

        {/* Dispositivo Opcional */}
        <div>
          <label htmlFor="incident-device" className="block text-sm font-semibold text-brand-text mb-1">
            Dispositivo Vinculado (Opcional)
          </label>
          <select
            id="incident-device"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="w-full py-2.5 px-3 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-action focus:border-brand-action"
          >
            <option value="">Nenhum dispositivo específico (ocorrência geral da turma)</option>
            {allocatedDevices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.patrimonio} — {d.model} ({d.type})
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            Apenas os equipamentos vinculados a esta sessão de aula estão listados.
          </p>
        </div>

        {/* Descrição dos fatos */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="incident-description" className="block text-sm font-semibold text-brand-text">
              Descrição Factual do Ocorrido <span className="text-brand-danger">*</span>
            </label>
            <span className={`text-xs ${description.length > 1000 ? 'text-brand-danger font-semibold' : 'text-slate-400'}`}>
              {description.length} / 1000 caracteres
            </span>
          </div>
          <textarea
            id="incident-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-describedby={errors.description ? 'incident-description-error' : undefined}
            placeholder="Descreva de forma objetiva a intercorrência pedagógica observada, sem expor dados pessoais ou nomes de estudantes..."
            className="w-full py-2.5 px-3 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-action focus:border-brand-action"
          />
          <FieldError id="incident-description-error" message={errors.description} />
          <p className="mt-1 text-xs text-slate-500">
            Mínimo de 10 caracteres. Registre apenas evidências factuais necessárias para mediação pedagógica.
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-action"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-brand-action hover:bg-brand-action-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-action disabled:opacity-50"
          >
            {isSubmitting ? 'Salvando...' : 'Registrar Ocorrência'}
          </button>
        </div>
      </div>
    </form>
  );
};
