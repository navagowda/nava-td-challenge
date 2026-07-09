"use client";

import { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  "Daily loss limit and risk per trade are defined",
  "Setup matches a documented strategy in the vault",
  "Position size calculated before entry",
  "Stop loss and target set before placing the order",
  "No trades taken from a place of frustration or FOMO",
  "Trade will be logged in the journal regardless of outcome",
];

export default function TradingChecklist() {
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));

  const toggle = (i: number) =>
    setChecked((c) => c.map((v, idx) => (idx === i ? !v : v)));

  const done = checked.filter(Boolean).length;

  return (
    <GlassCard glow hover={false}>
      <div className="mb-5 flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold/10 text-gold">
          <ClipboardCheck size={16} />
        </div>
        <h3 className="font-display text-lg font-semibold text-bone">Pre-trade checklist</h3>
        <span className="ml-auto font-mono text-xs text-bone-faint">
          {done}/{items.length}
        </span>
      </div>

      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={item}>
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => toggle(i)}
                className="mt-0.5 accent-gold"
              />
              <span
                className={cn(
                  "text-bone-dim transition-colors",
                  checked[i] && "text-bone-faint line-through"
                )}
              >
                {item}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
