"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export const CHECKLIST_ITEMS = [
  "Correct session",
  "Trend identified",
  "Support/resistance marked",
  "Breakout confirmed",
  "Retest confirmed",
  "Momentum confirmed",
  "Stop loss set",
  "Take profit set",
  "RR at least 1:2",
  "Risk at 1%",
  "Screenshot saved",
  "Journal updated",
] as const;

interface TradeChecklistProps {
  values: Record<string, boolean>;
  onToggle: (item: string) => void;
}

export default function TradeChecklist({ values, onToggle }: TradeChecklistProps) {
  const completed = CHECKLIST_ITEMS.filter((item) => values[item]).length;
  const pct = Math.round((completed / CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="rounded-xl border border-void-border bg-void-800/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-bone-faint">Pre-trade checklist</p>
        <span
          className={`font-mono text-sm font-semibold ${
            pct === 100 ? "text-profit" : "text-gold"
          }`}
        >
          {pct}%
        </span>
      </div>

      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-void-700">
        <motion.div
          className="h-full rounded-full bg-gold-gradient"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {CHECKLIST_ITEMS.map((item) => {
          const checked = !!values[item];
          return (
            <button
              type="button"
              key={item}
              onClick={() => onToggle(item)}
              className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm text-bone-dim transition-colors hover:bg-void-700/60"
            >
              <motion.span
                initial={false}
                animate={{
                  scale: checked ? [1, 1.3, 1] : 1,
                  backgroundColor: checked ? "#C9A227" : "rgba(255,255,255,0.06)",
                  borderColor: checked ? "#C9A227" : "#26262C",
                }}
                transition={{ duration: 0.3 }}
                className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-md border"
              >
                {checked && <Check size={12} className="text-void-950" />}
              </motion.span>
              <span className={checked ? "text-bone" : ""}>{item}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
