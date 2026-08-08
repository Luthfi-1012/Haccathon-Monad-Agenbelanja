'use client';

import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, ShieldAlert, ExternalLink, Zap, Clock, Lock, RefreshCw, AlertCircle } from 'lucide-react';
import { Order } from '../types/negotiation';
import { useWallet } from '@/context/WalletContext';
import { createWalletClient, createPublicClient, custom, http, keccak256, toHex } from 'viem';
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
      setErrorMsg('Alamat smart contract ARENA_ADDRESS belum di-deploy di .env');
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
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
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

      // Retrieve new auction ID from log or contract nextAuctionId - 1
      const nextId = await publicClient.readContract({
        address: ARENA_ADDRESS,
        abi: NEGOSIASI_ARENA_ABI,
        functionName: 'nextAuctionId',
      });
      const currentAuctionId = Number(nextId) - 1;
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
        setErrorMsg('Transaksi dibatalkan oleh pengguna.');
      } else {
        setErrorMsg(err?.message || 'Gagal membuka lelang Arena On-Chain.');
      }
      setStatus('IDLE');
    }
  };

  const handleSettleAuction = async () => {
    if (auctionId === null) return;
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
      await publicClient.waitForTransactionReceipt({ hash });

      setStatus('SETTLED');
    } catch (err: any) {
      console.error('Error settling auction:', err);
      setErrorMsg(err?.message || 'Gagal mengeksekusi settlement on-chain.');
      setStatus('READY_SETTLE');
    }
  };

  return (
    <div className="glass-card mb-6" style={{ padding: '1.25rem', border: '1px solid var(--primary-accent)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
          <Lock size={16} color="var(--primary-accent)" /> Mode Arena On-Chain ⚡
        </h3>
        <span className="badge badge-quoted" style={{ fontSize: '0.68rem' }}>
          Monad Escrow Protocol
        </span>
      </div>

      {isNoDeal ? (
        <div style={{ padding: '1rem', background: 'var(--danger-red-subtle)', borderRadius: '0.375rem', color: '#fca5a5' }}>
          <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldAlert size={16} /> Arena Tidak Dibuka (No Deal)
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Seluruh vendor menolak penawaran. Arena lelang tidak dapat dibuka untuk mencegah pemborosan gas fee.
          </p>
        </div>
      ) : (
        <div>
          {/* Auction Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.65rem', background: '#090a0f', borderRadius: '0.375rem', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Target Vendor:</span>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{order.selectedVendorName}</p>
            </div>
            <div style={{ padding: '0.65rem', background: '#090a0f', borderRadius: '0.375rem', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Budget Escrow Cap:</span>
              <p className="mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-accent)' }}>{order.budgetAmount} USDC</p>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div style={{ padding: '0.65rem', background: 'var(--danger-red-subtle)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.375rem', color: '#fca5a5', fontSize: '0.8rem', marginBottom: '0.85rem' }}>
              <AlertCircle size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> {errorMsg}
            </div>
          )}

          {/* Status Controls */}
          {status === 'IDLE' && (
            <button
              className="btn btn-primary"
              onClick={handleCreateArenaAuction}
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.9rem' }}
            >
              <Lock size={16} /> Bayar via Arena On-Chain 🔒 ({order.budgetAmount} USDC Escrow)
            </button>
          )}

          {(status === 'APPROVING' || status === 'CREATING') && (
            <div style={{ padding: '0.85rem', background: '#090a0f', borderRadius: '0.375rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} />
                {status === 'APPROVING' ? 'Setujui Allowance USDC di Wallet...' : 'Membuka Lelang Arena On-Chain di Monad...'}
              </p>
            </div>
          )}

          {(status === 'WAITING_BIDS' || status === 'READY_SETTLE' || status === 'SETTLING') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.85rem', background: '#090a0f', borderRadius: '0.375rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={14} color="var(--primary-accent)" /> Arena Lelang Aktif (ID #{auctionId})
                  </span>
                  <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--primary-accent)' }}>
                    Waktu Sisa: {timeLeft}s
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Budget {order.budgetAmount} USDC berhasil dikunci di smart contract. Vendor mengonfirmasi penawaran di-chain...
                </p>

                {createTxHash && (
                  <a
                    href={`https://testnet.monadexplorer.com/tx/${createTxHash}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '0.72rem', color: 'var(--primary-accent)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.4rem', textDecoration: 'underline' }}
                  >
                    View Create Tx on Monad Explorer <ExternalLink size={11} />
                  </a>
                )}
              </div>

              {bidsReceived.length > 0 && (
                <div style={{ padding: '0.65rem', background: '#090a0f', borderRadius: '0.375rem', border: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Bids On-Chain Diterima:</span>
                  {bidsReceived.map((b, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                      <span>{b.vendorName}:</span>
                      <span className="mono" style={{ color: 'var(--success-green)' }}>{b.priceUsdc} USDC</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="btn btn-accent"
                onClick={handleSettleAuction}
                disabled={status === 'SETTLING'}
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.85rem' }}
              >
                <Zap size={16} /> Settle Arena Sekarang (Bayar Vendor & Auto Refund Kembalian)
              </button>
            </div>
          )}

          {status === 'SETTLED' && (
            <div style={{ padding: '0.85rem', background: 'var(--success-green-subtle)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '0.375rem' }}>
              <p style={{ fontWeight: 700, color: '#6ee7b7', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.3rem' }}>
                <CheckCircle2 size={16} /> Settlement Arena On-Chain Selesai!
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Vendor pemenang telah dibayar dan sisa hemat dikembalikan otomatis ke dompet Anda.
              </p>
              {settleTxHash && (
                <a
                  href={`https://testnet.monadexplorer.com/tx/${settleTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.72rem', color: 'var(--success-green)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', textDecoration: 'underline' }}
                >
                  View Settle Tx on Monad Explorer <ExternalLink size={11} />
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
