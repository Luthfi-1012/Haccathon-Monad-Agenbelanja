import { Vendor, VendorId } from '../types/negotiation';

export type ScenarioPreset = 'scenario_1' | 'scenario_2' | 'scenario_3';

export const SEED_VENDORS: Record<ScenarioPreset, Record<VendorId, Vendor>> = {
  scenario_1: {
    vendor_a: {
      vendorId: 'vendor_a',
      vendorName: 'TechStore A',
      initialPrice: 48,
      floorPrice: 45,
    },
    vendor_b: {
      vendorId: 'vendor_b',
      vendorName: 'ElectroHub B',
      initialPrice: 55,
      floorPrice: 50,
    },
    vendor_c: {
      vendorId: 'vendor_c',
      vendorName: 'DigitalMart C',
      initialPrice: 62,
      floorPrice: 56,
    },
  },
  scenario_2: {
    vendor_a: {
      vendorId: 'vendor_a',
      vendorName: 'TechStore A',
      initialPrice: 58,
      floorPrice: 52,
    },
    vendor_b: {
      vendorId: 'vendor_b',
      vendorName: 'ElectroHub B',
      initialPrice: 60,
      floorPrice: 49,
    },
    vendor_c: {
      vendorId: 'vendor_c',
      vendorName: 'DigitalMart C',
      initialPrice: 64,
      floorPrice: 57,
    },
  },
  scenario_3: {
    vendor_a: {
      vendorId: 'vendor_a',
      vendorName: 'TechStore A',
      initialPrice: 48,
      floorPrice: 42,
    },
    vendor_b: {
      vendorId: 'vendor_b',
      vendorName: 'ElectroHub B',
      initialPrice: 45,
      floorPrice: 40,
    },
    vendor_c: {
      vendorId: 'vendor_c',
      vendorName: 'DigitalMart C',
      initialPrice: 52,
      floorPrice: 45,
    },
  },
};

/**
 * Dynamically scales vendor initial quotes and secret floor prices relative to the user's input budget.
 * Ensures ANY custom budget input (e.g. 5, 20, 35, 100 USDC) behaves realistically according to the scenario preset.
 */
export function getScaledVendorsForScenario(
  scenarioId: ScenarioPreset = 'scenario_2',
  budgetAmount: number = 50
): Record<VendorId, Vendor> {
  const b = budgetAmount;

  if (scenarioId === 'scenario_1') {
    return {
      vendor_a: {
        vendorId: 'vendor_a',
        vendorName: 'TechStore A',
        initialPrice: Math.max(1, Math.round(b * 0.95)),
        floorPrice: Math.max(1, Math.round(b * 0.88)),
      },
      vendor_b: {
        vendorId: 'vendor_b',
        vendorName: 'ElectroHub B',
        initialPrice: Math.max(1, Math.round(b * 1.10)),
        floorPrice: Math.max(1, Math.round(b * 0.98)),
      },
      vendor_c: {
        vendorId: 'vendor_c',
        vendorName: 'DigitalMart C',
        initialPrice: Math.max(1, Math.round(b * 1.25)),
        floorPrice: Math.max(1, Math.round(b * 1.10)),
      },
    };
  }

  if (scenarioId === 'scenario_2') {
    return {
      vendor_a: {
        vendorId: 'vendor_a',
        vendorName: 'TechStore A',
        initialPrice: Math.max(1, Math.round(b * 1.16)),
        floorPrice: Math.max(1, Math.round(b * 1.04)),
      },
      vendor_b: {
        vendorId: 'vendor_b',
        vendorName: 'ElectroHub B',
        initialPrice: Math.max(1, Math.round(b * 1.20)),
        floorPrice: Math.max(1, Math.floor(b * 0.96)),
      },
      vendor_c: {
        vendorId: 'vendor_c',
        vendorName: 'DigitalMart C',
        initialPrice: Math.max(1, Math.round(b * 1.28)),
        floorPrice: Math.max(1, Math.round(b * 1.14)),
      },
    };
  }

  // scenario_3: No Deal
  return {
    vendor_a: {
      vendorId: 'vendor_a',
      vendorName: 'TechStore A',
      initialPrice: Math.max(1, Math.round(b * 1.25)),
      floorPrice: Math.max(1, Math.round(b * 1.12)),
    },
    vendor_b: {
      vendorId: 'vendor_b',
      vendorName: 'ElectroHub B',
      initialPrice: Math.max(1, Math.round(b * 1.30)),
      floorPrice: Math.max(1, Math.round(b * 1.18)),
    },
    vendor_c: {
      vendorId: 'vendor_c',
      vendorName: 'DigitalMart C',
      initialPrice: Math.max(1, Math.round(b * 1.35)),
      floorPrice: Math.max(1, Math.round(b * 1.22)),
    },
  };
}

/**
 * Simulates requesting an initial quote from a vendor.
 * Runs asynchronously to simulate parallel network call.
 */
export async function requestVendorQuote(
  vendor: Vendor,
  itemDescription: string
): Promise<{ vendorId: VendorId; initialPrice: number; latencyMs: number }> {
  const latencyMs = Math.floor(Math.random() * 50) + 30;
  await new Promise((resolve) => setTimeout(resolve, latencyMs));

  return {
    vendorId: vendor.vendorId,
    initialPrice: vendor.initialPrice,
    latencyMs,
  };
}

/**
 * Simulates evaluating a counter-offer by a vendor.
 * Accepts if counterOffer >= floorPrice.
 */
export async function respondToCounterOffer(
  vendor: Vendor,
  counterOffer: number
): Promise<{ vendorId: VendorId; accepted: boolean; finalPrice?: number; latencyMs: number }> {
  const latencyMs = Math.floor(Math.random() * 50) + 30;
  await new Promise((resolve) => setTimeout(resolve, latencyMs));

  const accepted = counterOffer >= vendor.floorPrice;

  return {
    vendorId: vendor.vendorId,
    accepted,
    finalPrice: accepted ? counterOffer : undefined,
    latencyMs,
  };
}
