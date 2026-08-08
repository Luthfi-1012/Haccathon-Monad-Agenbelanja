import React from 'react';
import './globals.css';

export const metadata = {
  title: 'AgenBelanja — Agen Negosiasi Pembelian x402 Monad',
  description: 'Parallel Agentic Commerce Negotiation Platform on Monad',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
