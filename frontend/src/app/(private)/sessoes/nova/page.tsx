'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSchool } from '@/context/SchoolContext';
import { PageHeader } from '@/components/PageHeader';
import { FieldError } from '@/components/FieldError';

export default function NovaSessaoPage() {
  const router = useRouter();
  const { classrooms, devices, createSession } = useSchool();

  const [classroomId, setClassroomId] = useState(classrooms[0]?.id || '');
  const [teacherName, setTeacherName] = useState('Prof. Carlos Eduardo');
  const [objective, setObjective] = useState('');
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);

  const [errors, setErrors] = useState<{
    classroomId?: string;
    objective?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleDevice = (id: string) => {
    setSelectedDeviceIds((prev) =>
      prev.includes(id) ? prev.filter((dId) => dId !== id) : [...prev, id]
    );
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!classroomId) {
      errs.classroomId = 'Selecione a turma que participará da aula.';
    }
    const trimmed = objective.trim();
    if (!trimmed) {
      errs.objective = 'O objetivo pedagógico da aula é obrigatório.';
    } else if (trimmed.length < 5) {
      errs.objective = 'O objetivo deve conter pelo menos 5 caracteres.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const created = await createSession({
        classroomId,
        teacherName,
        objective: objective.trim(),
        deviceIds: selectedDeviceIds,
      });

      router.push(`/sessoes/${created.id}`);
    } catch {
      setErrors({ objective: 'Ocorreu um erro ao abrir a sessão. Tente novamente.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Abrir Nova Sessão de Aula"
        subtitle="Inicie o acompanhamento de uma aula vinculando a turma e os equipamentos pedagógicos."
        backHref="/sessoes"
        backLabel="Voltar para Sessões"
      />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 max-w-3xl"
      >
        <div className="space-y-6">
          {/* Turma */}
          <div>
            <label htmlFor="session-classroom" className="block text-sm font-semibold text-brand-text mb-1">
              Turma Escolar <span className="text-brand-danger">*</span>
            </label>
            <select
              id="session-classroom"
              value={classroomId}
              onChange={(e) => setClassroomId(e.target.value)}
              aria-describedby={errors.classroomId ? 'session-classroom-error' : undefined}
              className="w-full py-2.5 px-3 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-action focus:border-brand-action"
            >
              <option value="">Selecione uma turma...</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.grade})
                </option>
              ))}
            </select>
            <FieldError id="session-classroom-error" message={errors.classroomId} />
          </div>

          {/* Professor Responsável */}
          <div>
            <label htmlFor="session-teacher" className="block text-sm font-semibold text-brand-text mb-1">
              Docente Responsável <span className="text-brand-danger">*</span>
            </label>
            <input
              id="session-teacher"
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full py-2.5 px-3 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-action focus:border-brand-action"
            />
          </div>

          {/* Objetivo Pedagógico */}
          <div>
            <label htmlFor="session-objective" className="block text-sm font-semibold text-brand-text mb-1">
              Objetivo da Atividade Curricular <span className="text-brand-danger">*</span>
            </label>
            <textarea
              id="session-objective"
              rows={3}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              aria-describedby={errors.objective ? 'session-objective-error' : undefined}
              placeholder="Ex: Pesquisa guiada sobre Biomas Brasileiros no laboratório de informática..."
              className="w-full py-2.5 px-3 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-action focus:border-brand-action"
            />
            <FieldError id="session-objective-error" message={errors.objective} />
            <p className="mt-1 text-xs text-slate-500">
              Descreva a finalidade pedagógica da aula e as atividades previstas no plano docente.
            </p>
          </div>

          {/* Seleção de Dispositivos com Prevenção de Conflitos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-brand-text">
                Vincular Dispositivos à Sessão ({selectedDeviceIds.length} selecionados)
              </label>
              <span className="text-xs text-slate-500">
                Apenas dispositivos disponíveis no carrinho podem ser alocados
              </span>
            </div>

            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {devices.map((device) => {
                const isAvailable = device.status === 'disponivel';
                const isSelected = selectedDeviceIds.includes(device.id);

                return (
                  <div
                    key={device.id}
                    className={`p-3 flex items-center justify-between text-sm ${
                      !isAvailable ? 'bg-slate-50/70 text-slate-400' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`device-${device.id}`}
                        checked={isSelected}
                        disabled={!isAvailable}
                        onChange={() => toggleDevice(device.id)}
                        className="w-4 h-4 text-brand-action rounded border-slate-300 focus:ring-brand-action disabled:opacity-40"
                      />
                      <label
                        htmlFor={`device-${device.id}`}
                        className={`flex flex-col cursor-pointer ${
                          !isAvailable ? 'cursor-not-allowed' : ''
                        }`}
                      >
                        <span className="font-semibold text-brand-text">
                          {device.patrimonio} — {device.model}
                        </span>
                        <span className="text-xs text-slate-500">
                          Tipo: {device.type.toUpperCase()}
                        </span>
                      </label>
                    </div>

                    <div>
                      {device.status === 'disponivel' && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Disponível
                        </span>
                      )}
                      {device.status === 'em_uso' && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                          Já em uso em outra sessão
                        </span>
                      )}
                      {device.status === 'manutencao' && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          Em manutenção técnica
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Dispositivos alocados serão marcados como &quot;Em Uso&quot; e liberados automaticamente ao término da sessão.
            </p>
          </div>

          {/* Ações */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-brand-action hover:bg-brand-action-hover focus:outline-none focus:ring-2 focus:ring-brand-action disabled:opacity-50"
            >
              {isSubmitting ? 'Iniciando Sessão...' : 'Iniciar Sessão de Aula'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
