'use client';

import React, { useMemo, useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { FilterBar } from '@/components/FilterBar';
import { EmptyState } from '@/components/EmptyState';

export default function DispositivosPage() {
  const { devices, sessions } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredDevices = useMemo(() => {
    return devices.filter((d) => {
      const matchesSearch =
        searchQuery === '' ||
        d.patrimonio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.model.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === '' || d.status === statusFilter;
      const matchesType = typeFilter === '' || d.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [devices, searchQuery, statusFilter, typeFilter]);

  const hasActiveFilters = searchQuery !== '' || statusFilter !== '' || typeFilter !== '';

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setTypeFilter('');
  };

  const getDeviceSession = (deviceId: string) => {
    return sessions.find(
      (s) => s.status === 'aberta' && s.allocatedDeviceIds.includes(deviceId)
    );
  };

  return (
    <div>
      <PageHeader
        title="Dispositivos Pedagógicos"
        subtitle="Inventário de Chromebooks, tablets e notebooks educacionais sob gestão da escola."
      />

      {/* Resumo de Inventário */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <span className="text-xs text-slate-500 block">Total no Inventário</span>
          <span className="text-2xl font-bold text-brand-text">{devices.length}</span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <span className="text-xs text-slate-500 block">Disponíveis</span>
          <span className="text-2xl font-bold text-emerald-700">
            {devices.filter((d) => d.status === 'disponivel').length}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <span className="text-xs text-slate-500 block">Em Uso</span>
          <span className="text-2xl font-bold text-blue-700">
            {devices.filter((d) => d.status === 'em_uso').length}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <span className="text-xs text-slate-500 block">Em Manutenção</span>
          <span className="text-2xl font-bold text-amber-700">
            {devices.filter((d) => d.status === 'manutencao').length}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          statusOptions={[
            { label: 'Disponível', value: 'disponivel' },
            { label: 'Em Uso', value: 'em_uso' },
            { label: 'Em Manutenção', value: 'manutencao' },
          ]}
          categoryFilter={typeFilter}
          onCategoryChange={setTypeFilter}
          categoryOptions={[
            { label: 'Chromebook', value: 'chromebook' },
            { label: 'Tablet', value: 'tablet' },
            { label: 'Notebook', value: 'notebook' },
          ]}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
          searchPlaceholder="Buscar por patrimônio ou modelo..."
        />
      </div>

      {filteredDevices.length === 0 ? (
        <EmptyState
          title="Nenhum dispositivo encontrado"
          description="Nenhum equipamento corresponde aos filtros aplicados."
          actionLabel="Limpar Filtros"
          onAction={handleClearFilters}
        />
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left">
                    Patrimônio
                  </th>
                  <th scope="col" className="px-4 py-3 text-left">
                    Modelo / Fabricante
                  </th>
                  <th scope="col" className="px-4 py-3 text-left">
                    Tipo
                  </th>
                  <th scope="col" className="px-4 py-3 text-left">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-left">
                    Alocação Atual
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredDevices.map((device) => {
                  const currentSession = getDeviceSession(device.id);

                  return (
                    <tr key={device.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-bold text-brand-text whitespace-nowrap">
                        {device.patrimonio}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{device.model}</td>
                      <td className="px-4 py-3 uppercase text-xs font-medium text-slate-500 whitespace-nowrap">
                        {device.type}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge type="device" value={device.status} />
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {currentSession ? (
                          <span className="text-blue-700 font-semibold">
                            Em aula: {currentSession.objective.slice(0, 35)}...
                          </span>
                        ) : device.status === 'manutencao' ? (
                          <span className="text-amber-800 italic">Chamado técnico aberto</span>
                        ) : (
                          <span className="text-slate-400">Carrinho de recarga</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
