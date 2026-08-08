'use client';

import React, { useState } from 'react';
import { Zap, Wallet, CheckCircle2, AlertTriangle, LogOut, ShieldCheck, RefreshCw } from 'lucide-react';
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
    <header className="glass-card" style={{
      padding: '0.85rem 1.25rem',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.85rem',
    }}>
      {/* Brand Identity with Viga Font */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <div style={{
          width: 34, height: 34, borderRadius: '0.5rem',
          background: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          boxShadow: '0 0 15px rgba(131, 110, 249, 0.4)',
        }}>
          <Zap size={18} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span className="font-viga" style={{ fontSize: '1.15rem', color: '#ffffff', letterSpacing: '0.01em' }}>
              AgenBelanja
            </span>
            <span className="chip" style={{ fontSize: '0.68rem', padding: '0.15rem 0.55rem', background: 'var(--primary-subtle)', color: '#a594fd', borderColor: 'var(--border-default)' }}>
              Workspace
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Parallel Agentic Commerce Protocol
          </p>
        </div>
      </div>

      {/* Controls with Lucide Icons & 2-Color styling */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {/* Arena Mode Toggle */}
        <button
          className="btn"
          onClick={onToggleArenaMode}
          style={{
            padding: '0.4rem 0.75rem',
            fontSize: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            background: arenaMode ? 'var(--primary-subtle)' : 'var(--surface-translucent)',
            color: arenaMode ? '#a594fd' : 'var(--text-secondary)',
            border: `1px solid ${arenaMode ? 'var(--primary)' : 'var(--border-subtle)'}`,
            fontWeight: 600,
          }}
          title="Toggle Arena On-Chain Mode"
        >
          <ShieldCheck size={13} color={arenaMode ? 'var(--primary)' : 'var(--text-muted)'} />
          {arenaMode ? 'Arena On-Chain (Active)' : 'Arena Mode Off'}
        </button>

        {/* Network Pill */}
        <div className="chip" style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: isWrongNetwork ? 'var(--danger)' : 'var(--primary)', boxShadow: '0 0 6px var(--primary)' }} />
          Monad <span className="mono" style={{ color: 'var(--text-muted)' }}>10143</span>
        </div>

        {/* Wallet Button */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-secondary"
            onClick={handleWalletClick}
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
          >
            <Wallet size={13} color={isConnected ? (isWrongNetwork ? 'var(--danger)' : 'var(--primary)') : 'var(--text-muted)'} />
            {isConnected ? (
              isWrongNetwork ? (
                <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <AlertTriangle size={12} /> Switch Network
                </span>
              ) : (
                <span className="mono" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#fff' }}>
                  <CheckCircle2 size={12} color="var(--primary)" /> {short}
                </span>
              )
            ) : (
              'Connect Wallet'
            )}
          </button>

          {/* Disconnect Dropdown */}
          {showDisconnect && isConnected && (
            <div style={{
              position: 'absolute', right: 0, top: '120%', zIndex: 50,
              background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)', padding: '0.4rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            }}>
              <button
                className="btn"
                onClick={() => { disconnectWallet(); setShowDisconnect(false); }}
                style={{
                  padding: '0.35rem 0.75rem', fontSize: '0.75rem',
                  color: 'var(--danger)', background: 'var(--danger-subtle)',
                  border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)', width: '100%',
                }}
              >
                <LogOut size={12} /> Disconnect Wallet
              </button>
            </div>
          )}
        </div>

        {/* Reset Button */}
        {onResetDemo && (
          <button
            className="btn btn-ghost"
            onClick={onResetDemo}
            style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
            title="Reset Demo State"
          >
            <RefreshCw size={12} /> Reset
          </button>
        )}
      </div>
    </header>
  );
};
