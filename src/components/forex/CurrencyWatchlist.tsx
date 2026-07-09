"use client";

import GlassCard from "@/components/ui/GlassCard";
import { watchlist } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function CurrencyWatchlist() {
  return (
    <GlassCard glow hover={false}>
      <h3 className="mb-4 font-display text-lg font-semibold text-bone">Currency pairs</h3>
      <div className="space-y-2">
        {watchlist.map((w) => {
          const up = w.changePct >= 0;
          return (
            <div
              key={w.pair}
              className="flex items-center justify-between rounded-xl bg-void-800/60 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-bone">{w.pair}</p>
                <p className="text-[11px] text-bone-faint">{w.session} session</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold text-bone">
                  {w.price.toFixed(w.pair.includes("JPY") ? 2 : 4)}
                </p>
                <p
                  className={cn(
                    "flex items-center justify-end gap-1 text-xs font-medium",
                    up ? "text-profit" : "text-loss"
                  )}
                >
                  {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.abs(w.changePct).toFixed(2)}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
