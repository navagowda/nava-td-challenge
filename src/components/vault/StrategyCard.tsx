"use client";

import { Strategy } from "@/types";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

const tagStyles: Record<Strategy["tag"], string> = {
  core: "bg-gold/10 text-gold",
  experimental: "bg-bone/10 text-bone-dim",
  retired: "bg-loss/10 text-loss",
};

export default function StrategyCard({ strategy, delay = 0 }: { strategy: Strategy; delay?: number }) {
  return (
    <GlassCard glow delay={delay}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-bone">{strategy.name}</h3>
          <p className="text-xs text-bone-faint">{strategy.category}</p>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize",
            tagStyles[strategy.tag]
          )}
        >
          {strategy.tag}
        </span>
      </div>

      <div className="mb-4 flex items-center gap-4 text-xs text-bone-faint">
        <span>
          Win rate <span className="font-mono text-bone">{strategy.winRate}%</span>
        </span>
      </div>

      <div className="mb-4">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-bone-faint">
          <CheckCircle2 size={13} className="text-profit" />
          Entry rules
        </p>
        <ul className="space-y-1.5 text-sm text-bone-dim">
          {strategy.entryRules.map((r) => (
            <li key={r} className="leading-relaxed">• {r}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-bone-faint">
          <XCircle size={13} className="text-loss" />
          Exit rules
        </p>
        <ul className="space-y-1.5 text-sm text-bone-dim">
          {strategy.exitRules.map((r) => (
            <li key={r} className="leading-relaxed">• {r}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl bg-void-800/60 p-3">
        <p className="text-xs uppercase tracking-wider text-bone-faint">Notes</p>
        <p className="mt-1 text-sm text-bone-dim">{strategy.notes}</p>
      </div>
    </GlassCard>
  );
}
