import type { Metadata } from 'next';
import './globals.css';
import { SchoolProvider } from '@/context/SchoolContext';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Proteca — Foco e Segurança Pedagógica',
  description:
    'Proteca apoia professores no uso pedagógico e seguro de dispositivos escolares, com orientação formativa.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <SchoolProvider>
          <AppShell>{children}</AppShell>
        </SchoolProvider>
      </body>
    </html>
  );
}
