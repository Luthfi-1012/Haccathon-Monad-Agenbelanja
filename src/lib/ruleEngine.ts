import {
  Order,
  Vendor,
  VendorId,
  NegotiationEvent,
  VendorStatus,
} from '../types/negotiation';
import {
  SEED_VENDORS,
  ScenarioPreset,
  getScaledVendorsForScenario,
  requestVendorQuote,
  respondToCounterOffer,
} from './vendorSimulator';

export function getSeedVendorsForScenario(
  scenarioId: ScenarioPreset = 'scenario_2',
  budgetAmount?: number
): Record<VendorId, Vendor> {
  if (budgetAmount && budgetAmount > 0) {
    return getScaledVendorsForScenario(scenarioId, budgetAmount);
  }
  return JSON.parse(JSON.stringify(SEED_VENDORS[scenarioId]));
}

/**
 * Core Negotiation Orchestrator
 * Pure deterministic rule engine executing parallel quote requests & counter-offers.
 */
export async function runNegotiationOrchestrator(
  orderId: string,
  itemDescription: string,
  budgetAmount: number,
  vendorsMap: Record<VendorId, Vendor>
): Promise<Order> {
  const vendorsList = Object.values(vendorsMap);
  const timeline: NegotiationEvent[] = [];
  let seq = 1;

  const addEvent = (
    actor: NegotiationEvent['actor'],
    eventType: NegotiationEvent['eventType'],
    message: string,
    amount?: number
  ) => {
    timeline.push({
      eventId: `evt_${seq}_${Date.now()}`,
      sequenceNumber: seq++,
      timestamp: new Date().toISOString(),
      actor,
      eventType,
      message,
      amount,
    });
  };

  addEvent(
    'system',
    'QUOTE_REQUEST',
    `Starting parallel quote search for "${itemDescription}" with budget cap of ${budgetAmount} USDC`
  );

  const vendorStates: Record<VendorId, VendorStatus & { initialPrice: number; currentOffer?: number }> = {
    vendor_a: 'WAITING' as VendorStatus,
    vendor_b: 'WAITING' as VendorStatus,
    vendor_c: 'WAITING' as VendorStatus,
  } as any;

  // Step 1: Parallel initial quote requests
  const quotePromises = vendorsList.map((vendor) => {
    addEvent(
      vendor.vendorId,
      'QUOTE_REQUEST',
      `Sending quote request to ${vendor.vendorName}`
    );
    return requestVendorQuote(vendor, itemDescription);
  });

  const quoteResults = await Promise.all(quotePromises);

  for (const res of quoteResults) {
    const v = vendorsMap[res.vendorId];
    addEvent(
      res.vendorId,
      'QUOTE_RECEIVED',
      `${v.vendorName} quoted initial price of ${res.initialPrice} USDC`,
      res.initialPrice
    );
    (vendorStates as any)[res.vendorId] = 'QUOTED';
  }

  // Step 2: Evaluate initial prices against budget
  const eligibleInitialOffers = quoteResults.filter((r) => r.initialPrice <= budgetAmount);

  if (eligibleInitialOffers.length > 0) {
    // Sort by price ascending, then alphabetical vendorId
    eligibleInitialOffers.sort((a, b) => {
      if (a.initialPrice !== b.initialPrice) {
        return a.initialPrice - b.initialPrice;
      }
      return a.vendorId.localeCompare(b.vendorId);
    });

    const winningOffer = eligibleInitialOffers[0];
    const winningVendor = vendorsMap[winningOffer.vendorId];
    const savings = Math.max(0, budgetAmount - winningOffer.initialPrice);

    addEvent(
      'agent',
      'VENDOR_SELECTED',
      `AgenBelanja selected ${winningVendor.vendorName} at initial quote of ${winningOffer.initialPrice} USDC (within budget). Savings: ${savings} USDC.`,
      winningOffer.initialPrice
    );

    (vendorStates as any)[winningOffer.vendorId] = 'SELECTED';

    return {
      orderId,
      itemDescription,
      budgetAmount,
      status: 'NEGOTIATION_COMPLETE',
      selectedVendorId: winningOffer.vendorId,
      selectedVendorName: winningVendor.vendorName,
      initialPrice: winningOffer.initialPrice,
      finalPrice: winningOffer.initialPrice,
      savings,
      vendors: vendorStates as any,
      timeline,
    };
  }

  // Step 3: Initial prices exceed budget -> Send counter-offer = budget to all vendors in parallel
  // Guardrail: counter-offer amount MUST strictly equal budgetAmount (never > budget)
  const counterOfferAmount = budgetAmount;

  addEvent(
    'agent',
    'COUNTER_OFFER',
    `All initial quotes exceed budget (${budgetAmount} USDC). AgenBelanja sending parallel counter-offer of ${counterOfferAmount} USDC to all vendors.`,
    counterOfferAmount
  );

  const counterOfferPromises = vendorsList.map((vendor) => {
    (vendorStates as any)[vendor.vendorId] = 'NEGOTIATING';
    return respondToCounterOffer(vendor, counterOfferAmount);
  });

  const counterOfferResults = await Promise.all(counterOfferPromises);

  const acceptedVendors: { vendorId: VendorId; finalPrice: number }[] = [];

  for (const res of counterOfferResults) {
    const v = vendorsMap[res.vendorId];
    if (res.accepted && res.finalPrice !== undefined) {
      addEvent(
        res.vendorId,
        'VENDOR_RESPONSE',
        `${v.vendorName} ACCEPTED counter-offer of ${res.finalPrice} USDC`,
        res.finalPrice
      );
      (vendorStates as any)[res.vendorId] = 'ACCEPTED';
      acceptedVendors.push({ vendorId: res.vendorId, finalPrice: res.finalPrice });
    } else {
      addEvent(
        res.vendorId,
        'VENDOR_RESPONSE',
        `${v.vendorName} REJECTED counter-offer of ${counterOfferAmount} USDC`
      );
      (vendorStates as any)[res.vendorId] = 'REJECTED';
    }
  }

  // Step 4: Pick winning vendor from accepted counter-offers
  if (acceptedVendors.length > 0) {
    acceptedVendors.sort((a, b) => {
      if (a.finalPrice !== b.finalPrice) {
        return a.finalPrice - b.finalPrice;
      }
      return a.vendorId.localeCompare(b.vendorId);
    });

    const winning = acceptedVendors[0];
    const winningVendor = vendorsMap[winning.vendorId];
    const savings = Math.max(0, budgetAmount - winning.finalPrice);

    addEvent(
      'agent',
      'VENDOR_SELECTED',
      `Negotiation successful! AgenBelanja selected ${winningVendor.vendorName} at agreed price of ${winning.finalPrice} USDC.`,
      winning.finalPrice
    );

    (vendorStates as any)[winning.vendorId] = 'SELECTED';

    return {
      orderId,
      itemDescription,
      budgetAmount,
      status: 'NEGOTIATION_COMPLETE',
      selectedVendorId: winning.vendorId,
      selectedVendorName: winningVendor.vendorName,
      initialPrice: winningVendor.initialPrice,
      finalPrice: winning.finalPrice,
      savings,
      vendors: vendorStates as any,
      timeline,
    };
  }

  // Step 5: All vendors rejected
  addEvent(
    'system',
    'NO_DEAL',
    `All vendors rejected counter-offer of ${counterOfferAmount} USDC. No deal reached (NO_DEAL).`
  );

  return {
    orderId,
    itemDescription,
    budgetAmount,
    status: 'NO_DEAL',
    vendors: vendorStates as any,
    timeline,
  };
}
