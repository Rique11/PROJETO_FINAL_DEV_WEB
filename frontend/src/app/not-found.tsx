import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-brand-text mb-2">Página não encontrada</h2>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        A página que você tentou acessar não existe ou foi movida.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold text-white bg-brand-action hover:bg-brand-action-hover"
      >
        Voltar para o Painel Geral
      </Link>
    </div>
  );
}
