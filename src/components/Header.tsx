'use client';

import React, { useState } from 'react';
import { Wallet, CheckCircle2, AlertTriangle, LogOut, ShieldCheck, RefreshCw } from 'lucide-react';
import Link from 'next/link';
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
      {/* Brand Identity with Poppins Font */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <Link href="/" className="wordmark-minimal">
          <span>AgenBelanja</span>
          <span className="brand-dot">.</span>
        </Link>
        <span className="chip" style={{ fontSize: '0.72rem', padding: '0.2rem 0.65rem', background: 'var(--primary-subtle)', color: '#a594fd', borderColor: 'var(--border-default)', fontWeight: 600 }}>
          Workspace
        </span>
      </div>

      {/* Controls with Crisp Poppins Labels */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {/* Arena Mode Toggle */}
        <button
          className="btn"
          onClick={onToggleArenaMode}
          style={{
            padding: '0.45rem 0.85rem',
            fontSize: '0.78rem',
            background: arenaMode ? 'var(--primary-subtle)' : 'var(--surface-translucent)',
            color: arenaMode ? '#a594fd' : 'var(--text-secondary)',
            border: `1px solid ${arenaMode ? 'var(--primary)' : 'var(--border-subtle)'}`,
            fontWeight: 600,
          }}
          title="Toggle Arena On-Chain Mode"
        >
          <ShieldCheck size={14} color={arenaMode ? 'var(--primary)' : 'var(--text-muted)'} />
          {arenaMode ? 'Arena On-Chain (Active)' : 'Arena Mode Off'}
        </button>

        {/* Network Pill */}
        <div className="chip" style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: isWrongNetwork ? 'var(--danger)' : 'var(--primary)', boxShadow: '0 0 6px var(--primary)' }} />
          Monad <span className="mono" style={{ color: 'var(--text-muted)' }}>10143</span>
        </div>

        {/* Wallet Button */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-secondary"
            onClick={handleWalletClick}
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
          >
            <Wallet size={14} color={isConnected ? (isWrongNetwork ? 'var(--danger)' : 'var(--primary)') : 'var(--text-muted)'} />
            {isConnected ? (
              isWrongNetwork ? (
                <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <AlertTriangle size={13} /> Switch Network
                </span>
              ) : (
                <span className="mono" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#fff', fontWeight: 600 }}>
                  <CheckCircle2 size={13} color="var(--primary)" /> {short}
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
                  padding: '0.4rem 0.85rem', fontSize: '0.78rem',
                  color: 'var(--danger)', background: 'var(--danger-subtle)',
                  border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-sm)', width: '100%',
                }}
              >
                <LogOut size={13} /> Disconnect Wallet
              </button>
            </div>
          )}
        </div>

        {/* Reset Button */}
        {onResetDemo && (
          <button
            className="btn btn-ghost"
            onClick={onResetDemo}
            style={{ padding: '0.45rem 0.65rem', fontSize: '0.78rem' }}
            title="Reset Demo State"
          >
            <RefreshCw size={13} /> Reset
          </button>
        )}
      </div>
    </header>
  );
};
