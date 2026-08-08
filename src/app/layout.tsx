import React from 'react';
import './globals.css';
import { WalletProvider } from '@/context/WalletContext';

export const metadata = {
  title: 'AgenBelanja — Autonomous Purchasing Agent on Monad',
  description: 'Parallel agentic commerce: automated negotiation, budget-safe purchasing, and transparent settlement on Monad blockchain.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
