import AppShell from "@/components/layout/AppShell";
import Topbar from "@/components/layout/Topbar";
import PositionSizeCalculator from "@/components/risk/PositionSizeCalculator";
import RiskRewardCalculator from "@/components/risk/RiskRewardCalculator";
import DailyLossLimit from "@/components/risk/DailyLossLimit";
import TradingChecklist from "@/components/risk/TradingChecklist";
import PipCalculator from "@/components/forex/PipCalculator";

export default function RiskPage() {
  return (
    <AppShell>
      <Topbar
        title="Risk management"
        subtitle="Every forex trade is sized and checked before it happens"
      />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <PositionSizeCalculator />
        <PipCalculator />
        <RiskRewardCalculator />
        <DailyLossLimit />
        <TradingChecklist />
      </div>
    </AppShell>
  );
}
