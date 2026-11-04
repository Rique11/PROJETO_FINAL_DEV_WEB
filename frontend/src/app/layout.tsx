import type { Metadata } from 'next';
import './globals.css';
import { SchoolProvider } from '@/context/SchoolContext';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Vigia Escolar — Uso Pedagógico e Gestão de Dispositivos',
  description:
    'Vigia Escolar organiza o uso pedagógico de Chromebooks e tablets em escolas de educação básica. Acompanhamento docente, registro de ocorrências e orientação formativa.',
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
