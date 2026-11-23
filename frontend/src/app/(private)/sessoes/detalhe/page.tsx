// src/app/(private)/sessoes/detalhe/page.tsx

import { Suspense } from 'react';
import SessionDetailPageClient from './SessionDetailPageClient';

export default function SessionDetailPage() {
  return (
    <Suspense fallback={<div>Carregando sessão...</div>}>
      <SessionDetailPageClient />
    </Suspense>
  );
}   