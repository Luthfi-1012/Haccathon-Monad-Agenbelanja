'use client';

import React, { useState } from 'react';
import { ShoppingBag, Wallet, CheckCircle2, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onResetDemo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onResetDemo }) => {
  const [walletState, setWalletState] = useState<'CONNECTED' | 'DISCONNECTED' | 'WRONG_NETWORK'>('CONNECTED');
  const walletAddress = '0x71C...4e8B';

  const toggleWalletState = () => {
    if (walletState === 'CONNECTED') setWalletState('WRONG_NETWORK');
    else if (walletState === 'WRONG_NETWORK') setWalletState('DISCONNECTED');
    else setWalletState('CONNECTED');
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
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-accent)' }} />
            Monad Testnet <span className="mono" style={{ color: 'var(--text-muted)' }}>(10143)</span>
          </div>

          <button
            className="btn btn-secondary"
            onClick={toggleWalletState}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.375rem' }}
            title="Toggle wallet status for demo testing"
          >
            <Wallet size={13} color={walletState === 'CONNECTED' ? 'var(--success-green)' : walletState === 'WRONG_NETWORK' ? 'var(--danger-red)' : 'var(--text-muted)'} />
            {walletState === 'CONNECTED' && (
              <span className="mono" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-primary)' }}>
                <CheckCircle2 size={12} color="var(--success-green)" /> {walletAddress}
              </span>
            )}
            {walletState === 'WRONG_NETWORK' && <span style={{ color: 'var(--danger-red)' }}>Wrong Network</span>}
            {walletState === 'DISCONNECTED' && <span>Connect Wallet</span>}
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
