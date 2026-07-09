"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Topbar from "@/components/layout/Topbar";
import GlassCard from "@/components/ui/GlassCard";
import TradingViewWidget from "@/components/TradingViewWidget";
import { cn } from "@/lib/utils";

const symbols = [
  { label: "EUR/USD", value: "FX:EURUSD" },
  { label: "GBP/USD", value: "FX:GBPUSD" },
  { label: "XAU/USD", value: "OANDA:XAUUSD" },
  { label: "USD/JPY", value: "FX:USDJPY" },
  { label: "GBP/JPY", value: "FX:GBPJPY" },
  { label: "AUD/USD", value: "FX:AUDUSD" },
];

export default function ChartPage() {
  const [symbol, setSymbol] = useState(symbols[0].value);

  return (
    <AppShell>
      <Topbar title="Chart" subtitle="Live market view for pre-trade analysis" />

      <div className="mb-5 flex flex-wrap gap-2">
        {symbols.map((s) => (
          <button
            key={s.value}
            onClick={() => setSymbol(s.value)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              symbol === s.value
                ? "bg-gold-gradient text-void-950 shadow-gold-glow-sm"
                : "glass text-bone-dim hover:text-bone"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <GlassCard hover={false} className="p-2 sm:p-3">
        <TradingViewWidget symbol={symbol} height={620} />
      </GlassCard>
    </AppShell>
  );
}
