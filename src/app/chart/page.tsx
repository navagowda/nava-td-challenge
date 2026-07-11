"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3,
  Calculator,
  CheckCircle2,
  Clock3,
  Globe2,
  ExternalLink,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Search,
  Star,
  StickyNote,
  TimerReset,
  TrendingUp,
  Pencil,
  Minus,
  Square,
  Undo2,
  Trash2,
  Cloud,
  CloudOff,
  GripVertical,
  EyeOff,
  Eye,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import TradingViewWidget from "@/components/TradingViewWidget";
import ChartDrawingOverlay, { Drawing, DrawingTool } from "@/components/ChartDrawingOverlay";
import { createClient } from "@/lib/supabase/client";
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


const tradingSessions = [
  { name: "Asia", startUtc: 0, endUtc: 9, note: "Tokyo / Sydney overlap" },
  { name: "London", startUtc: 8, endUtc: 17, note: "Highest European liquidity" },
  { name: "New York", startUtc: 13, endUtc: 22, note: "US session and London overlap" },
];

function getSessionState(now: Date, startUtc: number, endUtc: number) {
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const start = startUtc * 60;
  const end = endUtc * 60;
  const active = utcMinutes >= start && utcMinutes < end;
  const minutesUntil = active ? end - utcMinutes : utcMinutes < start ? start - utcMinutes : 24 * 60 - utcMinutes + start;
  return { active, minutesUntil };
}

function formatCountdown(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}


