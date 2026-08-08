import React from 'react';
import './globals.css';
import { WalletProvider } from '@/context/WalletContext';

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
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
