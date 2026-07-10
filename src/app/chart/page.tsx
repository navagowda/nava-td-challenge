"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  Calculator,
  CheckCircle2,
  Clock3,
  Maximize2,
  Minimize2,
  Search,
  Star,
  StickyNote,
  TrendingUp,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import TradingViewWidget from "@/components/TradingViewWidget";
import { cn } from "@/lib/utils";

const symbols = [
  { label: "EUR/USD", value: "FX:EURUSD", category: "Forex" },
  { label: "GBP/USD", value: "FX:GBPUSD", category: "Forex" },
  { label: "XAU/USD", value: "OANDA:XAUUSD", category: "Metals" },
  { label: "USD/JPY", value: "FX:USDJPY", category: "Forex" },
  { label: "GBP/JPY", value: "FX:GBPJPY", category: "Forex" },
  { label: "AUD/USD", value: "FX:AUDUSD", category: "Forex" },
  { label: "BTC/USD", value: "BITSTAMP:BTCUSD", category: "Crypto" },
  { label: "NASDAQ", value: "NASDAQ:NDX", category: "Indices" },
];

const intervals = [
  { label: "1m", value: "1" },
  { label: "5m", value: "5" },
  { label: "15m", value: "15" },
  { label: "1H", value: "60" },
  { label: "4H", value: "240" },
  { label: "1D", value: "D" },
];

const checklistItems = [
  "Trend confirmed",
  "Key level marked",
  "Risk below daily limit",
  "Minimum 1:2 reward-to-risk",
];

