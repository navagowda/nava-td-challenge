"use client";

import { useMemo, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { Calculator } from "lucide-react";
import { forexPairs, watchlist } from "@/lib/mockData";

const inputClass =
  "w-full rounded-xl border border-void-border bg-void-800 px-3.5 py-2.5 text-sm text-bone placeholder:text-bone-faint transition-colors focus:border-gold focus:outline-none";
const labelClass = "mb-1.5 block text-xs uppercase tracking-wider text-bone-faint";

/** Approximate USD pip value per standard lot (100,000 units), assuming a
 * USD account currency. JPY-quoted pairs are converted using the current
 * USD/JPY rate from the watchlist. */
function pipValuePerStandardLot(pair: string): number {
  if (pair.includes("JPY")) {
    const usdJpy = watchlist.find((w) => w.pair === "USD/JPY")?.price ?? 150;
    return 1000 / usdJpy;
  }
  return 10;
}

export default function PositionSizeCalculator() {
  const [capital, setCapital] = useState(48500);
  const [riskPct, setRiskPct] = useState(1);
  const [pair, setPair] = useState(forexPairs[0]);
  const [stopLossPips, setStopLossPips] = useState(20);

  const result = useMemo(() => {
    const riskAmount = (capital * riskPct) / 100;
    const pipValue = pipValuePerStandardLot(pair);
    const standardLots = stopLossPips > 0 ? riskAmount / (stopLossPips * pipValue) : 0;
    return {
      riskAmount,
      pipValue,
      standardLots,
      microLots: standardLots * 100,
    };
  }, [capital, riskPct, pair, stopLossPips]);

  return (
    <GlassCard glow hover={false}>
      <div className="mb-5 flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold/10 text-gold">
          <Calculator size={16} />
        </div>
        <h3 className="font-display text-lg font-semibold text-bone">
          Lot size &amp; risk per trade
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Account balance ($)</label>
          <input
            type="number"
            className={inputClass}
            value={capital}
            onChange={(e) => setCapital(Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelClass}>Risk per trade (%)</label>
          <input
            type="number"
            step="0.1"
            className={inputClass}
            value={riskPct}
            onChange={(e) => setRiskPct(Number(e.target.value))}
          />
        </div>
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
          <label className={labelClass}>Stop loss (pips)</label>
          <input
            type="number"
            className={inputClass}
            value={stopLossPips}
            onChange={(e) => setStopLossPips(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-void-800/60 p-4 text-center sm:grid-cols-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-bone-faint">Risk amount</p>
          <p className="mt-1 font-mono text-sm font-semibold text-gold">
            ${result.riskAmount.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-bone-faint">Pip value / lot</p>
          <p className="mt-1 font-mono text-sm font-semibold text-bone">
            ${result.pipValue.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-bone-faint">Standard lots</p>
          <p className="mt-1 font-mono text-sm font-semibold text-bone">
            {result.standardLots.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-bone-faint">Micro lots</p>
          <p className="mt-1 font-mono text-sm font-semibold text-bone">
            {result.microLots.toFixed(0)}
          </p>
        </div>
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-bone-faint">
        Pip values are approximate and assume a USD account currency. Confirm
        exact contract specifications with your broker before sizing real
        trades.
      </p>
    </GlassCard>
  );
}
