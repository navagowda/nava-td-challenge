import AppShell from "@/components/layout/AppShell";
import Topbar from "@/components/layout/Topbar";
import GlassCard from "@/components/ui/GlassCard";
import StatCard from "@/components/ui/StatCard";
import EquityCurve from "@/components/charts/EquityCurve";
import MonthlyReturns from "@/components/charts/MonthlyReturns";
import WinLossChart from "@/components/charts/WinLossChart";
import DrawdownChart from "@/components/charts/DrawdownChart";
import StrategyPerformanceChart from "@/components/charts/StrategyPerformanceChart";
import PairPerformanceChart from "@/components/charts/PairPerformanceChart";
import SessionPerformanceChart from "@/components/charts/SessionPerformanceChart";
import WinRateByPairChart from "@/components/charts/WinRateByPairChart";
import { avgPipsPerTrade, bestForexPair, worstForexPair } from "@/lib/mockData";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <AppShell>
      <Topbar title="Analytics" subtitle="Forex performance, broken down honestly" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard
          label="Avg pips / trade"
          value={avgPipsPerTrade}
          suffix=" pips"
          decimals={1}
          icon={<Activity size={15} />}
        />
        <StatCard
          label={`Best pair · ${bestForexPair.pair}`}
          value={bestForexPair.pnl}
          prefix="$"
          icon={<TrendingUp size={15} />}
          delay={0.05}
        />
        <StatCard
          label={`Worst pair · ${worstForexPair.pair}`}
          value={worstForexPair.pnl}
          prefix="$"
          icon={<TrendingDown size={15} />}
          delay={0.1}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2" glow>
          <h3 className="mb-4 font-display text-lg font-semibold text-bone">Equity curve</h3>
          <EquityCurve height={300} />
        </GlassCard>

        <GlassCard glow>
          <h3 className="mb-4 font-display text-lg font-semibold text-bone">Win / loss</h3>
          <WinLossChart height={260} />
        </GlassCard>

        <GlassCard glow>
          <h3 className="mb-4 font-display text-lg font-semibold text-bone">Monthly forex P&amp;L</h3>
          <MonthlyReturns height={260} />
        </GlassCard>

        <GlassCard glow>
          <h3 className="mb-4 font-display text-lg font-semibold text-bone">Drawdown</h3>
          <DrawdownChart height={260} />
        </GlassCard>

        <GlassCard glow>
          <h3 className="mb-4 font-display text-lg font-semibold text-bone">Win rate by pair</h3>
          <WinRateByPairChart height={260} />
        </GlassCard>

        <GlassCard className="lg:col-span-2" glow>
          <h3 className="mb-4 font-display text-lg font-semibold text-bone">Pair-wise performance</h3>
          <PairPerformanceChart height={260} />
        </GlassCard>

        <GlassCard glow>
          <h3 className="mb-4 font-display text-lg font-semibold text-bone">Session-wise performance</h3>
          <SessionPerformanceChart height={260} />
        </GlassCard>

        <GlassCard className="lg:col-span-3" glow>
          <h3 className="mb-4 font-display text-lg font-semibold text-bone">Performance by strategy</h3>
          <StrategyPerformanceChart height={260} />
        </GlassCard>
      </div>
    </AppShell>
  );
}
