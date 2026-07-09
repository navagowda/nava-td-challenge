"use client";

import { useMemo, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { Scale } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-void-border bg-void-800 px-3.5 py-2.5 text-sm text-bone placeholder:text-bone-faint transition-colors focus:border-gold focus:outline-none";
const labelClass = "mb-1.5 block text-xs uppercase tracking-wider text-bone-faint";

export default function RiskRewardCalculator() {
  const [entry, setEntry] = useState(1.085);
  const [stopLoss, setStopLoss] = useState(1.082);
  const [target, setTarget] = useState(1.091);

  const ratio = useMemo(() => {
    const risk = Math.abs(entry - stopLoss);
    const reward = Math.abs(target - entry);
    return risk > 0 ? reward / risk : 0;
  }, [entry, stopLoss, target]);

  const quality = ratio >= 2 ? "Favourable" : ratio >= 1 ? "Acceptable" : "Poor";
  const color = ratio >= 2 ? "text-profit" : ratio >= 1 ? "text-gold" : "text-loss";

  return (
    <GlassCard glow hover={false}>
      <div className="mb-5 flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold/10 text-gold">
          <Scale size={16} />
        </div>
        <h3 className="font-display text-lg font-semibold text-bone">
          Risk / reward calculator
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Entry</label>
          <input
            type="number"
            step="0.0001"
            className={inputClass}
            value={entry}
            onChange={(e) => setEntry(Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelClass}>Stop loss</label>
          <input
            type="number"
            step="0.0001"
            className={inputClass}
            value={stopLoss}
            onChange={(e) => setStopLoss(Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelClass}>Target</label>
          <input
            type="number"
            step="0.0001"
            className={inputClass}
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl bg-void-800/60 p-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-bone-faint">Ratio</p>
          <p className="font-mono text-2xl font-semibold text-bone">1 : {ratio.toFixed(2)}</p>
        </div>
        <span className={`text-sm font-medium ${color}`}>{quality}</span>
      </div>
    </GlassCard>
  );
}