const indicatorOptions = [
  { label: "EMA", study: "MAExp@tv-basicstudies", note: "Exponential moving average" },
  { label: "VWAP", study: "VWAP@tv-basicstudies", note: "Volume-weighted average price" },
  { label: "Volume", study: "Volume@tv-basicstudies", note: "Trading volume" },
  { label: "ATR", study: "ATR@tv-basicstudies", note: "Average true range" },
  { label: "RSI", study: "RSI@tv-basicstudies", note: "Relative strength index" },
  { label: "MACD", study: "MACD@tv-basicstudies", note: "Momentum and trend" },
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
  const [watchlistOpen, setWatchlistOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(true);
  const [accountBalance, setAccountBalance] = useState("10000");
  const [riskPct, setRiskPct] = useState("1");
  const [stopPips, setStopPips] = useState("20");
  const [pipValue, setPipValue] = useState("10");
  const [notes, setNotes] = useState("");
  const [checks, setChecks] = useState<boolean[]>(checklistItems.map(() => false));
  const [now, setNow] = useState(() => new Date());
  const [activeIndicators, setActiveIndicators] = useState<string[]>([]);
  const [drawingTool, setDrawingTool] = useState<DrawingTool>("none");
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const chartAreaRef = useRef<HTMLDivElement>(null);
  const toolbarDragRef = useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(null);
  const [drawingToolbarVisible, setDrawingToolbarVisible] = useState(true);
  const [drawingToolbarPosition, setDrawingToolbarPosition] = useState({ x: 12, y: 12 });
  const [workspaceReady, setWorkspaceReady] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const loadSequence = useRef(0);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedWatchlist = window.localStorage.getItem("nava-terminal-watchlist-open");
    const savedTools = window.localStorage.getItem("nava-terminal-tools-open");
    const savedIndicators = window.localStorage.getItem("nava-terminal-indicators");
    const savedDrawingToolbarVisible = window.localStorage.getItem("nava-drawing-toolbar-visible");
    const savedDrawingToolbarPosition = window.localStorage.getItem("nava-drawing-toolbar-position");
    if (savedWatchlist !== null) setWatchlistOpen(savedWatchlist === "true");
    if (savedTools !== null) setToolsOpen(savedTools === "true");
    if (savedIndicators) {
      try { setActiveIndicators(JSON.parse(savedIndicators)); } catch { /* ignore invalid saved data */ }
    }
    if (savedDrawingToolbarVisible !== null) {
      setDrawingToolbarVisible(savedDrawingToolbarVisible === "true");
    }
    if (savedDrawingToolbarPosition) {
      try {
        const position = JSON.parse(savedDrawingToolbarPosition) as { x?: unknown; y?: unknown };
        if (typeof position.x === "number" && typeof position.y === "number") {
          setDrawingToolbarPosition({ x: position.x, y: position.y });
        }
      } catch {
        // Ignore invalid stored toolbar position.
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const sequence = ++loadSequence.current;
    setWorkspaceReady(false);
    setSaveState("idle");

    async function loadWorkspace() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled || sequence !== loadSequence.current) return;

      const { data, error } = await supabase
        .from("chart_workspaces")
        .select("workspace, drawings")
        .eq("user_id", user.id)
        .eq("symbol", symbol)
        .eq("interval", interval)
        .maybeSingle();

      if (cancelled || sequence !== loadSequence.current) return;
      if (!error && data) {
        const workspace = (data.workspace ?? {}) as Record<string, unknown>;
        if (Array.isArray(workspace.indicators)) setActiveIndicators(workspace.indicators as string[]);
        if (typeof workspace.notes === "string") setNotes(workspace.notes);
        if (typeof workspace.accountBalance === "string") setAccountBalance(workspace.accountBalance);
        if (typeof workspace.riskPct === "string") setRiskPct(workspace.riskPct);
        if (typeof workspace.stopPips === "string") setStopPips(workspace.stopPips);
        if (typeof workspace.pipValue === "string") setPipValue(workspace.pipValue);
        if (Array.isArray(workspace.checks)) setChecks(workspace.checks as boolean[]);
        if (typeof workspace.watchlistOpen === "boolean") setWatchlistOpen(workspace.watchlistOpen);
        if (typeof workspace.toolsOpen === "boolean") setToolsOpen(workspace.toolsOpen);
        if (typeof workspace.drawingToolbarVisible === "boolean") setDrawingToolbarVisible(workspace.drawingToolbarVisible);
        if (workspace.drawingToolbarPosition && typeof workspace.drawingToolbarPosition === "object") {
          const position = workspace.drawingToolbarPosition as { x?: unknown; y?: unknown };
          if (typeof position.x === "number" && typeof position.y === "number") {
            setDrawingToolbarPosition({ x: position.x, y: position.y });
          }
        }
        setDrawings(Array.isArray(data.drawings) ? data.drawings as Drawing[] : []);
      } else {
        setDrawings([]);
      }
      setWorkspaceReady(true);
    }

    loadWorkspace();
    return () => { cancelled = true; };
  }, [symbol, interval]);

  useEffect(() => {
    window.localStorage.setItem("nava-terminal-watchlist-open", String(watchlistOpen));
  }, [watchlistOpen]);

  useEffect(() => {
    window.localStorage.setItem("nava-terminal-tools-open", String(toolsOpen));
  }, [toolsOpen]);

  useEffect(() => {
    window.localStorage.setItem("nava-terminal-indicators", JSON.stringify(activeIndicators));
  }, [activeIndicators]);

  useEffect(() => {
    window.localStorage.setItem("nava-drawing-toolbar-visible", String(drawingToolbarVisible));
  }, [drawingToolbarVisible]);

  useEffect(() => {
    window.localStorage.setItem("nava-drawing-toolbar-position", JSON.stringify(drawingToolbarPosition));
  }, [drawingToolbarPosition]);

  useEffect(() => {
    if (!workspaceReady) return;
    setSaveState("saving");
    const timer = window.setTimeout(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setSaveState("error"); return; }

      const workspace = {
        indicators: activeIndicators, notes, accountBalance, riskPct, stopPips, pipValue,
        checks, watchlistOpen, toolsOpen, drawingToolbarVisible, drawingToolbarPosition,
      };
      const { error } = await supabase.from("chart_workspaces").upsert({
        user_id: user.id, symbol, interval, workspace, drawings, updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,symbol,interval" });
      setSaveState(error ? "error" : "saved");
    }, 900);
    return () => window.clearTimeout(timer);
  }, [workspaceReady, symbol, interval, activeIndicators, notes, accountBalance, riskPct, stopPips, pipValue, checks, watchlistOpen, toolsOpen, drawingToolbarVisible, drawingToolbarPosition, drawings]);

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

  function startToolbarDrag(event: React.PointerEvent<HTMLButtonElement>) {
    const area = chartAreaRef.current?.getBoundingClientRect();
    if (!area) return;
    toolbarDragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - area.left - drawingToolbarPosition.x,
      offsetY: event.clientY - area.top - drawingToolbarPosition.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function moveToolbar(event: React.PointerEvent<HTMLButtonElement>) {
    const drag = toolbarDragRef.current;
    const area = chartAreaRef.current?.getBoundingClientRect();
    if (!drag || drag.pointerId !== event.pointerId || !area) return;
    const toolbarWidth = 560;
    const toolbarHeight = 44;
    const x = Math.max(4, Math.min(area.width - toolbarWidth - 4, event.clientX - area.left - drag.offsetX));
    const y = Math.max(4, Math.min(area.height - toolbarHeight - 4, event.clientY - area.top - drag.offsetY));
    setDrawingToolbarPosition({ x, y });
  }

  function endToolbarDrag(event: React.PointerEvent<HTMLButtonElement>) {
    if (toolbarDragRef.current?.pointerId !== event.pointerId) return;
    toolbarDragRef.current = null;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already be released.
    }
  }

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
              {new Intl.DateTimeFormat("en-IN", {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }).format(now)} IST
            </div>
            <div
              className={cn(
                "hidden items-center gap-1.5 rounded-xl border px-3 py-2 text-[10px] font-semibold sm:flex",
                saveState === "error" ? "border-loss/30 text-loss" : "border-void-border text-bone-faint"
              )}
              title="Workspace and NAVA annotations auto-save to Supabase"
            >
              {saveState === "error" ? <CloudOff size={13} /> : <Cloud size={13} className={saveState === "saving" ? "animate-pulse text-gold" : "text-profit"} />}
              {saveState === "saving" ? "Saving…" : saveState === "error" ? "Save failed" : saveState === "saved" ? "Saved" : "Cloud save"}
            </div>
            <a
              href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(symbol)}`}
              target="_blank"
              rel="noreferrer"
              className="flex h-9 items-center gap-2 rounded-xl border border-void-border bg-void-850 px-3 text-xs font-semibold text-bone-dim transition hover:border-gold/40 hover:text-gold"
              title="Open full TradingView with saved drawings and layouts"
            >
              <ExternalLink size={15} />
              <span className="hidden sm:inline">TradingView</span>
            </a>
            <button
              onClick={() => setFullscreen((value) => !value)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-void-border bg-void-850 text-bone-dim transition hover:border-gold/40 hover:text-gold"
              aria-label="Toggle full screen terminal"
            >
              {fullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
            </button>
          </div>
        </header>

        <div className="grid min-h-[calc(100vh-150px)] grid-cols-1 transition-[grid-template-columns] duration-200 xl:grid-cols-[auto_minmax(0,1fr)_auto]">
          <aside
            className={cn(
              "relative hidden border-r border-void-border bg-void-900/80 transition-all duration-200 xl:block",
              watchlistOpen ? "w-[220px]" : "w-[42px]"
            )}
          >
            <button
              onClick={() => setWatchlistOpen((value) => !value)}
              className="absolute -right-3 top-4 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-void-border bg-void-850 text-bone-faint shadow-lg transition hover:border-gold/40 hover:text-gold"
              aria-label={watchlistOpen ? "Collapse watchlist" : "Expand watchlist"}
              title={watchlistOpen ? "Collapse watchlist" : "Expand watchlist"}
            >
              {watchlistOpen ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
            </button>

            {watchlistOpen ? (
              <>
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
              </>
            ) : (
              <div className="flex h-full flex-col items-center gap-3 pt-14">
                <Star size={15} className="text-gold" />
                {symbols.slice(0, 6).map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setSymbol(item.value)}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg text-[9px] font-bold transition",
                      symbol === item.value ? "bg-gold text-void-950" : "bg-void-850 text-bone-faint hover:text-gold"
                    )}
                    title={item.label}
                  >
                    {item.label.slice(0, 2)}
                  </button>
                ))}
              </div>
            )}
          </aside>

          <main className="min-w-0 bg-void-950 p-2">
            <div ref={chartAreaRef} className="relative h-full min-h-[520px] overflow-hidden rounded-xl">
              <TradingViewWidget
                symbol={symbol}
                interval={interval}
                studies={activeIndicators}
                height={fullscreen ? "calc(100vh - 72px)" : "calc(100vh - 168px)"}
              />
              <ChartDrawingOverlay tool={drawingTool} drawings={drawings} onChange={setDrawings} />

              {drawingToolbarVisible ? (
                <div
                  className="absolute z-30 flex items-center gap-1 rounded-xl border border-void-border bg-void-900/95 p-1.5 shadow-card backdrop-blur"
                  style={{ left: drawingToolbarPosition.x, top: drawingToolbarPosition.y }}
                >
                  <button
                    type="button"
                    title="Drag drawing toolbar"
                    aria-label="Drag drawing toolbar"
                    onPointerDown={startToolbarDrag}
                    onPointerMove={moveToolbar}
                    onPointerUp={endToolbarDrag}
                    onPointerCancel={endToolbarDrag}
                    className="flex h-8 w-7 touch-none cursor-grab items-center justify-center rounded-lg text-bone-faint hover:bg-void-700 hover:text-gold active:cursor-grabbing"
                  >
                    <GripVertical size={15} />
                  </button>
                  <DrawingButton active={drawingTool === "none"} title="Use chart" onClick={() => setDrawingTool("none")}><TrendingUp size={15} /></DrawingButton>
                  <DrawingButton active={drawingTool === "line"} title="Trend line" onClick={() => setDrawingTool("line")}><Pencil size={15} /></DrawingButton>
                  <DrawingButton active={drawingTool === "horizontal"} title="Horizontal line" onClick={() => setDrawingTool("horizontal")}><Minus size={15} /></DrawingButton>
                  <DrawingButton active={drawingTool === "rectangle"} title="Rectangle" onClick={() => setDrawingTool("rectangle")}><Square size={15} /></DrawingButton>
                  <DrawingButton active={drawingTool === "freehand"} title="Freehand" onClick={() => setDrawingTool("freehand")}><Pencil size={15} className="rotate-12" /></DrawingButton>
                  <span className="mx-1 h-5 w-px bg-void-border" />
                  <TextDrawingButton active={drawingTool === "bos"} title="Place Break of Structure label" label="BOS" onClick={() => setDrawingTool("bos")} />
                  <TextDrawingButton active={drawingTool === "choch"} title="Place Change of Character label" label="CH" onClick={() => setDrawingTool("choch")} />
                  <TextDrawingButton active={drawingTool === "bullish-ob"} title="Draw bullish order block" label="OB+" onClick={() => setDrawingTool("bullish-ob")} />
                  <TextDrawingButton active={drawingTool === "bearish-ob"} title="Draw bearish order block" label="OB−" onClick={() => setDrawingTool("bearish-ob")} />
                  <TextDrawingButton active={drawingTool === "bullish-fvg"} title="Draw bullish fair value gap" label="FVG+" onClick={() => setDrawingTool("bullish-fvg")} />
                  <TextDrawingButton active={drawingTool === "bearish-fvg"} title="Draw bearish fair value gap" label="FVG−" onClick={() => setDrawingTool("bearish-fvg")} />
                  <TextDrawingButton active={drawingTool === "buy-liquidity"} title="Mark buy-side liquidity" label="BSL" onClick={() => setDrawingTool("buy-liquidity")} />
                  <TextDrawingButton active={drawingTool === "sell-liquidity"} title="Mark sell-side liquidity" label="SSL" onClick={() => setDrawingTool("sell-liquidity")} />
                  <TextDrawingButton active={drawingTool === "premium-discount"} title="Draw premium and discount range" label="P/D" onClick={() => setDrawingTool("premium-discount")} />
                  <span className="mx-1 h-5 w-px bg-void-border" />
                  <DrawingButton title="Undo last NAVA drawing" disabled={drawings.length === 0} onClick={() => setDrawings((current) => current.slice(0, -1))}><Undo2 size={15} /></DrawingButton>
                  <DrawingButton title="Delete all NAVA drawings" disabled={drawings.length === 0} onClick={() => { if (window.confirm("Delete all saved NAVA drawings for this symbol and timeframe?")) setDrawings([]); }}><Trash2 size={15} /></DrawingButton>
                  <span className="mx-1 h-5 w-px bg-void-border" />
                  <DrawingButton title="Hide drawing toolbar" onClick={() => { setDrawingTool("none"); setDrawingToolbarVisible(false); }}><EyeOff size={15} /></DrawingButton>
                </div>
              ) : (
                <button
                  type="button"
                  title="Show drawing toolbar"
                  aria-label="Show drawing toolbar"
                  onClick={() => setDrawingToolbarVisible(true)}
                  className="absolute left-3 top-3 z-30 flex h-9 items-center gap-2 rounded-xl border border-void-border bg-void-900/95 px-3 text-xs font-semibold text-bone-dim shadow-card backdrop-blur transition hover:border-gold/40 hover:text-gold"
                >
                  <Eye size={15} />
                  <span className="hidden sm:inline">Drawings</span>
                </button>
              )}

              {drawingTool !== "none" && (
                <div className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2 rounded-full border border-gold/25 bg-void-900/95 px-4 py-2 text-[11px] font-semibold text-gold shadow-card">
                  NAVA drawing mode · saved for {activeSymbol.label} / {interval}
                </div>
              )}
            </div>
          </main>

          <aside
            className={cn(
              "relative border-t border-void-border bg-void-900/80 transition-all duration-200 xl:border-l xl:border-t-0",
              toolsOpen ? "xl:w-[280px]" : "xl:w-[42px]"
            )}
          >
            <button
              onClick={() => setToolsOpen((value) => !value)}
              className="absolute -left-3 top-4 z-20 hidden h-7 w-7 items-center justify-center rounded-full border border-void-border bg-void-850 text-bone-faint shadow-lg transition hover:border-gold/40 hover:text-gold xl:flex"
              aria-label={toolsOpen ? "Collapse trading tools" : "Expand trading tools"}
              title={toolsOpen ? "Collapse trading tools" : "Expand trading tools"}
            >
              {toolsOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
            </button>

            {toolsOpen ? (
              <div className="grid max-h-[calc(100vh-168px)] gap-3 overflow-y-auto p-3 sm:grid-cols-2 xl:grid-cols-1">
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


                <section className="rounded-2xl border border-gold/20 bg-void-850 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">Phase 2</p>
                      <h2 className="mt-1 text-sm font-semibold text-bone">Smart Money Toolkit</h2>
                    </div>
                    <span className="rounded-full bg-gold/10 px-2 py-1 text-[9px] font-semibold text-gold">Cloud saved</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ["BOS", "bos", "Break of Structure"],
                      ["CHoCH", "choch", "Change of Character"],
                      ["Bullish OB", "bullish-ob", "Demand order block"],
                      ["Bearish OB", "bearish-ob", "Supply order block"],
                      ["Bullish FVG", "bullish-fvg", "Bullish imbalance"],
                      ["Bearish FVG", "bearish-fvg", "Bearish imbalance"],
                      ["Buy liquidity", "buy-liquidity", "Buy-side liquidity"],
                      ["Sell liquidity", "sell-liquidity", "Sell-side liquidity"],
                      ["Premium / Discount", "premium-discount", "Range with 50% equilibrium"],
                    ].map(([label, value, note]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setDrawingTool(value as DrawingTool)}
                        className={cn(
                          "rounded-xl border px-3 py-2.5 text-left transition",
                          drawingTool === value
                            ? "border-gold/40 bg-gold/10 text-gold"
                            : "border-void-border bg-void-950 text-bone-dim hover:border-gold/25"
                        )}
                      >
                        <p className="text-[11px] font-semibold">{label}</p>
                        <p className="mt-1 text-[9px] leading-tight text-bone-faint">{note}</p>
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-[10px] leading-relaxed text-bone-faint">
                    Select a tool, then click or drag on the chart. These are NAVA annotations and are saved per symbol and timeframe. Because the chart is a free TradingView iframe, the toolkit is manual rather than automatic candle detection.
                  </p>
                </section>

                <section className="rounded-2xl border border-void-border bg-void-850 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={16} className="text-gold" />
                      <h2 className="text-sm font-semibold text-bone">Indicators</h2>
                    </div>
                    <button
                      onClick={() => setActiveIndicators([])}
                      className="text-[10px] font-semibold uppercase tracking-wider text-bone-faint hover:text-gold"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {indicatorOptions.map((item) => {
                      const enabled = activeIndicators.includes(item.study);
                      return (
                        <button
                          key={item.study}
                          onClick={() =>
                            setActiveIndicators((current) =>
                              enabled ? current.filter((study) => study !== item.study) : [...current, item.study]
                            )
                          }
                          className={cn(
                            "rounded-xl border px-3 py-2.5 text-left transition",
                            enabled
                              ? "border-gold/35 bg-gold/10 text-gold"
                              : "border-void-border bg-void-950 text-bone-dim hover:border-gold/25"
                          )}
                          title={item.note}
                        >
                          <p className="text-xs font-semibold">{item.label}</p>
                          <p className="mt-1 text-[9px] leading-tight text-bone-faint">{item.note}</p>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-[10px] leading-relaxed text-bone-faint">
                    Your selected indicators are remembered on this browser. Community scripts such as LuxAlgo SMC, FVG and Order Blocks must be added in full TradingView.
                  </p>
                </section>

                <section className="rounded-2xl border border-void-border bg-void-850 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe2 size={16} className="text-gold" />
                      <h2 className="text-sm font-semibold text-bone">Market Sessions</h2>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-bone-faint">UTC based</span>
                  </div>

                  <div className="space-y-2">
                    {tradingSessions.map((session) => {
                      const state = getSessionState(now, session.startUtc, session.endUtc);
                      return (
                        <div
                          key={session.name}
                          className={cn(
                            "rounded-xl border px-3 py-2.5 transition",
                            state.active
                              ? "border-profit/30 bg-profit/10"
                              : "border-void-border bg-void-950"
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "h-2 w-2 rounded-full",
                                    state.active ? "animate-pulse bg-profit" : "bg-bone-faint"
                                  )}
                                />
                                <p className="text-xs font-semibold text-bone">{session.name}</p>
                              </div>
                              <p className="mt-1 text-[10px] text-bone-faint">
                                {session.startUtc.toString().padStart(2, "0")}:00–
                                {session.endUtc.toString().padStart(2, "0")}:00 UTC
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={cn("text-[10px] font-semibold uppercase", state.active ? "text-profit" : "text-bone-faint")}>
                                {state.active ? "Open" : "Closed"}
                              </p>
                              <p className="mt-1 flex items-center justify-end gap-1 text-[10px] text-bone-dim">
                                <TimerReset size={11} />
                                {state.active ? "closes" : "opens"} in {formatCountdown(state.minutesUntil)}
                              </p>
                            </div>
                          </div>
                          <p className="mt-2 text-[10px] text-bone-faint">{session.note}</p>
                        </div>
                      );
                    })}
                  </div>

                  <a
                    href="https://www.tradingview.com/scripts/search/market%20sessions/"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-gold/25 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold transition hover:bg-gold/15"
                  >
                    <Search size={13} />
                    Find session indicators
                  </a>
                  <p className="mt-2 text-[10px] leading-relaxed text-bone-faint">
                    In TradingView Indicators, search “Market Sessions”, “Forex Sessions”, or “ICT Killzones”.
                  </p>
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
            ) : (
              <div className="hidden h-full flex-col items-center gap-4 pt-14 xl:flex">
                <Calculator size={16} className="text-gold" />
                <Globe2 size={16} className="text-gold" />
                <CheckCircle2 size={16} className="text-profit" />
                <StickyNote size={16} className="text-bone-faint" />
              </div>
            )}
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function TextDrawingButton({ active = false, title, label, onClick }: { active?: boolean; title: string; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "flex h-8 min-w-8 items-center justify-center rounded-lg px-1.5 text-[9px] font-black transition",
        active ? "bg-gold text-void-950" : "text-bone-faint hover:bg-void-700 hover:text-gold"
      )}
    >
      {label}
    </button>
  );
}

function DrawingButton({ active = false, disabled = false, title, onClick, children }: { active?: boolean; disabled?: boolean; title: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg transition",
        active ? "bg-gold text-void-950" : "text-bone-faint hover:bg-void-700 hover:text-gold",
        disabled && "cursor-not-allowed opacity-35"
      )}
    >
      {children}
    </button>
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
