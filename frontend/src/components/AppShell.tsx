'use client';

import React from 'react';
import { DemoNotice } from './DemoNotice';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useSchool } from '@/context/SchoolContext';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notifications, dismissNotification } = useSchool();

  return (
    <div className="min-h-screen flex flex-col bg-brand-background text-brand-text">
      {/* Aviso de demonstração permanente */}
      <DemoNotice />

      {/* Header Superior */}
      <Header />

      {/* Layout Principal com Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>
      </div>

      {/* Toast Notifications */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {notifications.map((notif) => (
          <div
            key={notif.id}
            role="status"
            className={`pointer-events-auto p-4 rounded-lg shadow-lg border text-sm flex items-start justify-between gap-3 transition-all ${
              notif.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : notif.type === 'warning'
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : notif.type === 'error'
                ? 'bg-red-50 text-red-900 border-red-200'
                : 'bg-slate-800 text-white border-slate-700'
            }`}
          >
            <div className="flex-1 font-medium">{notif.message}</div>
            <button
              type="button"
              onClick={() => dismissNotification(notif.id)}
              className="text-slate-400 hover:text-slate-600 rounded p-0.5"
              aria-label="Dispensar notificação"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
