"use client";

import { useMemo, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import { Upload, Plus, AlertCircle } from "lucide-react";
import { forexPairs, strategies } from "@/lib/mockData";
import { calcPips } from "@/lib/utils";
import { ForexSession, TradeEmotion, Trade } from "@/types";
import TradeChecklist, { CHECKLIST_ITEMS } from "./TradeChecklist";
import ConfettiBurst from "@/components/ui/ConfettiBurst";

const inputClass =
  "w-full rounded-xl border border-void-border bg-void-800 px-3.5 py-2.5 text-sm text-bone placeholder:text-bone-faint transition-colors focus:border-gold focus:outline-none";
const labelClass = "mb-1.5 block text-xs uppercase tracking-wider text-bone-faint";

const sessions: ForexSession[] = ["London", "New York", "Asia"];
const emotions: TradeEmotion[] = [
  "Confident",
  "Calm",
  "Neutral",
  "Fearful",
  "Greedy",
  "Frustrated",
];

export default function AddTradeForm({ onSaved }: { onSaved?: () => void }) {
  const [pair, setPair] = useState(forexPairs[0]);
  const [session, setSession] = useState<ForexSession>("London");
  const [direction, setDirection] = useState<"Long" | "Short">("Long");
  const [lotSize, setLotSize] = useState<number | "">("");
  const [entry, setEntry] = useState<number | "">("");
  const [exit, setExit] = useState<number | "">("");
  const [stopLoss, setStopLoss] = useState<number | "">("");
  const [takeProfit, setTakeProfit] = useState<number | "">("");
  const [riskPct, setRiskPct] = useState<number | "">("");
  const [profitLoss, setProfitLoss] = useState<number | "">("");
  const [strategy, setStrategy] = useState(strategies[0]?.name ?? "");
  const [emotion, setEmotion] = useState<TradeEmotion>("Calm");
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [checklistValues, setChecklistValues] = useState<Record<string, boolean>>({});
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  function toggleChecklistItem(item: string) {
    setChecklistValues((prev) => ({ ...prev, [item]: !prev[item] }));
  }

  const pips = useMemo(() => {
    if (entry === "" || exit === "") return null;
    return calcPips(pair, Number(entry), Number(exit));
  }, [pair, entry, exit]);

  const rr = useMemo(() => {
    if (entry === "" || stopLoss === "" || takeProfit === "") return null;
    const risk = Math.abs(Number(entry) - Number(stopLoss));
    const reward = Math.abs(Number(takeProfit) - Number(entry));
    return risk > 0 ? reward / risk : null;
  }, [entry, stopLoss, takeProfit]);

  function resetForm() {
    setLotSize("");
    setEntry("");
    setExit("");
    setStopLoss("");
    setTakeProfit("");
    setRiskPct("");
    setProfitLoss("");
    setNotes("");
    setFileName(null);
    setChecklistValues({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (entry === "" || stopLoss === "" || takeProfit === "" || lotSize === "") {
      setError("Fill in entry, stop loss, take profit, and lot size.");
      return;
    }

    const checklistPct = Math.round(
      (CHECKLIST_ITEMS.filter((item) => checklistValues[item]).length / CHECKLIST_ITEMS.length) *
        100
    );

    const trade: Trade = {
      id: `t-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      pair,
      session,
      direction: direction.toLowerCase() as Trade["direction"],
      entry: Number(entry),
      exit: exit === "" ? null : Number(exit),
      stopLoss: Number(stopLoss),
      takeProfit: Number(takeProfit),
      lotSize: Number(lotSize),
      pips: pips === null ? null : Number(pips.toFixed(1)),
      riskPct: riskPct === "" ? 0 : Number(riskPct),
      rr: rr === null ? 0 : Number(rr.toFixed(2)),
      pnl: profitLoss === "" ? null : Number(profitLoss),
      status: exit === "" ? "open" : "closed",
      strategy,
      emotion,
      notes,
      screenshotName: fileName ?? undefined,
      checklist: checklistValues,
      checklistPct,
    };

    setSaving(true);
    try {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trade),
      });
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error || "Failed to save trade.");
      }
      resetForm();
      setSaved(true);
      setConfettiTrigger((n) => n + 1);
      setTimeout(() => setSaved(false), 2500);
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save trade.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <GlassCard hover={false} glow>
      <h3 className="mb-5 font-display text-lg font-semibold text-bone">Log a forex trade</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <label className={labelClass}>Session</label>
          <select
            className={inputClass}
            value={session}
            onChange={(e) => setSession(e.target.value as ForexSession)}
          >
            {sessions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Direction</label>
          <select
            className={inputClass}
            value={direction}
            onChange={(e) => setDirection(e.target.value as "Long" | "Short")}
          >
            <option>Long</option>
            <option>Short</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Lot size</label>
          <input
            className={inputClass}
            type="number"
            step="0.01"
            placeholder="e.g. 0.50"
            value={lotSize}
            onChange={(e) => setLotSize(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelClass}>Entry price</label>
          <input
            className={inputClass}
            type="number"
            step="0.0001"
            value={entry}
            onChange={(e) => setEntry(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelClass}>Exit price</label>
          <input
            className={inputClass}
            type="number"
            step="0.0001"
            value={exit}
            onChange={(e) => setExit(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelClass}>Stop loss</label>
          <input
            className={inputClass}
            type="number"
            step="0.0001"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelClass}>Take profit</label>
          <input
            className={inputClass}
            type="number"
            step="0.0001"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelClass}>Risk (%)</label>
          <input
            className={inputClass}
            type="number"
            step="0.1"
            value={riskPct}
            onChange={(e) => setRiskPct(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelClass}>Profit / loss ($)</label>
          <input
            className={inputClass}
            type="number"
            step="0.01"
            placeholder="e.g. 140 or -68"
            value={profitLoss}
            onChange={(e) => setProfitLoss(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelClass}>Strategy used</label>
          <select className={inputClass} value={strategy} onChange={(e) => setStrategy(e.target.value)}>
            {strategies.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Emotion</label>
          <select
            className={inputClass}
            value={emotion}
            onChange={(e) => setEmotion(e.target.value as TradeEmotion)}
          >
            {emotions.map((em) => (
              <option key={em} value={em}>
                {em}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>RR ratio / pips (auto)</label>
          <div className={`${inputClass} flex items-center justify-between text-bone-dim`}>
            <span>{rr === null ? "RR —" : `RR 1 : ${rr.toFixed(2)}`}</span>
            <span
              className={
                pips === null ? "text-bone-dim" : pips >= 0 ? "text-profit" : "text-loss"
              }
            >
              {pips === null ? "— pips" : `${pips >= 0 ? "+" : ""}${pips.toFixed(1)} pips`}
            </span>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Notes</label>
          <textarea
            className={inputClass}
            rows={3}
            placeholder="What was the setup? What went right or wrong?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Screenshot</label>
          <label
            htmlFor="screenshot"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-void-border bg-void-800/60 px-4 py-6 text-sm text-bone-faint transition-colors hover:border-gold hover:text-gold"
          >
            <Upload size={16} />
            {fileName ?? "Upload chart screenshot"}
          </label>
          <input
            id="screenshot"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
          <p className="mt-1.5 text-[11px] text-bone-faint">
            Only the filename is saved for now — the image itself isn&apos;t uploaded.
          </p>
        </div>

        <div className="sm:col-span-2">
          <TradeChecklist values={checklistValues} onToggle={toggleChecklistItem} />
        </div>

        {error && (
          <div className="sm:col-span-2 flex items-center gap-2 rounded-xl border border-loss/30 bg-loss/10 px-4 py-3 text-sm text-loss">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <div className="sm:col-span-2">
          <GlowButton type="submit" className="w-full" icon={<Plus size={16} />} disabled={saving}>
            {saving ? "Saving…" : saved ? "Saved ✓" : "Save trade"}
          </GlowButton>
        </div>
      </form>
      <ConfettiBurst trigger={confettiTrigger} />
    </GlassCard>
  );
}
