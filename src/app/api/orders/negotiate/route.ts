import { NextResponse } from 'next/server';
import { runNegotiationOrchestrator, getSeedVendorsForScenario } from '@/lib/ruleEngine';
import { saveOrder } from '@/lib/orderStore';
import { ScenarioPreset } from '@/lib/vendorSimulator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemDescription, budgetAmount, scenarioId } = body;

    if (!itemDescription || typeof itemDescription !== 'string') {
      return NextResponse.json(
        { error: 'itemDescription wajib diisi' },
        { status: 400 }
      );
    }

    if (!budgetAmount || typeof budgetAmount !== 'number' || budgetAmount <= 0) {
      return NextResponse.json(
        { error: 'budgetAmount harus berupa angka positif' },
        { status: 400 }
      );
    }

    const scenario: ScenarioPreset = (scenarioId as ScenarioPreset) || 'scenario_2';
    const seedVendors = getSeedVendorsForScenario(scenario);
    const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const order = await runNegotiationOrchestrator(
      orderId,
      itemDescription.trim(),
      budgetAmount,
      seedVendors
    );

    order.scenarioId = scenario;
    saveOrder(order);

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Terjadi kesalahan saat negosiasi' },
      { status: 500 }
    );
  }
}
