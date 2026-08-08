'use client';

import React, { useState } from 'react';
import { ShoppingBag, Zap, Wallet, CheckCircle2, RefreshCw } from 'lucide-react';

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
    <header className="glass-card mb-6" style={{ padding: '1rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Wordmark & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #836ef9 0%, #20e2a2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(131, 110, 249, 0.4)',
            }}
          >
            <ShoppingBag size={22} color="#090a0f" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AgenBelanja
              </h1>
              <span className="badge badge-selected" style={{ fontSize: '0.65rem', padding: '0.15rem 0.55rem' }}>
                <Zap size={10} /> Powered by Monad + x402
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Tactical Parallel Commerce Command Console
            </p>
          </div>
        </div>

        {/* Network & Wallet Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Monad Network Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(131, 110, 249, 0.12)',
              border: '1px solid rgba(131, 110, 249, 0.3)',
              padding: '0.4rem 0.75rem',
              borderRadius: '2rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#a78bfa',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#836ef9', boxShadow: '0 0 8px #836ef9' }} />
            Monad Testnet (10143)
          </div>

          {/* Wallet State Button */}
          <button
            className="btn btn-secondary"
            onClick={toggleWalletState}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '2rem' }}
            title="Klik untuk mengganti status wallet demo"
          >
            <Wallet size={14} color={walletState === 'CONNECTED' ? '#20e2a2' : walletState === 'WRONG_NETWORK' ? '#ef4444' : 'var(--text-muted)'} />
            {walletState === 'CONNECTED' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={13} color="#20e2a2" /> {walletAddress}
              </span>
            )}
            {walletState === 'WRONG_NETWORK' && <span style={{ color: '#ef4444' }}>Wrong Network</span>}
            {walletState === 'DISCONNECTED' && <span>Connect Wallet</span>}
          </button>

          {/* Reset Demo Button */}
          {onResetDemo && (
            <button
              className="btn btn-secondary"
              onClick={onResetDemo}
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', borderRadius: '2rem' }}
              title="Reset Demo State"
            >
              <RefreshCw size={13} /> Reset Demo
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
