import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createClient();
    const [{ data: accounts, error: accountError }, { data: trades, error: tradesError }] = await Promise.all([
      supabase.from("mt5_accounts").select("*").order("last_sync", { ascending: false }).limit(1),
      supabase.from("trades").select("id,date,pair,direction,session,strategy,pnl,status,created_at").eq("status", "closed").order("date", { ascending: true }).order("created_at", { ascending: true }),
    ]);
    if (accountError) throw accountError;
    if (tradesError) throw tradesError;
    const account = accounts?.[0] ?? null;
    const closed = trades ?? [];
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const month = today.slice(0, 7);
    const pnl = (t: any) => Number(t.pnl ?? 0);
    const dailyPnl = closed.filter((t: any) => t.date === today).reduce((s: number, t: any) => s + pnl(t), 0);
    const monthlyPnl = closed.filter((t: any) => String(t.date).startsWith(month)).reduce((s: number, t: any) => s + pnl(t), 0);
    const wins = closed.filter((t: any) => pnl(t) > 0).length;
    const winRate = closed.length ? (wins / closed.length) * 100 : 0;
    const balance = Number(account?.balance ?? 0);
    const dailyLossLimit = balance > 0 ? balance * 0.05 : 0;
    const riskUsedPct = dailyLossLimit > 0 ? Math.min(100, Math.max(0, (-dailyPnl / dailyLossLimit) * 100)) : 0;
    let running = balance - closed.reduce((s: number, t: any) => s + pnl(t), 0);
    const byDate = new Map<string, number>();
    for (const trade of closed) { running += pnl(trade); byDate.set(trade.date, running); }
    const equityCurve = Array.from(byDate.entries()).map(([date, equity]) => ({ date, equity: Number(equity.toFixed(2)) }));
    if (!equityCurve.length && account) equityCurve.push({ date: today, equity: Number(account.equity ?? balance) });
    return NextResponse.json({
      stats: { accountBalance: balance, dailyPnl, monthlyPnl, winRate, openTrades: Number(account?.open_positions ?? 0), riskUsedPct },
      equityCurve,
      recentTrades: [...closed].reverse().slice(0, 5),
      account: account ? { currency: account.currency, equity: Number(account.equity), floatingPnl: Number(account.floating_pnl), lastSync: account.last_sync } : null,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load dashboard." }, { status: 500 });
  }
}
