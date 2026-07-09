import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { ForexSession } from "@/types";
import { calcPips } from "@/lib/utils";

interface Mt5Payload {
  symbol: string;
  direction: "long" | "short";
  entry: number;
  exit: number;
  stopLoss: number;
  takeProfit: number;
  lotSize: number;
  pnl: number;
  closeTime: string; // e.g. "2026.07.06 14:32:10"
}

/** Turns a raw broker symbol like "EURUSDm" or "XAUUSD.a" into "EUR/USD". */
function normalizePair(symbol: string): string {
  const letters = symbol.replace(/[^A-Za-z]/g, "").toUpperCase();
  if (letters.length < 6) return symbol.toUpperCase();
  return `${letters.slice(0, 3)}/${letters.slice(3, 6)}`;
}

/** Rough UTC-hour based session guess. Approximate — see setup notes. */
function guessSession(mt5Time: string): ForexSession {
  const iso = mt5Time.replace(/\./g, "-").replace(" ", "T") + "Z";
  const date = new Date(iso);
  const hour = isNaN(date.getTime()) ? new Date().getUTCHours() : date.getUTCHours();
  if (hour >= 8 && hour < 13) return "London";
  if (hour >= 13 && hour < 22) return "New York";
  return "Asia";
}

function toIsoDate(mt5Time: string): string {
  const datePart = mt5Time.split(" ")[0]?.replace(/\./g, "-");
  return datePart || new Date().toISOString().slice(0, 10);
}

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get("x-nava-secret");
    if (!process.env.MT5_WEBHOOK_SECRET || secret !== process.env.MT5_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Invalid or missing sync secret." }, { status: 401 });
    }

    const payload = (await req.json()) as Mt5Payload;

    if (
      !payload.symbol ||
      typeof payload.entry !== "number" ||
      typeof payload.exit !== "number"
    ) {
      return NextResponse.json({ error: "Malformed MT5 payload." }, { status: 400 });
    }

    const pair = normalizePair(payload.symbol);
    const pips = calcPips(pair, payload.entry, payload.exit);
    const risk = Math.abs(payload.entry - (payload.stopLoss || payload.entry));
    const reward = Math.abs((payload.takeProfit || payload.entry) - payload.entry);
    const rr = risk > 0 ? reward / risk : 0;

    const safeId = `mt5-${payload.symbol}-${payload.closeTime}`.replace(/[^a-zA-Z0-9-]/g, "");

    const supabase = createAdminClient();
    const { error } = await supabase.from("trades").upsert(
      {
        id: safeId || `mt5-${Date.now()}`,
        date: toIsoDate(payload.closeTime),
        pair,
        session: guessSession(payload.closeTime),
        direction: payload.direction === "short" ? "short" : "long",
        entry: payload.entry,
        exit: payload.exit,
        stop_loss: payload.stopLoss || 0,
        take_profit: payload.takeProfit || 0,
        lot_size: payload.lotSize || 0,
        pips: Number(pips.toFixed(1)),
        risk_pct: 0,
        rr: Number(rr.toFixed(2)),
        pnl: payload.pnl,
        status: "closed",
        strategy: "MT5 auto-sync",
        emotion: "Neutral",
        notes: "Synced automatically from MT5. Edit strategy/emotion/notes in the journal.",
      },
      { onConflict: "id", ignoreDuplicates: true }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to sync MT5 trade." },
      { status: 500 }
    );
  }
}
