import AppShell from "@/components/layout/AppShell";
import Topbar from "@/components/layout/Topbar";
import StatCard from "@/components/ui/StatCard";
import GlassCard from "@/components/ui/GlassCard";
import RiskDial from "@/components/ui/RiskDial";
import EquityCurve from "@/components/charts/EquityCurve";
import CurrencyWatchlist from "@/components/forex/CurrencyWatchlist";
import SessionTracker from "@/components/forex/SessionTracker";
import { dashboardStats, recentTrades } from "@/lib/mockData";
import { formatSigned, cn } from "@/lib/utils";
import { Wallet, CalendarDays, TrendingUp, Percent, Activity } from "lucide-react";

export default function DashboardPage() {
  return (
    <AppShell>
      <Topbar title="Dashboard" subtitle="Thursday, 3 July 2026 · Session summary" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Account balance"
          value={dashboardStats.accountBalance}
          prefix="$"
          icon={<Wallet size={15} />}
        />
        <StatCard
          label="Daily P&L"
          value={dashboardStats.dailyPnl}
          prefix="$"
          icon={<CalendarDays size={15} />}
          delay={0.05}
        />
        <StatCard
          label="Monthly P&L"
          value={dashboardStats.monthlyPnl}
          prefix="$"
          icon={<TrendingUp size={15} />}
          delay={0.1}
        />
        <StatCard
          label="Win rate"
          value={dashboardStats.winRate}
          suffix="%"
          icon={<Percent size={15} />}
          delay={0.15}
        />
        <StatCard
          label="Open trades"
          value={dashboardStats.openTrades}
          icon={<Activity size={15} />}
          delay={0.2}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2" glow>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-bone">Equity curve</h3>
            <span className="font-mono text-xs text-bone-faint">Last 12 months</span>
          </div>
          <EquityCurve height={280} />
        </GlassCard>

        <GlassCard glow className="flex flex-col items-center justify-center">
          <h3 className="mb-2 self-start font-display text-lg font-semibold text-bone">
            Risk dial
          </h3>
          <RiskDial usedPct={dashboardStats.riskUsedPct} />
          <p className="mt-4 text-center text-xs text-bone-faint">
            Daily loss limit resets at market open tomorrow.
          </p>
        </GlassCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <CurrencyWatchlist />
        <SessionTracker />
      </div>

      <GlassCard className="mt-6" hover={false}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-bone">Recent trades</h3>
          <a href="/journal" className="text-xs text-gold hover:underline">
            View full journal
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-void-border text-xs uppercase tracking-wider text-bone-faint">
                <th className="pb-3 pr-4 font-normal">Pair</th>
                <th className="pb-3 pr-4 font-normal">Direction</th>
                <th className="pb-3 pr-4 font-normal">Session</th>
                <th className="pb-3 pr-4 font-normal">Strategy</th>
                <th className="pb-3 text-right font-normal">P&L</th>
              </tr>
            </thead>
            <tbody>
              {recentTrades.map((t) => (
                <tr key={t.id} className="border-b border-void-border/60 last:border-0">
                  <td className="py-3 pr-4 font-medium text-bone">{t.pair}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                        t.direction === "long"
                          ? "bg-profit/10 text-profit"
                          : "bg-loss/10 text-loss"
                      )}
                    >
                      {t.direction}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-bone-dim">{t.session}</td>
                  <td className="py-3 pr-4 text-bone-dim">{t.strategy}</td>
                  <td
                    className={cn(
                      "py-3 text-right font-mono font-medium",
                      t.pnl === null
                        ? "text-bone-faint"
                        : t.pnl >= 0
                        ? "text-profit"
                        : "text-loss"
                    )}
                  >
                    {t.pnl === null ? "—" : formatSigned(t.pnl)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </AppShell>
  );
}
