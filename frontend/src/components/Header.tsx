'use client';

import React from 'react';
import Link from 'next/link';
import { useSchool } from '@/context/SchoolContext';

export const Header: React.FC = () => {
  const { school } = useSchool();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-brand-primary flex items-center justify-center text-white font-bold text-sm">
              VE
            </div>
            <span className="font-bold text-brand-text">Vigia Escolar</span>
          </Link>
          <div className="hidden sm:block">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Unidade Escolar
            </span>
            <p className="text-sm font-semibold text-brand-text">
              {school?.name || 'Escola Municipal Alberto Santos Dumont'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-700">Prof. Carlos Eduardo</p>
            <p className="text-[11px] text-slate-500">Docente de Geografia</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-brand-primary text-white font-semibold flex items-center justify-center text-sm shadow-sm">
            CE
          </div>
        </div>
      </div>
    </header>
  );
};
