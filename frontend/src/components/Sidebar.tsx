'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Painel Geral',
      href: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      label: 'Sessões de Aula',
      href: '/sessoes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      label: 'Ocorrências',
      href: '/ocorrencias',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    {
      label: 'Dispositivos',
      href: '/dispositivos',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 shrink-0">
      <div className="p-4 hidden md:block border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-brand-primary flex items-center justify-center text-white font-bold">
            VE
          </div>
          <div>
            <h2 className="text-base font-bold text-brand-text leading-tight">Vigia Escolar</h2>
            <p className="text-[11px] text-slate-500">Gestão e Apoio Pedagógico</p>
          </div>
        </div>
      </div>

      <nav className="p-2 md:p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname?.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-brand-primary-light text-brand-primary font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-brand-text'
              }`}
            >
              <span className={isActive ? 'text-brand-primary' : 'text-slate-400'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mini info card on desktop */}
      <div className="hidden md:block p-4 mt-auto border-t border-slate-100 text-xs text-slate-500 bg-slate-50/50">
        <p className="font-semibold text-slate-700 mb-1">Tema 12 — UTFPR</p>
        <p>Controle pedagógico de dispositivos fornecidos pelo governo.</p>
        <p className="mt-2 text-[10px] text-slate-400">Aluno: Pedro Lucas (RA 2272040)</p>
      </div>
    </aside>
  );
};
