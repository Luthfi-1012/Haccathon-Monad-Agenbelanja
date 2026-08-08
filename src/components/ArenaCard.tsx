'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShieldAlert, ExternalLink, Zap, Clock, Lock, RefreshCw, AlertCircle } from 'lucide-react';
import { Order } from '../types/negotiation';
import { useWallet } from '@/context/WalletContext';
import { createWalletClient, createPublicClient, custom, http, keccak256, toHex, parseEventLogs } from 'viem';
import { NEGOSIASI_ARENA_ABI, ERC20_ABI } from '@/lib/abi';

interface ArenaCardProps {
  order: Order | null;
  onResetDemo: () => void;
  onSettledSuccess?: (txHash: string, winningBid: number, savingsReturned: number) => void;
}

const ARENA_ADDRESS = (process.env.NEXT_PUBLIC_ARENA_ADDRESS || '') as `0x${string}`;
const USDC_ADDRESS = (process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x534b2f3A21130d7a60830c2Df862319e593943A3') as `0x${string}`;
const MONAD_RPC = process.env.NEXT_PUBLIC_MONAD_RPC_URL || 'https://testnet-rpc.monad.xyz';

const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: { default: { http: [MONAD_RPC] } },
};

export const ArenaCard: React.FC<ArenaCardProps> = ({ order, onResetDemo, onSettledSuccess }) => {
  const { address, isConnected, isWrongNetwork, connectWallet, switchNetwork } = useWallet();

  const [auctionId, setAuctionId] = useState<number | null>(null);
  const [createTxHash, setCreateTxHash] = useState<string | null>(null);
  const [settleTxHash, setSettleTxHash] = useState<string | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'APPROVING' | 'CREATING' | 'WAITING_BIDS' | 'READY_SETTLE' | 'SETTLING' | 'SETTLED' | 'FAILED'>('IDLE');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [bidsReceived, setBidsReceived] = useState<any[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'WAITING_BIDS' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setStatus('READY_SETTLE');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  if (!order) return null;

  const isNoDeal = order.status === 'NO_DEAL';
  const budgetUnits = BigInt(Math.round(order.budgetAmount * 1e6));

  // ── ALL ON-CHAIN LOGIC PRESERVED EXACTLY ──
  const handleCreateArenaAuction = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }
    if (isWrongNetwork) {
      await switchNetwork();
      return;
    }

    if (!ARENA_ADDRESS) {
      setErrorMsg('ARENA_ADDRESS not deployed — check .env');
      return;
    }

    try {
      setErrorMsg(null);
      setStatus('APPROVING');

      const ethereum = (window as any).ethereum;
      const walletClient = createWalletClient({
        chain: monadTestnet,
        transport: custom(ethereum),
      });
      const publicClient = createPublicClient({
        chain: monadTestnet,
        transport: http(MONAD_RPC),
      });

      const userAccount = address as `0x${string}`;

      // Check USDC balance first to prevent silent revert
      try {
        const usdcBalance = await publicClient.readContract({
          address: USDC_ADDRESS,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [userAccount],
        });

        if (usdcBalance < budgetUnits) {
          setErrorMsg(`Insufficient USDC balance (${Number(usdcBalance) / 1e6} USDC) for ${order.budgetAmount} USDC escrow. Use a Monad USDC faucet.`);
          setStatus('IDLE');
          return;
        }
      } catch (balErr) {
        console.warn('Could not read USDC balance:', balErr);
      }

      // Check allowance
      const allowance = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [userAccount, ARENA_ADDRESS],
      });

      if (allowance < budgetUnits) {
        const approveHash = await walletClient.writeContract({
          account: userAccount,
          address: USDC_ADDRESS,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [ARENA_ADDRESS, budgetUnits],
        });
        const approveReceipt = await publicClient.waitForTransactionReceipt({ hash: approveHash });
        if (approveReceipt.status === 'reverted') {
          throw new Error('USDC Approve transaction was reverted.');
        }
      }

      setStatus('CREATING');
      const itemHash = keccak256(toHex(order.itemDescription));
      const biddingDuration = BigInt(120); // 120 seconds

      const createHash = await walletClient.writeContract({
        account: userAccount,
        address: ARENA_ADDRESS,
        abi: NEGOSIASI_ARENA_ABI,
        functionName: 'createAuction',
        args: [itemHash, budgetUnits, biddingDuration],
      });

      setCreateTxHash(createHash);
      const receipt = await publicClient.waitForTransactionReceipt({ hash: createHash });

      if (receipt.status === 'reverted') {
        throw new Error('createAuction was reverted by Monad. Ensure sufficient USDC Testnet balance.');
      }

      // Retrieve new auction ID safely directly from event logs
      let currentAuctionId = 0;
      try {
        const logs = parseEventLogs({
          abi: NEGOSIASI_ARENA_ABI,
          eventName: 'AuctionCreated',
          logs: receipt.logs,
        });

        if (logs && logs.length > 0 && logs[0].args && 'auctionId' in logs[0].args) {
          currentAuctionId = Number(logs[0].args.auctionId);
        } else {
          const nextId = await publicClient.readContract({
            address: ARENA_ADDRESS,
            abi: NEGOSIASI_ARENA_ABI,
            functionName: 'nextAuctionId',
          });
          currentAuctionId = Math.max(0, Number(nextId) - 1);
        }
      } catch (logErr) {
        const nextId = await publicClient.readContract({
          address: ARENA_ADDRESS,
          abi: NEGOSIASI_ARENA_ABI,
          functionName: 'nextAuctionId',
        });
        currentAuctionId = Math.max(0, Number(nextId) - 1);
      }

      setAuctionId(currentAuctionId);
      setStatus('WAITING_BIDS');
      setTimeLeft(120);

      // Trigger agent bidding on-chain via server route handler
      const vendorList = Object.entries(order.vendors || {}).map(([vId, vData]) => ({
        vendorId: vId,
        finalPrice: (vData as any).currentOffer || (vData as any).initialPrice || order.finalPrice,
        status: (vData as any).status,
      }));

      fetch('/api/arena/bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auctionId: currentAuctionId,
          orderId: order.orderId,
          vendorBids: vendorList,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.results) {
            setBidsReceived(data.results);
          }
        })
        .catch((err) => console.error('Agent bidding trigger error:', err));
    } catch (err: any) {
      console.error('Error creating auction:', err);
      if (err?.message?.includes('User denied') || err?.code === 4001) {
        setErrorMsg('Transaction cancelled by user in MetaMask.');
      } else {
        setErrorMsg(err?.message || 'Failed to create Arena On-Chain auction.');
      }
      setStatus('IDLE');
    }
  };

  const handleSettleAuction = async () => {
    if (auctionId === null || auctionId < 0) {
      setErrorMsg('Invalid Auction ID.');
      return;
    }
    try {
      setErrorMsg(null);
      setStatus('SETTLING');

      const ethereum = (window as any).ethereum;
      const walletClient = createWalletClient({
        chain: monadTestnet,
        transport: custom(ethereum),
      });
      const publicClient = createPublicClient({
        chain: monadTestnet,
        transport: http(MONAD_RPC),
      });

      const userAccount = address as `0x${string}`;

      const hash = await walletClient.writeContract({
        account: userAccount,
        address: ARENA_ADDRESS,
        abi: NEGOSIASI_ARENA_ABI,
        functionName: 'settle',
        args: [BigInt(auctionId)],
      });

      setSettleTxHash(hash);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === 'reverted') {
        throw new Error('Settlement was reverted (bidding may still be open / BiddingStillOpen).');
      }

      setStatus('SETTLED');
    } catch (err: any) {
      console.error('Error settling auction:', err);
      if (err?.message?.includes('User denied') || err?.code === 4001) {
        setErrorMsg('Settlement cancelled by user in MetaMask.');
      } else {
        setErrorMsg(err?.message || 'Failed to execute on-chain settlement.');
      }
      setStatus('READY_SETTLE');
    }
  };

  // ── VISUAL REDESIGN ──
  const getStatusChip = () => {
    switch (status) {
      case 'IDLE': return { label: 'Ready', color: 'var(--text-muted)' };
      case 'APPROVING': return { label: 'Approving USDC…', color: 'var(--warning)' };
      case 'CREATING': return { label: 'Creating Auction…', color: 'var(--warning)' };
      case 'WAITING_BIDS': return { label: `Bidding Open · ${timeLeft}s`, color: 'var(--primary)' };
      case 'READY_SETTLE': return { label: 'Ready to Settle', color: 'var(--success)' };
      case 'SETTLING': return { label: 'Settling…', color: 'var(--warning)' };
      case 'SETTLED': return { label: 'Settled ✓', color: 'var(--success)' };
      case 'FAILED': return { label: 'Failed', color: 'var(--danger)' };
    }
  };

  const chipInfo = getStatusChip();

  return (
    <div className="glass-card" style={{
      padding: 'var(--space-lg)',
      borderColor: status === 'SETTLED' ? 'rgba(16,185,129,0.3)' : 'rgba(131,110,249,0.2)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
        <h3 style={{ fontSize: '0.92rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Lock size={15} color="var(--primary)" /> Arena On-Chain
        </h3>
        <div className="chip" style={{
          background: status === 'SETTLED' ? 'var(--success-subtle)' : status === 'IDLE' ? undefined : 'var(--primary-subtle)',
          color: chipInfo.color,
          borderColor: status === 'SETTLED' ? 'rgba(16,185,129,0.2)' : status === 'IDLE' ? undefined : 'rgba(131,110,249,0.2)',
        }}>
          {(status === 'APPROVING' || status === 'CREATING' || status === 'SETTLING') && (
            <RefreshCw size={10} style={{ animation: 'spin 1s linear infinite' }} />
          )}
          {status === 'WAITING_BIDS' && (
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', animation: 'pulse-dot 1.5s infinite' }} />
          )}
          {chipInfo.label}
        </div>
      </div>

      {isNoDeal ? (
        <div style={{
          padding: 'var(--space-md)', background: 'var(--danger-subtle)',
          borderRadius: 'var(--radius-md)', border: '1px solid rgba(239,68,68,0.15)',
        }}>
          <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
            <ShieldAlert size={15} /> Arena Not Opened (No Deal)
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            All vendors rejected the offer. Arena auction cannot be opened.
          </p>
        </div>
      ) : (
        <div>
          {/* Summary Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem', marginBottom: 'var(--space-md)' }}>
            <div style={{ padding: '0.6rem', background: 'var(--bg-recessed)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Target Vendor</span>
              <p style={{ fontSize: '0.88rem', fontWeight: 700 }}>{order.selectedVendorName}</p>
            </div>
            <div style={{ padding: '0.6rem', background: 'var(--bg-recessed)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Escrow Cap</span>
              <p className="mono" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary)' }}>{order.budgetAmount} USDC</p>
            </div>
          </div>

          {/* Error */}
          {errorMsg && (
            <div style={{
              padding: '0.55rem 0.75rem', background: 'var(--danger-subtle)',
              border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)',
              color: '#fca5a5', fontSize: '0.78rem', marginBottom: 'var(--space-md)',
              display: 'flex', alignItems: 'flex-start', gap: '0.35rem',
            }}>
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ── IDLE: Create Auction ── */}
          {status === 'IDLE' && (
            <button
              className="btn btn-primary"
              onClick={handleCreateArenaAuction}
              style={{ width: '100%', padding: '0.8rem', fontSize: '0.88rem', borderRadius: 'var(--radius-md)' }}
            >
              <Lock size={15} /> Open Arena Escrow ({order.budgetAmount} USDC)
            </button>
          )}

          {/* ── APPROVING / CREATING ── */}
          {(status === 'APPROVING' || status === 'CREATING') && (
            <div style={{
              padding: '0.8rem', background: 'var(--bg-recessed)',
              borderRadius: 'var(--radius-md)', textAlign: 'center',
            }}>
              <p style={{
                fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
              }}>
                <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                {status === 'APPROVING' ? 'Approve USDC allowance in wallet…' : 'Creating Arena auction on Monad…'}
              </p>
            </div>
          )}

          {/* ── WAITING / READY / SETTLING ── */}
          {(status === 'WAITING_BIDS' || status === 'READY_SETTLE' || status === 'SETTLING') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{
                padding: '0.75rem', background: 'var(--bg-recessed)',
                borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={13} color="var(--primary)" /> Auction #{auctionId ?? 0}
                  </span>
                  <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--primary)' }}>
                    {timeLeft}s remaining
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {order.budgetAmount} USDC locked in escrow. Vendors confirming bids on-chain…
                </p>

                {createTxHash && (
                  <a
                    href={`https://testnet.monadexplorer.com/tx/${createTxHash}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '0.7rem', color: 'var(--primary)',
                      display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                      marginTop: '0.35rem', textDecoration: 'underline',
                    }}
                  >
                    View create tx <ExternalLink size={10} />
                  </a>
                )}
              </div>

              {/* Bids Received */}
              {bidsReceived.length > 0 && (
                <div style={{
                  padding: '0.6rem', background: 'var(--bg-recessed)',
                  borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)',
                  fontSize: '0.75rem',
                }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Bids received on-chain:</span>
                  {bidsReceived.map((b, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                      <span>{b.vendorName}:</span>
                      <span className="mono" style={{ color: 'var(--success)' }}>{b.priceUsdc} USDC</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="btn btn-accent"
                onClick={handleSettleAuction}
                disabled={status === 'SETTLING'}
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.85rem', borderRadius: 'var(--radius-md)' }}
              >
                <Zap size={15} />
                {status === 'SETTLING'
                  ? 'Processing on-chain settlement…'
                  : 'Settle Now (Pay Vendor & Auto-Refund Change)'}
              </button>
            </div>
          )}

          {/* ── SETTLED ── */}
          {status === 'SETTLED' && (
            <div style={{
              padding: '0.8rem', background: 'var(--success-subtle)',
              border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-md)',
            }}>
              <p style={{
                fontWeight: 700, color: '#6ee7b7', fontSize: '0.85rem',
                display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem',
              }}>
                <CheckCircle2 size={15} /> Arena Settlement Complete
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Winning vendor paid. Remaining savings auto-refunded to your wallet.
              </p>
              {settleTxHash && (
                <a
                  href={`https://testnet.monadexplorer.com/tx/${settleTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '0.7rem', color: 'var(--success)',
                    display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                    marginTop: '0.35rem', textDecoration: 'underline',
                  }}
                >
                  View settle tx <ExternalLink size={10} />
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