export default function ChartPage() {
  const [symbol, setSymbol] = useState(symbols[0].value);
  const [interval, setInterval] = useState("15");
  const [query, setQuery] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const [accountBalance, setAccountBalance] = useState("10000");
  const [riskPct, setRiskPct] = useState("1");
  const [stopPips, setStopPips] = useState("20");
  const [pipValue, setPipValue] = useState("10");
  const [notes, setNotes] = useState("");
  const [checks, setChecks] = useState<boolean[]>(checklistItems.map(() => false));

  const filteredSymbols = symbols.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const activeSymbol = symbols.find((item) => item.value === symbol) ?? symbols[0];

  const positionSize = useMemo(() => {
    const balance = Number(accountBalance);
    const risk = Number(riskPct);
    const stop = Number(stopPips);
    const value = Number(pipValue);
    if (!balance || !risk || !stop || !value) return 0;
    return (balance * (risk / 100)) / (stop * value);
  }, [accountBalance, riskPct, stopPips, pipValue]);

  const completedChecks = checks.filter(Boolean).length;

  return (
    <AppShell fullWidth compact>
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-void-border bg-void-950 shadow-card",
          fullscreen && "fixed inset-0 z-[100] rounded-none border-0"
        )}
      >
        <header className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-void-border bg-void-900/95 px-4 py-2 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-bone-faint">NAVA Terminal</p>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-base font-semibold text-bone">{activeSymbol.label}</h1>
                <span className="rounded-full bg-profit/10 px-2 py-0.5 text-[10px] font-semibold text-profit">MARKET</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 rounded-xl border border-void-border bg-void-850 p-1">
            {intervals.map((item) => (
              <button
                key={item.value}
                onClick={() => setInterval(item.value)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                  interval === item.value
                    ? "bg-gold text-void-950"
                    : "text-bone-faint hover:bg-void-700 hover:text-bone"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-xl border border-void-border bg-void-850 px-3 py-2 text-xs text-bone-dim md:flex">
              <Clock3 size={14} className="text-gold" />
              Asia/Kolkata
            </div>
            <button
              onClick={() => setFullscreen((value) => !value)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-void-border bg-void-850 text-bone-dim transition hover:border-gold/40 hover:text-gold"
              aria-label="Toggle full screen terminal"
            >
              {fullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
            </button>
          </div>
        </header>

        <div className="grid min-h-[calc(100vh-150px)] grid-cols-1 xl:grid-cols-[220px_minmax(0,1fr)_280px]">
          <aside className="hidden border-r border-void-border bg-void-900/80 xl:block">
            <div className="border-b border-void-border p-3">
              <div className="flex items-center gap-2 rounded-xl border border-void-border bg-void-850 px-3 py-2">
                <Search size={14} className="text-bone-faint" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search markets"
                  className="w-full bg-transparent text-xs text-bone outline-none placeholder:text-bone-faint"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-4 pb-2 pt-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-bone-faint">Watchlist</span>
              <Star size={13} className="text-gold" />
            </div>

            <div className="space-y-1 px-2 pb-4">
              {filteredSymbols.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setSymbol(item.value)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition",
                    symbol === item.value
                      ? "border border-gold/30 bg-gold/10"
                      : "border border-transparent hover:bg-void-850"
                  )}
                >
                  <div>
                    <p className={cn("text-sm font-semibold", symbol === item.value ? "text-gold" : "text-bone")}>{item.label}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wider text-bone-faint">{item.category}</p>
                  </div>
                  <BarChart3 size={15} className={symbol === item.value ? "text-gold" : "text-bone-faint"} />
                </button>
              ))}
            </div>
          </aside>

          <main className="min-w-0 bg-void-950 p-2">
            <TradingViewWidget
              symbol={symbol}
              interval={interval}
              height={fullscreen ? "calc(100vh - 72px)" : "calc(100vh - 168px)"}
            />
          </main>

          <aside className="border-t border-void-border bg-void-900/80 xl:border-l xl:border-t-0">
            <div className="grid gap-3 p-3 sm:grid-cols-2 xl:grid-cols-1">
              <section className="rounded-2xl border border-void-border bg-void-850 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Calculator size={16} className="text-gold" />
                  <h2 className="text-sm font-semibold text-bone">Position Size</h2>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Field label="Balance" value={accountBalance} onChange={setAccountBalance} prefix="$" />
                  <Field label="Risk" value={riskPct} onChange={setRiskPct} suffix="%" />
                  <Field label="Stop" value={stopPips} onChange={setStopPips} suffix="pips" />
                  <Field label="Pip value" value={pipValue} onChange={setPipValue} prefix="$" />
                </div>

                <div className="mt-3 rounded-xl border border-gold/20 bg-gold/10 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-bone-faint">Suggested size</p>
                  <p className="mt-1 font-mono text-xl font-bold text-gold">{positionSize.toFixed(2)} lots</p>
                </div>
              </section>

              <section className="rounded-2xl border border-void-border bg-void-850 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-profit" />
                    <h2 className="text-sm font-semibold text-bone">Pre-trade Checklist</h2>
                  </div>
                  <span className="text-xs font-semibold text-gold">{completedChecks}/{checklistItems.length}</span>
                </div>
                <div className="space-y-2">
                  {checklistItems.map((item, index) => (
                    <label key={item} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-xs text-bone-dim hover:bg-void-700">
                      <input
                        type="checkbox"
                        checked={checks[index]}
                        onChange={() =>
                          setChecks((current) => current.map((checked, itemIndex) => (itemIndex === index ? !checked : checked)))
                        }
                        className="h-4 w-4 accent-gold"
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-void-border bg-void-850 p-4 sm:col-span-2 xl:col-span-1">
                <div className="mb-3 flex items-center gap-2">
                  <StickyNote size={16} className="text-gold" />
                  <h2 className="text-sm font-semibold text-bone">Quick Notes</h2>
                </div>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Market bias, key levels, setup conditions..."
                  className="min-h-28 w-full resize-none rounded-xl border border-void-border bg-void-950 p-3 text-xs leading-relaxed text-bone outline-none placeholder:text-bone-faint focus:border-gold/40"
                />
              </section>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-wider text-bone-faint">{label}</span>
      <div className="flex items-center rounded-xl border border-void-border bg-void-950 px-2.5 py-2 focus-within:border-gold/40">
        {prefix && <span className="mr-1 text-xs text-bone-faint">{prefix}</span>}
        <input
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-xs text-bone outline-none"
        />
        {suffix && <span className="ml-1 text-[10px] text-bone-faint">{suffix}</span>}
      </div>
    </label>
  );
}
