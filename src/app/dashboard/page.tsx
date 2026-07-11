"use client";

import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Topbar from "@/components/layout/Topbar";
import StatCard from "@/components/ui/StatCard";
import GlassCard from "@/components/ui/GlassCard";
import RiskDial from "@/components/ui/RiskDial";
import EquityCurve, { EquityPoint } from "@/components/charts/EquityCurve";
import CurrencyWatchlist from "@/components/forex/CurrencyWatchlist";
import SessionTracker from "@/components/forex/SessionTracker";
import { formatSigned, cn } from "@/lib/utils";
import { Wallet, CalendarDays, TrendingUp, Percent, Activity } from "lucide-react";

type DashboardData = {
  stats: { accountBalance: number; dailyPnl: number; monthlyPnl: number; winRate: number; openTrades: number; riskUsedPct: number };
  equityCurve: EquityPoint[];
  recentTrades: Array<{ id: string; pair: string; direction: string; session: string; strategy: string; pnl: number | null }>;
  account: { currency: string; equity: number; floatingPnl: number; lastSync: string } | null;
};
const empty: DashboardData = { stats: { accountBalance: 0, dailyPnl: 0, monthlyPnl: 0, winRate: 0, openTrades: 0, riskUsedPct: 0 }, equityCurve: [], recentTrades: [], account: null };

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>(empty);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    try { const res = await fetch("/api/dashboard", { cache: "no-store" }); const body = await res.json(); if (!res.ok) throw new Error(body.error || "Dashboard sync failed"); setData(body); setError(null); }
    catch (e) { setError(e instanceof Error ? e.message : "Dashboard sync failed"); }
  }, []);
  useEffect(() => { load(); const timer = window.setInterval(load, 10000); return () => window.clearInterval(timer); }, [load]);
  const s = data.stats;
  return (
    <AppShell>
      <Topbar title="Dashboard" subtitle={data.account ? `Live MT5 · Last sync ${new Date(data.account.lastSync).toLocaleTimeString()}` : "Waiting for MT5 account sync"} />
      {error && <div className="mb-5 rounded-xl border border-loss/30 bg-loss/10 p-3 text-sm text-loss">{error}</div>}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Account balance" value={s.accountBalance} prefix="$" decimals={2} icon={<Wallet size={15} />} />
        <StatCard label="Daily P&L" value={s.dailyPnl} prefix="$" decimals={2} icon={<CalendarDays size={15} />} delay={0.05} />
        <StatCard label="Monthly P&L" value={s.monthlyPnl} prefix="$" decimals={2} icon={<TrendingUp size={15} />} delay={0.1} />
        <StatCard label="Win rate" value={s.winRate} suffix="%" decimals={1} icon={<Percent size={15} />} delay={0.15} />
        <StatCard label="Open trades" value={s.openTrades} icon={<Activity size={15} />} delay={0.2} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2" glow><div className="mb-4 flex items-center justify-between"><h3 className="font-display text-lg font-semibold text-bone">Equity curve</h3><span className="font-mono text-xs text-bone-faint">Live MT5 history</span></div><EquityCurve height={280} data={data.equityCurve} /></GlassCard>
        <GlassCard glow className="flex flex-col items-center justify-center"><h3 className="mb-2 self-start font-display text-lg font-semibold text-bone">Risk dial</h3><RiskDial usedPct={Number(s.riskUsedPct.toFixed(1))} /><p className="mt-4 text-center text-xs text-bone-faint">Calculated from today&apos;s realised loss against a 5% daily loss limit.</p></GlassCard>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2"><CurrencyWatchlist /><SessionTracker /></div>
      <GlassCard className="mt-6" hover={false}><div className="mb-4 flex items-center justify-between"><h3 className="font-display text-lg font-semibold text-bone">Recent trades</h3><a href="/journal" className="text-xs text-gold hover:underline">View full journal</a></div><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead><tr className="border-b border-void-border text-xs uppercase tracking-wider text-bone-faint"><th className="pb-3 pr-4 font-normal">Pair</th><th className="pb-3 pr-4 font-normal">Direction</th><th className="pb-3 pr-4 font-normal">Session</th><th className="pb-3 pr-4 font-normal">Strategy</th><th className="pb-3 text-right font-normal">P&L</th></tr></thead><tbody>{data.recentTrades.length ? data.recentTrades.map((t) => <tr key={t.id} className="border-b border-void-border/60 last:border-0"><td className="py-3 pr-4 font-medium text-bone">{t.pair}</td><td className="py-3 pr-4"><span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", t.direction === "long" ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss")}>{t.direction}</span></td><td className="py-3 pr-4 text-bone-dim">{t.session}</td><td className="py-3 pr-4 text-bone-dim">{t.strategy}</td><td className={cn("py-3 text-right font-mono font-medium", (t.pnl ?? 0) >= 0 ? "text-profit" : "text-loss")}>{t.pnl === null ? "—" : formatSigned(Number(t.pnl))}</td></tr>) : <tr><td colSpan={5} className="py-8 text-center text-bone-faint">No closed MT5 trades yet.</td></tr>}</tbody></table></div></GlassCard>
    </AppShell>
  );
}
