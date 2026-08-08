export type OrderStatus =
  | 'DRAFT'
  | 'NEGOTIATING'
  | 'NEGOTIATION_COMPLETE'
  | 'NO_DEAL'
  | 'PAYMENT_REQUIRED'
  | 'PAYMENT_PROCESSING'
  | 'SETTLEMENT_SUCCESS'
  | 'SETTLEMENT_FAILED';

export type VendorStatus =
  | 'WAITING'
  | 'QUOTED'
  | 'NEGOTIATING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'SELECTED';

export type VendorId = 'vendor_a' | 'vendor_b' | 'vendor_c';

export type Vendor = {
  vendorId: VendorId;
  vendorName: string;
  initialPrice: number;
  floorPrice: number;
  status?: VendorStatus;
  currentOffer?: number;
};

export type NegotiationEventType =
  | 'QUOTE_REQUEST'
  | 'QUOTE_RECEIVED'
  | 'COUNTER_OFFER'
  | 'VENDOR_RESPONSE'
  | 'VENDOR_SELECTED'
  | 'NO_DEAL'
  | 'PAYMENT_REQUIRED'
  | 'SETTLEMENT_SUCCESS'
  | 'SETTLEMENT_FAILED';

export type NegotiationEvent = {
  eventId: string;
  sequenceNumber: number;
  timestamp: string;
  actor: 'agent' | VendorId | 'system';
  eventType: NegotiationEventType;
  message: string;
  amount?: number;
};

export type Order = {
  orderId: string;
  itemDescription: string;
  budgetAmount: number;
  status: OrderStatus;
  scenarioId?: 'scenario_1' | 'scenario_2' | 'scenario_3';
  selectedVendorId?: VendorId;
  selectedVendorName?: string;
  initialPrice?: number;
  finalPrice?: number;
  savings?: number;
  vendors?: Record<VendorId, VendorStatus & { initialPrice: number; currentOffer?: number }>;
  timeline: NegotiationEvent[];
  transactionReference?: string;
  errorMessage?: string;
};
