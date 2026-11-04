import React from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter?: string;
  onStatusChange?: (status: string) => void;
  statusOptions?: FilterOption[];
  categoryFilter?: string;
  onCategoryChange?: (category: string) => void;
  categoryOptions?: FilterOption[];
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  searchPlaceholder?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statusOptions,
  categoryFilter,
  onCategoryChange,
  categoryOptions,
  onClearFilters,
  hasActiveFilters,
  searchPlaceholder = 'Buscar...',
}) => {
  return (
    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <label htmlFor="filter-search" className="sr-only">
          Buscar
        </label>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          id="filter-search"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-action focus:border-brand-action"
        />
      </div>

      {/* Status Filter */}
      {statusOptions && onStatusChange && (
        <div className="w-full md:w-48">
          <label htmlFor="filter-status" className="sr-only">
            Filtrar por Status
          </label>
          <select
            id="filter-status"
            value={statusFilter || ''}
            onChange={(e) => onStatusChange(e.target.value)}
            className="block w-full py-2 px-3 border border-slate-300 bg-white rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-action focus:border-brand-action"
          >
            <option value="">Todos os status</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Category Filter */}
      {categoryOptions && onCategoryChange && (
        <div className="w-full md:w-56">
          <label htmlFor="filter-category" className="sr-only">
            Filtrar por Categoria
          </label>
          <select
            id="filter-category"
            value={categoryFilter || ''}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="block w-full py-2 px-3 border border-slate-300 bg-white rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-action focus:border-brand-action"
          >
            <option value="">Todas as categorias</option>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Clear button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="px-3 py-2 text-sm text-slate-600 hover:text-brand-danger border border-slate-200 hover:border-red-200 rounded-md transition-colors"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
};
