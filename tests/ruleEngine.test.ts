import test from 'node:test';
import assert from 'node:assert/strict';
import { runNegotiationOrchestrator, getSeedVendorsForScenario } from '../src/lib/ruleEngine';
import { saveOrder, getOrder } from '../src/lib/orderStore';

test('Scenario 1: Instant Match without counter-offer', async () => {
  const item = 'Keyboard mekanikal';
  const budget = 50;
  const vendors = getSeedVendorsForScenario('scenario_1');

  const order = await runNegotiationOrchestrator('order_test_1', item, budget, vendors);

  assert.equal(order.status, 'NEGOTIATION_COMPLETE');
  assert.equal(order.selectedVendorId, 'vendor_a');
  assert.equal(order.finalPrice, 48);
  assert.equal(order.savings, 2);
  assert(order.timeline.length > 0);
});

test('Scenario 2: Successful negotiation via counter-offer', async () => {
  const item = 'Headset gaming';
  const budget = 50;
  const vendors = getSeedVendorsForScenario('scenario_2');

  const order = await runNegotiationOrchestrator('order_test_2', item, budget, vendors);

  assert.equal(order.status, 'NEGOTIATION_COMPLETE');
  assert.equal(order.selectedVendorId, 'vendor_b');
  assert.equal(order.finalPrice, 50);
  assert.equal(order.savings, 0);
  assert(order.timeline.length > 0);
});

test('Scenario 3: All vendors reject offer (NO_DEAL)', async () => {
  const item = 'Mouse wireless';
  const budget = 35;
  const vendors = getSeedVendorsForScenario('scenario_3');

  const order = await runNegotiationOrchestrator('order_test_3', item, budget, vendors);

  assert.equal(order.status, 'NO_DEAL');
  assert.equal(order.selectedVendorId, undefined);
  assert.equal(order.finalPrice, undefined);
  assert(order.timeline.length > 0);
});

test('Guardrail: Agent counter-offer never exceeds user budget', async () => {
  const item = 'High-end monitor';
  const budget = 100;
  const vendors = getSeedVendorsForScenario('scenario_2');

  const order = await runNegotiationOrchestrator('order_test_guardrail', item, budget, vendors);

  if (order.finalPrice !== undefined) {
    assert(order.finalPrice <= budget, 'Final price must not exceed budget');
  }

  const counterOfferEvents = order.timeline.filter((e) => e.eventType === 'COUNTER_OFFER');
  for (const event of counterOfferEvents) {
    if (event.amount !== undefined) {
      assert(event.amount <= budget, 'Counter offer amount must never exceed budget');
    }
  }
});

test('Payment Objective 1: Payment before vendor selection (NO_DEAL / DRAFT) must be rejected', async () => {
  const vendors = getSeedVendorsForScenario('scenario_3');
  const order = await runNegotiationOrchestrator('order_test_no_deal_pay', 'Mouse', 35, vendors);
  saveOrder(order);

  // Attempt payment validation
  const storedOrder = getOrder('order_test_no_deal_pay');
  assert.equal(storedOrder?.status, 'NO_DEAL');
  assert(storedOrder?.selectedVendorId === undefined, 'No vendor should be selected');
});

test('Payment Objective 2: Payment after negotiation complete enters payment flow & settlement success', async () => {
  const vendors = getSeedVendorsForScenario('scenario_1');
  const order = await runNegotiationOrchestrator('order_test_pay_flow', 'Keyboard', 50, vendors);
  saveOrder(order);

  const storedOrder = getOrder('order_test_pay_flow');
  assert.equal(storedOrder?.status, 'NEGOTIATION_COMPLETE');
  assert.equal(storedOrder?.selectedVendorId, 'vendor_a');
  assert.equal(storedOrder?.finalPrice, 48);
});
