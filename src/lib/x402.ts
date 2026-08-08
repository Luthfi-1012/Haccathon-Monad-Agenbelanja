import { Order } from '../types/negotiation';

export async function processX402Payment(
  orderId: string,
  simulateFailure = false
): Promise<Order> {
  // Step 1: Initial request to confirm endpoint (triggers HTTP 402 Payment Required flow)
  const initialRes = await fetch(`/api/orders/${orderId}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ simulateFailure }),
  });

  if (initialRes.status === 402) {
    const paymentReq = await initialRes.json();
    console.log('[x402 Protocol Header Received]:', paymentReq);

    // Step 2: Payment Authorization step (Sending payment proof or demo mode authorization)
    const confirmRes = await fetch(`/api/orders/${orderId}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer x402_auth_token_${Date.now()}`,
      },
      body: JSON.stringify({
        demoAuth: true,
        orderId,
        simulateFailure,
      }),
    });

    if (!confirmRes.ok) {
      const errData = await confirmRes.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to process x402 payment authorization.');
    }

    return await confirmRes.json();
  }

  if (!initialRes.ok) {
    const errData = await initialRes.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to process settlement.');
  }

  return await initialRes.json();
}
