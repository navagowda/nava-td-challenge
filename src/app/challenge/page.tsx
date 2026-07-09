"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import AppShell from "@/components/layout/AppShell";
import Topbar from "@/components/layout/Topbar";
import GlassCard from "@/components/ui/GlassCard";
import ConfettiBurst from "@/components/ui/ConfettiBurst";
import { Trade } from "@/types";
import { Trophy, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CHALLENGE_SIZE = 50;

export default function ChallengePage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const celebratedRef = useRef(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/trades");
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "Failed to load trades.");
        // API returns newest-first; reverse for oldest-first challenge order.
        setTrades([...(body.trades ?? [])].reverse());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load trades.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const challengeTrades = trades.slice(0, CHALLENGE_SIZE);
  const completed = challengeTrades.length;
  const remaining = CHALLENGE_SIZE - completed;
  const progressPct = Math.round((completed / CHALLENGE_SIZE) * 100);

  const stats = useMemo(() => {
    const decided = challengeTrades.filter(
      (t) => t.status === "closed" && t.pnl !== null
    );
    const wins = decided.filter((t) => (t.pnl ?? 0) > 0).length;
    const winRate = decided.length > 0 ? Math.round((wins / decided.length) * 100) : null;

    const withChecklist = challengeTrades.filter((t) => t.checklistPct !== undefined);
    const disciplinePct =
      withChecklist.length > 0
        ? Math.round(
            withChecklist.reduce((sum, t) => sum + (t.checklistPct ?? 0), 0) /
              withChecklist.length
          )
        : null;

    return { winRate, disciplinePct };
  }, [challengeTrades]);

  useEffect(() => {
    if (completed === CHALLENGE_SIZE && !celebratedRef.current) {
      celebratedRef.current = true;
      setConfettiTrigger((n) => n + 1);
    }
  }, [completed]);

  return (
    <AppShell>
      <Topbar title="50 Trade Challenge" subtitle="Every logged trade counts toward the 50" />

      {loading && (
        <div className="flex items-center gap-2 py-8 text-sm text-bone-faint">
          <Loader2 size={15} className="animate-spin" />
          Loading challenge progress…
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-loss/30 bg-loss/10 px-4 py-3 text-sm text-loss">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            <GlassCard glow>
              <p className="text-xs uppercase tracking-widest text-bone-faint">Progress</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-bone">
                {completed} / {CHALLENGE_SIZE}
              </p>
            </GlassCard>
            <GlassCard glow delay={0.05}>
              <p className="text-xs uppercase tracking-widest text-bone-faint">Current score</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-bone">
                {stats.winRate === null ? "—" : `${stats.winRate}%`}
              </p>
            </GlassCard>
            <GlassCard glow delay={0.1}>
              <p className="text-xs uppercase tracking-widest text-bone-faint">Discipline %</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-bone">
                {stats.disciplinePct === null ? "—" : `${stats.disciplinePct}%`}
              </p>
            </GlassCard>
            <GlassCard glow delay={0.15}>
              <p className="text-xs uppercase tracking-widest text-bone-faint">Completion %</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-bone">{progressPct}%</p>
            </GlassCard>
          </div>

          <GlassCard hover={false} className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-bone">Challenge progress</h3>
              {completed === CHALLENGE_SIZE && (
                <span className="flex items-center gap-1.5 text-sm font-medium text-gold">
                  <Trophy size={15} />
                  Challenge complete
                </span>
              )}
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-void-800">
              <motion.div
                className="h-full rounded-full bg-gold-gradient shadow-gold-glow-sm"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <p className="mt-2 text-xs text-bone-faint">
              {remaining > 0
                ? `${remaining} trade${remaining === 1 ? "" : "s"} to go.`
                : "All 50 trades logged."}
            </p>
          </GlassCard>

          <GlassCard hover={false} className="mt-5">
            <h3 className="mb-4 font-display text-lg font-semibold text-bone">Trade grid</h3>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
              {Array.from({ length: CHALLENGE_SIZE }, (_, i) => {
                const trade = challengeTrades[i];
                const done = Boolean(trade);
                const win = done && trade.status === "closed" && (trade.pnl ?? 0) > 0;
                const loss = done && trade.status === "closed" && (trade.pnl ?? 0) < 0;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.01, 0.4) }}
                    title={
                      done
                        ? `#${i + 1} · ${trade.pair} · ${trade.date}${
                            trade.pnl !== null ? ` · ${trade.pnl >= 0 ? "+" : ""}${trade.pnl}` : ""
                          }`
                        : `#${i + 1} · not yet logged`
                    }
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-lg font-mono text-[11px] font-medium",
                      !done && "border border-void-border text-bone-faint",
                      win && "bg-profit/20 text-profit ring-1 ring-profit/40",
                      loss && "bg-loss/20 text-loss ring-1 ring-loss/40",
                      done && !win && !loss && "bg-gold/15 text-gold ring-1 ring-gold/30"
                    )}
                  >
                    {i + 1}
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </>
      )}

      <ConfettiBurst trigger={confettiTrigger} />
    </AppShell>
  );
}
