import { Order } from '../types/negotiation';

// In-memory store for demo session orders
const ordersMap = new Map<string, Order>();

export function saveOrder(order: Order): void {
  ordersMap.set(order.orderId, order);
}

export function getOrder(orderId: string): Order | undefined {
  return ordersMap.get(orderId);
}

export function updateOrder(orderId: string, partial: Partial<Order>): Order | undefined {
  const existing = ordersMap.get(orderId);
  if (!existing) return undefined;
  const updated = { ...existing, ...partial };
  ordersMap.set(orderId, updated);
  return updated;
}
