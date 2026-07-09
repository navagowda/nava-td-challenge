import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Trade } from "@/types";

interface TradeRow {
  id: string;
  date: string;
  pair: string;
  session: string;
  direction: string;
  entry: number;
  exit: number | null;
  stop_loss: number;
  take_profit: number;
  lot_size: number;
  pips: number | null;
  risk_pct: number;
  rr: number;
  pnl: number | null;
  status: string;
  strategy: string;
  emotion: string;
  notes: string;
  screenshot_name: string | null;
  checklist: Record<string, boolean> | null;
  checklist_pct: number | null;
}

function rowToTrade(row: TradeRow): Trade {
  return {
    id: row.id,
    date: row.date,
    pair: row.pair,
    session: row.session as Trade["session"],
    direction: row.direction as Trade["direction"],
    entry: Number(row.entry),
    exit: row.exit === null ? null : Number(row.exit),
    stopLoss: Number(row.stop_loss),
    takeProfit: Number(row.take_profit),
    lotSize: Number(row.lot_size),
    pips: row.pips === null ? null : Number(row.pips),
    riskPct: Number(row.risk_pct),
    rr: Number(row.rr),
    pnl: row.pnl === null ? null : Number(row.pnl),
    status: row.status as Trade["status"],
    strategy: row.strategy,
    emotion: row.emotion as Trade["emotion"],
    notes: row.notes,
    screenshotName: row.screenshot_name ?? undefined,
    checklist: row.checklist ?? undefined,
    checklistPct: row.checklist_pct === null ? undefined : Number(row.checklist_pct),
  };
}

function tradeToRow(trade: Trade) {
  return {
    id: trade.id,
    date: trade.date,
    pair: trade.pair,
    session: trade.session,
    direction: trade.direction,
    entry: trade.entry,
    exit: trade.exit,
    stop_loss: trade.stopLoss,
    take_profit: trade.takeProfit,
    lot_size: trade.lotSize,
    pips: trade.pips,
    risk_pct: trade.riskPct,
    rr: trade.rr,
    pnl: trade.pnl,
    status: trade.status,
    strategy: trade.strategy,
    emotion: trade.emotion,
    notes: trade.notes,
    screenshot_name: trade.screenshotName ?? null,
    checklist: trade.checklist ?? null,
    checklist_pct: trade.checklistPct ?? null,
  };
}

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ trades: (data ?? []).map(rowToTrade) });
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const trade = (await req.json()) as Trade;

  const { error } = await supabase.from("trades").insert(tradeToRow(trade));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ trade }, { status: 201 });
}
