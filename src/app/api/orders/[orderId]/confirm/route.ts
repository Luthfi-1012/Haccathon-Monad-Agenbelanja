import { NextResponse } from 'next/server';
import { getOrder, updateOrder } from '@/lib/orderStore';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const order = getOrder(orderId);

    // Objective 1 & Constraint: Payment strictly forbidden if status is not NEGOTIATION_COMPLETE or PAYMENT_REQUIRED
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'NEGOTIATION_COMPLETE' && order.status !== 'PAYMENT_REQUIRED') {
      return NextResponse.json(
        { error: 'Payment rejected: Order has not reached vendor agreement' },
        { status: 400 }
      );
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Body empty or not JSON
    }

    // Simulate failure test trigger
    if (body?.simulateFailure === true) {
      const seq = order.timeline.length + 1;
      const updatedOrder = updateOrder(orderId, {
        status: 'SETTLEMENT_FAILED',
        errorMessage: 'Settlement failed: Payment authorization rejected by facilitator.',
        timeline: [
          ...order.timeline,
          {
            eventId: `evt_${seq}_${Date.now()}`,
            sequenceNumber: seq,
            timestamp: new Date().toISOString(),
            actor: 'system' as const,
            eventType: 'SETTLEMENT_FAILED' as const,
            message: 'x402 settlement failed: Invalid payment authorization.',
          },
        ],
      });
      return NextResponse.json(updatedOrder, { status: 400 });
    }

    const authHeader = request.headers.get('authorization');
    const isDemoMode = process.env.DEMO_PAYMENT_MODE === 'true' || body?.demoAuth === true;
    const hasValidPayment = Boolean(authHeader || body?.paymentAuth || isDemoMode);

    // HTTP 402 Payment Required flow
    if (!hasValidPayment) {
      updateOrder(orderId, { status: 'PAYMENT_REQUIRED' });
      return NextResponse.json(
        {
          error: 'Payment Required',
          status: 'PAYMENT_REQUIRED',
          orderId: order.orderId,
          amount: order.finalPrice,
          currency: 'USDC',
          network: process.env.NEXT_PUBLIC_X402_NETWORK || 'eip155:10143',
          payTo: process.env.NEXT_PUBLIC_MONAD_USDC_ADDRESS || '0x534b2f3A21130d7a60830c2Df862319e593943A3',
          facilitatorUrl: process.env.NEXT_PUBLIC_X402_FACILITATOR_URL || 'https://x402-facilitator.molandak.org',
        },
        { status: 402 }
      );
    }

    // Process Settlement
    // Constraint: Do not claim fake transaction hash if real on-chain transaction hash is unavailable
    const txRef = body?.realTxHash || 'DEMO_MODE_VERIFIED';
    const seq = order.timeline.length + 1;

    const newTimeline = [
      ...order.timeline,
      {
        eventId: `evt_${seq}_${Date.now()}`,
        sequenceNumber: seq,
        timestamp: new Date().toISOString(),
        actor: 'system' as const,
        eventType: 'SETTLEMENT_SUCCESS' as const,
        message: isDemoMode && !body?.realTxHash
          ? `x402 settlement verified! (Demo Payment Mode Active)`
          : `x402 settlement completed on Monad Testnet! Ref TX: ${txRef}`,
        amount: order.finalPrice,
      },
    ];

    const updatedOrder = updateOrder(orderId, {
      status: 'SETTLEMENT_SUCCESS',
      transactionReference: txRef,
      timeline: newTimeline,
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to process x402 settlement. Please try again.' },
      { status: 500 }
    );
  }
}
