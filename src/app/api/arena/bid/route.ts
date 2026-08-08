import { NextResponse } from 'next/server';
import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { NEGOSIASI_ARENA_ABI } from '@/lib/abi';

const MONAD_TESTNET_RPC = process.env.NEXT_PUBLIC_MONAD_RPC_URL || 'https://testnet-rpc.monad.xyz';
const ARENA_ADDRESS = (process.env.ARENA_ADDRESS || process.env.NEXT_PUBLIC_ARENA_ADDRESS) as `0x${string}`;

const monadTestnetChain = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: { default: { http: [MONAD_TESTNET_RPC] } },
};

const AGENT_KEYS: Record<string, string | undefined> = {
  vendor_a: process.env.AGENT_A_PK,
  vendor_b: process.env.AGENT_B_PK,
  vendor_c: process.env.AGENT_C_PK,
};

const VENDOR_NAMES: Record<string, string> = {
  vendor_a: 'TechStore A',
  vendor_b: 'ElectroHub B',
  vendor_c: 'DigitalMart C',
};

export async function POST(request: Request) {
  try {
    const { auctionId, orderId, vendorBids } = await request.json();

    if (auctionId === undefined || auctionId === null || !vendorBids) {
      return NextResponse.json({ error: 'Missing auctionId or vendorBids' }, { status: 400 });
    }

    if (!ARENA_ADDRESS) {
      return NextResponse.json({ error: 'ARENA_ADDRESS is not configured in env' }, { status: 500 });
    }

    const publicClient = createPublicClient({
      chain: monadTestnetChain,
      transport: http(MONAD_TESTNET_RPC),
    });

    // Filter accepted/selected vendors and sort bids DESCENDING to satisfy BidNotLower guardrail
    const eligibleBids: { vendorId: string; priceUsdc: number; priceUnits: bigint }[] = [];

    for (const item of vendorBids) {
      if (item.status === 'ACCEPTED' || item.status === 'SELECTED') {
        const priceUnits = BigInt(Math.round(item.finalPrice * 1e6));
        eligibleBids.push({
          vendorId: item.vendorId,
          priceUsdc: item.finalPrice,
          priceUnits,
        });
      }
    }

    // Sort DESCENDING so each subsequent bid is strictly LOWER than the previous
    eligibleBids.sort((a, b) => Number(b.priceUnits - a.priceUnits));

    // Ensure tie-breaker: subtract 1 unit per rank if prices are equal
    for (let i = 1; i < eligibleBids.length; i++) {
      if (eligibleBids[i].priceUnits >= eligibleBids[i - 1].priceUnits) {
        eligibleBids[i].priceUnits = eligibleBids[i - 1].priceUnits - BigInt(1);
      }
    }

    const submittedBidsResults: any[] = [];

    for (const bidInfo of eligibleBids) {
      const privateKey = AGENT_KEYS[bidInfo.vendorId];
      if (!privateKey) {
        console.warn(`No private key found for vendor ${bidInfo.vendorId}`);
        continue;
      }

      const formattedKey = (privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`) as `0x${string}`;
      const account = privateKeyToAccount(formattedKey);

      const walletClient = createWalletClient({
        account,
        chain: monadTestnetChain,
        transport: http(MONAD_TESTNET_RPC),
      });

      try {
        const txHash = await walletClient.writeContract({
          address: ARENA_ADDRESS,
          abi: NEGOSIASI_ARENA_ABI,
          functionName: 'submitBid',
          args: [BigInt(auctionId), bidInfo.priceUnits],
        });

        submittedBidsResults.push({
          vendorId: bidInfo.vendorId,
          vendorName: VENDOR_NAMES[bidInfo.vendorId] || bidInfo.vendorId,
          agentAddress: account.address,
          priceUsdc: bidInfo.priceUsdc,
          txHash,
        });

        // Delay ~1.5s between sequential bids
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (err: any) {
        console.error(`Failed to submit bid for vendor ${bidInfo.vendorId}:`, err);
        submittedBidsResults.push({
          vendorId: bidInfo.vendorId,
          vendorName: VENDOR_NAMES[bidInfo.vendorId] || bidInfo.vendorId,
          error: err?.message || 'Bid rejected by smart contract',
        });
      }
    }

    return NextResponse.json({
      success: true,
      auctionId,
      results: submittedBidsResults,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to process on-chain agent bidding' },
      { status: 500 }
    );
  }
}
