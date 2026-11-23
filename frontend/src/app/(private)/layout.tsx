// src/app/(private)/layout.tsx

import { AppShell } from '@/components/AppShell';
import { AuthGuard } from '@/components/AuthGuard';
import { SchoolProvider } from '@/context/SchoolContext';

export default function PrivateLayout({
  children,
}: { 
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SchoolProvider>
        <AppShell>{children}</AppShell>
      </SchoolProvider>
    </AuthGuard>
  );
}