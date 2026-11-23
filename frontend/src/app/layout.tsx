// src/app/layout.tsx

import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Proteca — Foco e Segurança Pedagógica',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) { 
  return ( 
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Proteca — Foco e Segurança Pedagógica</title>
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}