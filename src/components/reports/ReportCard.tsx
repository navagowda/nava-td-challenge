"use client";

import { ReportSummary } from "@/types";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import { formatSigned } from "@/lib/utils";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

const periodLabel: Record<ReportSummary["period"], string> = {
  daily: "Daily report",
  weekly: "Weekly report",
  monthly: "Monthly report",
};

export default function ReportCard({ report, delay = 0 }: { report: ReportSummary; delay?: number }) {
  return (
    <GlassCard glow delay={delay}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-gold">{periodLabel[report.period]}</p>
          <h3 className="mt-1 font-display text-lg font-semibold text-bone">{report.label}</h3>
          <p className="text-xs text-bone-faint">{report.dateRange}</p>
        </div>
        <span
          className={cn(
            "font-mono text-lg font-semibold",
            report.netPnl >= 0 ? "text-profit" : "text-loss"
          )}
        >
          {formatSigned(report.netPnl)}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 rounded-xl bg-void-800/60 p-4 text-center">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-bone-faint">Win rate</p>
          <p className="mt-1 font-mono text-sm font-semibold text-bone">{report.winRate}%</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-bone-faint">Trades</p>
          <p className="mt-1 font-mono text-sm font-semibold text-bone">{report.trades}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-bone-faint">Best / worst</p>
          <p className="mt-1 font-mono text-sm font-semibold text-bone">
            {formatSigned(report.bestTrade)}
          </p>
        </div>
      </div>

      <GlowButton variant="outline" className="mt-5 w-full" icon={<Download size={15} />}>
        Export as PDF
      </GlowButton>
    </GlassCard>
  );
}
