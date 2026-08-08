'use client';

import React, { useState } from 'react';
import { ShoppingBag, Wallet, CheckCircle2, RefreshCw, AlertTriangle, LogOut, Zap, ShieldCheck } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';

interface HeaderProps {
  onResetDemo?: () => void;
  arenaMode: boolean;
  onToggleArenaMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onResetDemo, arenaMode, onToggleArenaMode }) => {
  const { address, isConnected, isWrongNetwork, connectWallet, disconnectWallet, switchNetwork } = useWallet();
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  const shortenedAddress = address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';

  const handleWalletClick = () => {
    if (isWrongNetwork) {
      switchNetwork();
    } else if (!isConnected) {
      connectWallet();
    } else {
      setShowDisconnectConfirm((prev) => !prev);
    }
  };

  const handleConfirmDisconnect = () => {
    disconnectWallet();
    setShowDisconnectConfirm(false);
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
              background: arenaMode ? 'linear-gradient(135deg, #836ef9 0%, #10b981 100%)' : 'var(--primary-accent)',
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
                {arenaMode ? 'Monad On-Chain Smart Contract' : 'Monad x402 Agent'}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Parallel Autonomous Commerce Protocol
            </p>
          </div>
        </div>

        {/* Network & Wallet Status Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', position: 'relative' }}>
          {/* Arena Mode Toggle Button */}
          <button
            className="btn"
            onClick={onToggleArenaMode}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              borderRadius: '0.375rem',
              background: arenaMode ? 'var(--primary-accent-subtle)' : 'rgba(255, 255, 255, 0.03)',
              color: arenaMode ? 'var(--primary-accent)' : 'var(--text-secondary)',
              border: `1px solid ${arenaMode ? 'var(--primary-accent)' : 'var(--border-subtle)'}`,
              fontWeight: 600,
            }}
            title="Toggle Mode Arena On-Chain (Smart Contract Reverse Auction)"
          >
            {arenaMode ? <ShieldCheck size={13} color="var(--primary-accent)" /> : <Zap size={13} />}
            {arenaMode ? 'Mode Arena On-Chain ⚡ (ACTIVE)' : 'Mode Arena On-Chain ⚡'}
          </button>

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

          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-secondary"
              onClick={handleWalletClick}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                borderRadius: '0.375rem',
                borderColor: isWrongNetwork ? 'var(--danger-red)' : undefined,
              }}
              title={isConnected ? 'Klik untuk opsi Disconnect Wallet' : 'Connect MetaMask Wallet'}
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

            {/* Disconnect Dropdown */}
            {showDisconnectConfirm && isConnected && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  background: '#121520',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '0.375rem',
                  padding: '0.5rem',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                  zIndex: 50,
                  whiteSpace: 'nowrap',
                }}
              >
                <button
                  className="btn"
                  onClick={handleConfirmDisconnect}
                  style={{
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    color: 'var(--danger-red)',
                    background: 'var(--danger-red-subtle)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '0.25rem',
                    width: '100%',
                  }}
                >
                  <LogOut size={12} /> Disconnect Wallet
                </button>
              </div>
            )}
          </div>

          {onResetDemo && (
            <button
              className="btn btn-secondary"
              onClick={onResetDemo}
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', borderRadius: '0.375rem' }}
              title="Reset Demo State (Mengosongkan simulasi negosiasi)"
            >
              <RefreshCw size={12} /> Reset
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
