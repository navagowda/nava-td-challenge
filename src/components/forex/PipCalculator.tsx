"use client";

import { useMemo, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { Ruler } from "lucide-react";
import { forexPairs } from "@/lib/mockData";
import { calcPips } from "@/lib/utils";

const inputClass =
  "w-full rounded-xl border border-void-border bg-void-800 px-3.5 py-2.5 text-sm text-bone placeholder:text-bone-faint transition-colors focus:border-gold focus:outline-none";
const labelClass = "mb-1.5 block text-xs uppercase tracking-wider text-bone-faint";

export default function PipCalculator() {
  const [pair, setPair] = useState(forexPairs[0]);
  const [entry, setEntry] = useState(1.085);
  const [exit, setExit] = useState(1.09);

  const isGold = pair.startsWith("XAU");
  const pips = useMemo(() => calcPips(pair, entry, exit), [pair, entry, exit]);

  return (
    <GlassCard glow hover={false}>
      <div className="mb-5 flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold/10 text-gold">
          <Ruler size={16} />
        </div>
        <h3 className="font-display text-lg font-semibold text-bone">Pip calculator</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Currency pair</label>
          <select className={inputClass} value={pair} onChange={(e) => setPair(e.target.value)}>
            {forexPairs.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Entry price</label>
          <input
            type="number"
            step="0.0001"
            className={inputClass}
            value={entry}
            onChange={(e) => setEntry(Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelClass}>Exit price</label>
          <input
            type="number"
            step="0.0001"
            className={inputClass}
            value={exit}
            onChange={(e) => setExit(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-void-800/60 p-4 text-center">
        <p className="text-[11px] uppercase tracking-wider text-bone-faint">
          {isGold ? "Points gained / lost" : "Pips gained / lost"}
        </p>
        <p
          className={`mt-1 font-mono text-2xl font-semibold ${
            pips >= 0 ? "text-profit" : "text-loss"
          }`}
        >
          {pips >= 0 ? "+" : ""}
          {pips.toFixed(1)}
        </p>
      </div>
      {isGold && (
        <p className="mt-3 text-[11px] leading-relaxed text-bone-faint">
          XAU/USD is shown in points (1 point = $0.10 move) — a common
          retail convention, not a universal standard.
        </p>
      )}
    </GlassCard>
  );
}
