import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { calcPips } from "@/lib/utils";
import type { ForexSession } from "@/types";

type PositionPayload = {
  ticket: number;
  symbol: string;
  direction: "long" | "short";
  volume: number;
  openPrice: number;
  currentPrice: number;
  stopLoss: number;
  takeProfit: number;
  floatingPnl: number;
  openTime: string;
};

type ClosedTradePayload = {
  dealTicket: number;
  positionId: number;
  symbol: string;
  direction: "long" | "short";
  entry: number;
  exit: number;
  stopLoss: number;
  takeProfit: number;
  lotSize: number;
  pnl: number;
  closeTime: string;
};

type SyncPayload = {
  account: {
    login: number;
    server: string;
    broker: string;
    name: string;
    currency: string;
    leverage: number;
    balance: number;
    equity: number;
    margin: number;
    freeMargin: number;
    marginLevel: number;
    floatingPnl: number;
  };
  positions?: PositionPayload[];
  closedTrades?: ClosedTradePayload[];
};

function normalizePair(symbol: string): string {
  const letters = symbol.replace(/[^A-Za-z]/g, "").toUpperCase();
  if (letters.length < 6) return symbol.toUpperCase();
  return `${letters.slice(0, 3)}/${letters.slice(3, 6)}`;
}

function parseMt5Date(value: string): Date {
  const parsed = new Date(value.replace(/\./g, "-").replace(" ", "T") + "Z");
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function guessSession(value: string): ForexSession {
  const hour = parseMt5Date(value).getUTCHours();
  if (hour >= 8 && hour < 13) return "London";
  if (hour >= 13 && hour < 22) return "New York";
  return "Asia";
}

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get("x-nava-secret");
    if (!process.env.MT5_WEBHOOK_SECRET || secret !== process.env.MT5_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Invalid or missing sync secret." }, { status: 401 });
    }

    const payload = (await req.json()) as SyncPayload;
    if (!payload.account?.login || !payload.account.server) {
      return NextResponse.json({ error: "Malformed account payload." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const positions = Array.isArray(payload.positions) ? payload.positions : [];
    const closedTrades = Array.isArray(payload.closedTrades) ? payload.closedTrades : [];
    const login = payload.account.login;

    const { error: accountError } = await supabase.from("mt5_accounts").upsert({
      account_login: login,
      server: payload.account.server,
      broker: payload.account.broker || "",
      name: payload.account.name || "",
      currency: payload.account.currency || "USD",
      leverage: payload.account.leverage || 0,
      balance: payload.account.balance || 0,
      equity: payload.account.equity || 0,
      margin: payload.account.margin || 0,
      free_margin: payload.account.freeMargin || 0,
      margin_level: payload.account.marginLevel || 0,
      floating_pnl: payload.account.floatingPnl || 0,
      open_positions: positions.length,
      last_sync: new Date().toISOString(),
    });
    if (accountError) throw accountError;

    const { error: deleteError } = await supabase
      .from("mt5_open_positions")
      .delete()
      .eq("account_login", login);
    if (deleteError) throw deleteError;

    if (positions.length) {
      const { error: positionsError } = await supabase.from("mt5_open_positions").insert(
        positions.map((position) => ({
          id: `${login}-${position.ticket}`,
          account_login: login,
          ticket: position.ticket,
          symbol: position.symbol,
          direction: position.direction,
          volume: position.volume || 0,
          open_price: position.openPrice || 0,
          current_price: position.currentPrice || 0,
          stop_loss: position.stopLoss || 0,
          take_profit: position.takeProfit || 0,
          floating_pnl: position.floatingPnl || 0,
          open_time: parseMt5Date(position.openTime).toISOString(),
          updated_at: new Date().toISOString(),
        }))
      );
      if (positionsError) throw positionsError;
    }

    for (const trade of closedTrades) {
      if (!trade.dealTicket || !trade.symbol) continue;
      const pair = normalizePair(trade.symbol);
      const pips = calcPips(pair, trade.entry, trade.exit);
      const risk = Math.abs(trade.entry - (trade.stopLoss || trade.entry));
      const reward = Math.abs((trade.takeProfit || trade.entry) - trade.entry);
      const rr = risk > 0 ? reward / risk : 0;
      const closedAt = parseMt5Date(trade.closeTime);

      const { error: tradeError } = await supabase.from("trades").upsert(
        {
          id: `mt5-${login}-${trade.dealTicket}`,
          date: closedAt.toISOString().slice(0, 10),
          pair,
          session: guessSession(trade.closeTime),
          direction: trade.direction === "short" ? "short" : "long",
          entry: trade.entry,
          exit: trade.exit,
          stop_loss: trade.stopLoss || 0,
          take_profit: trade.takeProfit || 0,
          lot_size: trade.lotSize || 0,
          pips: Number(pips.toFixed(1)),
          risk_pct: 0,
          rr: Number(rr.toFixed(2)),
          pnl: trade.pnl || 0,
          status: "closed",
          strategy: "MT5 auto-sync",
          emotion: "Neutral",
          notes: `Synced from MT5 account ${login}. Position ${trade.positionId}.`,
        },
        { onConflict: "id", ignoreDuplicates: true }
      );
      if (tradeError) throw tradeError;
    }

    return NextResponse.json({ ok: true, positions: positions.length, closedTrades: closedTrades.length });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "MT5 sync failed." },
      { status: 500 }
    );
  }
}
