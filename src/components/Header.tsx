'use client';

import React from 'react';
import { ShoppingBag, Wallet, CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';

interface HeaderProps {
  onResetDemo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onResetDemo }) => {
  const { address, isConnected, isWrongNetwork, connectWallet, switchNetwork } = useWallet();

  const shortenedAddress = address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';

  const handleWalletClick = () => {
    if (isWrongNetwork) {
      switchNetwork();
    } else if (!isConnected) {
      connectWallet();
    }
  };

  return (
    <header className="glass-card mb-6" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Brand & Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '0.5rem',
              background: 'var(--primary-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <ShoppingBag size={19} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                AgenBelanja
              </h1>
              <span className="badge badge-quoted" style={{ fontSize: '0.65rem' }}>
                Monad x402 Agent
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Parallel Autonomous Commerce Protocol
            </p>
          </div>
        </div>

        {/* Network & Wallet Status Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              padding: '0.35rem 0.75rem',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isWrongNetwork ? 'var(--danger-red)' : 'var(--primary-accent)' }} />
            Monad Testnet <span className="mono" style={{ color: 'var(--text-muted)' }}>(10143)</span>
          </div>

          <button
            className="btn btn-secondary"
            onClick={handleWalletClick}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              borderRadius: '0.375rem',
              borderColor: isWrongNetwork ? 'var(--danger-red)' : undefined,
            }}
            title={isConnected ? 'Wallet Connected' : 'Connect MetaMask Wallet'}
          >
            <Wallet size={13} color={isConnected ? (isWrongNetwork ? 'var(--danger-red)' : 'var(--success-green)') : 'var(--text-muted)'} />
            {isConnected ? (
              isWrongNetwork ? (
                <span style={{ color: 'var(--danger-red)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertTriangle size={12} /> Switch to Monad
                </span>
              ) : (
                <span className="mono" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={12} color="var(--success-green)" /> {shortenedAddress}
                </span>
              )
            ) : (
              <span>Connect Wallet</span>
            )}
          </button>

          {onResetDemo && (
            <button
              className="btn btn-secondary"
              onClick={onResetDemo}
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', borderRadius: '0.375rem' }}
              title="Reset Demo State"
            >
              <RefreshCw size={12} /> Reset
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
