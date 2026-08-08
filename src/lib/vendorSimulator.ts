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
