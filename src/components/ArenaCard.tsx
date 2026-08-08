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

  // ── PRESERVED ON-CHAIN LOGIC ──
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
      setErrorMsg('ARENA_ADDRESS contract address not found in environment.');
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

      // Check USDC balance
      try {
        const usdcBalance = await publicClient.readContract({
          address: USDC_ADDRESS,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [userAccount],
        });

        if (usdcBalance < budgetUnits) {
          setErrorMsg(`Insufficient USDC Testnet balance (${Number(usdcBalance) / 1e6} USDC) for ${order.budgetAmount} USDC escrow cap.`);
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
      const biddingDuration = BigInt(120);

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
        throw new Error('createAuction was reverted by Monad smart contract.');
      }

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
          if (data?.results) setBidsReceived(data.results);
        })
        .catch((err) => console.error('Agent bidding trigger error:', err));
    } catch (err: any) {
      console.error('Error creating auction:', err);
      if (err?.message?.includes('User denied') || err?.code === 4001) {
        setErrorMsg('Transaction canceled by user in MetaMask.');
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
        throw new Error('Settlement was reverted (bidding may still be open).');
      }

      setStatus('SETTLED');
    } catch (err: any) {
      console.error('Error settling auction:', err);
      if (err?.message?.includes('User denied') || err?.code === 4001) {
        setErrorMsg('Settlement canceled by user in MetaMask.');
      } else {
        setErrorMsg(err?.message || 'Failed to execute on-chain settlement.');
      }
      setStatus('READY_SETTLE');
    }
  };

  return (
    <div className="glass-card" style={{
      padding: '1.25rem 1.5rem',
      borderColor: status === 'SETTLED' ? 'var(--primary)' : 'var(--border-default)',
    }}>
      {/* Header with Viga Font */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 className="font-viga" style={{ fontSize: '1.05rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Lock size={16} color="var(--primary)" /> Arena On-Chain
        </h3>
        <span className="chip" style={{ fontSize: '0.72rem' }}>
          Monad Escrow Smart Contract
        </span>
      </div>

      {isNoDeal ? (
        <div style={{
          padding: '1rem', background: 'var(--danger-subtle)',
          borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239,68,68,0.2)',
        }}>
          <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
            <ShieldAlert size={15} /> Arena Not Opened
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            All vendors rejected counter-offer. Smart contract escrow is skipped to prevent wasted gas.
          </p>
        </div>
      ) : (
        <div>
          {/* Auction Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.65rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.65rem', background: 'var(--bg-recessed)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Target Vendor</span>
              <p className="font-viga" style={{ fontSize: '0.92rem', color: '#ffffff', marginTop: '0.1rem' }}>{order.selectedVendorName}</p>
            </div>
            <div style={{ padding: '0.65rem', background: 'var(--bg-recessed)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Escrow Cap</span>
              <p className="mono" style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.1rem' }}>{order.budgetAmount} USDC</p>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div style={{
              padding: '0.6rem 0.85rem', background: 'var(--danger-subtle)',
              border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-sm)',
              color: '#fca5a5', fontSize: '0.8rem', marginBottom: '1rem',
              display: 'flex', alignItems: 'flex-start', gap: '0.4rem',
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* IDLE State */}
          {status === 'IDLE' && (
            <button
              className="btn btn-primary"
              onClick={handleCreateArenaAuction}
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.9rem', borderRadius: 'var(--radius-sm)' }}
            >
              <Lock size={16} /> Open Arena Escrow ({order.budgetAmount} USDC)
            </button>
          )}

          {/* APPROVING / CREATING */}
          {(status === 'APPROVING' || status === 'CREATING') && (
            <div style={{
              padding: '0.85rem', background: 'var(--bg-recessed)',
              borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', textAlign: 'center',
            }}>
              <p style={{
                fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
              }}>
                <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} />
                {status === 'APPROVING' ? 'Approving USDC allowance in wallet…' : 'Creating Arena auction on Monad…'}
              </p>
            </div>
          )}

          {/* WAITING / READY / SETTLING */}
          {(status === 'WAITING_BIDS' || status === 'READY_SETTLE' || status === 'SETTLING') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                padding: '0.85rem', background: 'var(--bg-recessed)',
                borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span className="font-viga" style={{ fontSize: '0.85rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={14} color="var(--primary)" /> Auction #{auctionId ?? 0}
                  </span>
                  <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                    {timeLeft}s left
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {order.budgetAmount} USDC locked in smart contract. Vendor confirming on-chain bid…
                </p>

                {createTxHash && (
                  <a
                    href={`https://testnet.monadexplorer.com/tx/${createTxHash}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '0.72rem', color: 'var(--primary)',
                      display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                      marginTop: '0.4rem', textDecoration: 'underline',
                    }}
                  >
                    View create tx on Monad Explorer <ExternalLink size={11} />
                  </a>
                )}
              </div>

              {bidsReceived.length > 0 && (
                <div style={{
                  padding: '0.65rem', background: 'var(--bg-recessed)',
                  borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)',
                  fontSize: '0.78rem',
                }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Bids On-Chain Received:</span>
                  {bidsReceived.map((b, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                      <span>{b.vendorName}:</span>
                      <span className="mono" style={{ color: 'var(--primary)', fontWeight: 700 }}>{b.priceUsdc} USDC</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="btn btn-accent"
                onClick={handleSettleAuction}
                disabled={status === 'SETTLING'}
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.9rem', borderRadius: 'var(--radius-sm)' }}
              >
                <Zap size={16} />
                {status === 'SETTLING' ? 'Processing On-Chain Settlement…' : 'Settle Now (Pay Vendor & Auto Refund Change)'}
              </button>
            </div>
          )}

          {/* SETTLED */}
          {status === 'SETTLED' && (
            <div style={{
              padding: '0.85rem 1rem', background: 'var(--primary-subtle)',
              border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)',
            }}>
              <p className="font-viga" style={{ color: '#a594fd', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                <CheckCircle2 size={16} color="var(--primary)" /> Settlement Complete
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Vendor paid on-chain. Remaining savings auto-refunded to your wallet.
              </p>
              {settleTxHash && (
                <a
                  href={`https://testnet.monadexplorer.com/tx/${settleTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '0.72rem', color: '#a594fd',
                    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                    marginTop: '0.4rem', textDecoration: 'underline',
                  }}
                >
                  View settle tx on Monad Explorer <ExternalLink size={11} />
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
