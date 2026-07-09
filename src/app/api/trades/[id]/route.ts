import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Trade } from "@/types";

function toRowUpdates(updates: Partial<Trade>) {
  const row: Record<string, unknown> = {};
  if (updates.date !== undefined) row.date = updates.date;
  if (updates.pair !== undefined) row.pair = updates.pair;
  if (updates.session !== undefined) row.session = updates.session;
  if (updates.direction !== undefined) row.direction = updates.direction;
  if (updates.entry !== undefined) row.entry = updates.entry;
  if (updates.exit !== undefined) row.exit = updates.exit;
  if (updates.stopLoss !== undefined) row.stop_loss = updates.stopLoss;
  if (updates.takeProfit !== undefined) row.take_profit = updates.takeProfit;
  if (updates.lotSize !== undefined) row.lot_size = updates.lotSize;
  if (updates.pips !== undefined) row.pips = updates.pips;
  if (updates.riskPct !== undefined) row.risk_pct = updates.riskPct;
  if (updates.rr !== undefined) row.rr = updates.rr;
  if (updates.pnl !== undefined) row.pnl = updates.pnl;
  if (updates.status !== undefined) row.status = updates.status;
  if (updates.strategy !== undefined) row.strategy = updates.strategy;
  if (updates.emotion !== undefined) row.emotion = updates.emotion;
  if (updates.notes !== undefined) row.notes = updates.notes;
  if (updates.screenshotName !== undefined) row.screenshot_name = updates.screenshotName;
  if (updates.checklist !== undefined) row.checklist = updates.checklist;
  if (updates.checklistPct !== undefined) row.checklist_pct = updates.checklistPct;
  return row;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const updates = (await req.json()) as Partial<Trade>;

  const { data, error } = await supabase
    .from("trades")
    .update(toRowUpdates(updates))
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ trade: data });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { error } = await supabase.from("trades").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
