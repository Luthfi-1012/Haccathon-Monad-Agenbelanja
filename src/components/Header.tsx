'use client';

import React, { useState } from 'react';
import { Zap, Wallet, CheckCircle2, AlertTriangle, LogOut, ShieldCheck } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';

interface HeaderProps {
  onResetDemo?: () => void;
  arenaMode: boolean;
  onToggleArenaMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onResetDemo, arenaMode, onToggleArenaMode }) => {
  const { address, isConnected, isWrongNetwork, connectWallet, disconnectWallet, switchNetwork } = useWallet();
  const [showDisconnect, setShowDisconnect] = useState(false);

  const short = address ? `${address.substring(0, 6)}…${address.substring(address.length - 4)}` : '';

  const handleWalletClick = () => {
    if (isWrongNetwork) switchNetwork();
    else if (!isConnected) connectWallet();
    else setShowDisconnect((p) => !p);
  };

  return (
    <header style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '0.75rem 1rem',
      marginBottom: 'var(--space-lg)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        {/* Left: Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 30, height: 30, borderRadius: 'var(--radius-sm)',
            background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          }}>
            <Zap size={15} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>AgenBelanja</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500 }}>Workspace</span>
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {/* Arena Toggle */}
          <button
            className="btn btn-ghost"
            onClick={onToggleArenaMode}
            style={{
              padding: '0.3rem 0.6rem', fontSize: '0.72rem',
              borderRadius: 'var(--radius-sm)',
              background: arenaMode ? 'var(--primary-subtle)' : 'transparent',
              color: arenaMode ? 'var(--primary)' : 'var(--text-muted)',
              border: arenaMode ? '1px solid rgba(131,110,249,0.2)' : '1px solid var(--border-subtle)',
            }}
            title="Toggle Arena On-Chain mode"
          >
            <ShieldCheck size={12} />
            {arenaMode ? 'Arena On-Chain' : 'Arena Off'}
          </button>

          {/* Network */}
          <div className="chip" style={{ fontSize: '0.7rem' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: isWrongNetwork ? 'var(--danger)' : 'var(--success)' }} />
            Monad <span className="mono" style={{ color: 'var(--text-muted)' }}>10143</span>
          </div>

          {/* Wallet */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-secondary"
              onClick={handleWalletClick}
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem', borderRadius: 'var(--radius-sm)' }}
            >
              <Wallet size={12} color={isConnected ? (isWrongNetwork ? 'var(--danger)' : 'var(--success)') : 'var(--text-muted)'} />
              {isConnected ? (
                isWrongNetwork ? (
                  <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <AlertTriangle size={11} /> Switch Network
                  </span>
                ) : (
                  <span className="mono" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle2 size={11} color="var(--success)" /> {short}
                  </span>
                )
              ) : (
                'Connect Wallet'
              )}
            </button>

            {showDisconnect && isConnected && (
              <div style={{
                position: 'absolute', right: 0, top: '115%', zIndex: 50,
                background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-sm)', padding: '0.35rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              }}>
                <button
                  className="btn"
                  onClick={() => { disconnectWallet(); setShowDisconnect(false); }}
                  style={{
                    padding: '0.3rem 0.6rem', fontSize: '0.72rem',
                    color: 'var(--danger)', background: 'var(--danger-subtle)',
                    border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)', width: '100%',
                  }}
                >
                  <LogOut size={11} /> Disconnect
                </button>
              </div>
            )}
          </div>

          {/* Reset */}
          {onResetDemo && (
            <button
              className="btn btn-ghost"
              onClick={onResetDemo}
              style={{ padding: '0.3rem 0.5rem', fontSize: '0.72rem' }}
              title="Reset demo state"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
