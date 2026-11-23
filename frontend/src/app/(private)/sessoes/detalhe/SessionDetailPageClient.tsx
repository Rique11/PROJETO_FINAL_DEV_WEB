//src/app/(private)/sessoes/detalhe/SessionDetailPageClient.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import SessionDetailClient from './SessionDetailClient';

export default function SessionDetailPageClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('id');

  if (!sessionId) {
    return (
      <div className="p-6 bg-white border rounded-lg"> 
        Identificador da sessão não informado.
      </div>
    );
  }

  return <SessionDetailClient sessionId={sessionId} />;
}