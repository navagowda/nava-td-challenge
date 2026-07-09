"use client";

import GlassCard from "@/components/ui/GlassCard";
import { AlertTriangle } from "lucide-react";

export default function DailyLossLimit() {
  const limit = 500;
  const used = 0;
  const pct = Math.min(100, (used / limit) * 100);

  return (
    <GlassCard glow hover={false}>
      <div className="mb-5 flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold/10 text-gold">
          <AlertTriangle size={16} />
        </div>
        <h3 className="font-display text-lg font-semibold text-bone">Daily loss limit</h3>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-bone-faint">Used today</p>
          <p className="font-mono text-2xl font-semibold text-bone">${used.toLocaleString("en-US")}</p>
        </div>
        <p className="font-mono text-sm text-bone-faint">of ${limit.toLocaleString("en-US")}</p>
      </div>

      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-void-800">
        <div
          className="h-full rounded-full bg-gold-gradient transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="mt-4 text-xs leading-relaxed text-bone-faint">
        Once the daily loss limit is hit, the session ends — no further
        entries until the next trading day.
      </p>
    </GlassCard>
  );
}
