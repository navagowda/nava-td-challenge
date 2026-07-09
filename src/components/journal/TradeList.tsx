"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Image as ImageIcon, Trash2, Loader2 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { formatSigned, cn } from "@/lib/utils";
import { Trade } from "@/types";

interface TradeListProps {
  trades: Trade[];
  loading?: boolean;
  error?: string | null;
  onDelete?: (id: string) => void;
}

export default function TradeList({ trades, loading, error, onDelete }: TradeListProps) {
  const [openId, setOpenId] = useState<string | null>(trades[0]?.id ?? null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!onDelete) return;
    setDeletingId(id);
    onDelete(id);
  }

  return (
    <GlassCard hover={false} glow>
      <h3 className="mb-5 font-display text-lg font-semibold text-bone">Trade history</h3>

      {loading && (
        <div className="flex items-center gap-2 py-8 text-sm text-bone-faint">
          <Loader2 size={15} className="animate-spin" />
          Loading trades…
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-loss/30 bg-loss/10 px-4 py-3 text-sm text-loss">
          {error}
        </div>
      )}

      {!loading && !error && trades.length === 0 && (
        <p className="py-8 text-center text-sm text-bone-faint">
          No trades logged yet — add your first one on the left.
        </p>
      )}

      {!loading && !error && trades.length > 0 && (
        <div className="space-y-3">
          {trades.map((t) => {
            const open = openId === t.id;
            return (
              <div
                key={t.id}
                className="overflow-hidden rounded-xl border border-void-border bg-void-800/50"
              >
                <button
                  onClick={() => setOpenId(open ? null : t.id)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                        t.direction === "long"
                          ? "bg-profit/10 text-profit"
                          : "bg-loss/10 text-loss"
                      )}
                    >
                      {t.direction}
                    </span>
                    <span className="text-sm font-medium text-bone">{t.pair}</span>
                    <span className="hidden text-xs text-bone-faint sm:inline">
                      {t.session} · {t.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "font-mono text-sm font-medium",
                        t.pnl === null
                          ? "text-bone-faint"
                          : t.pnl >= 0
                          ? "text-profit"
                          : "text-loss"
                      )}
                    >
                      {t.pnl === null ? "Open" : formatSigned(t.pnl)}
                    </span>
                    <ChevronDown
                      size={16}
                      className={cn(
                        "text-bone-faint transition-transform",
                        open && "rotate-180"
                      )}
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="grid grid-cols-2 gap-4 border-t border-void-border px-4 py-4 text-sm sm:grid-cols-4">
                        <div>
                          <p className="text-xs text-bone-faint">Entry</p>
                          <p className="font-mono text-bone">{t.entry}</p>
                        </div>
                        <div>
                          <p className="text-xs text-bone-faint">Exit</p>
                          <p className="font-mono text-bone">{t.exit ?? "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-bone-faint">Stop loss</p>
                          <p className="font-mono text-bone">{t.stopLoss}</p>
                        </div>
                        <div>
                          <p className="text-xs text-bone-faint">Take profit</p>
                          <p className="font-mono text-bone">{t.takeProfit}</p>
                        </div>
                        <div>
                          <p className="text-xs text-bone-faint">Lot size</p>
                          <p className="font-mono text-bone">{t.lotSize}</p>
                        </div>
                        <div>
                          <p className="text-xs text-bone-faint">Pips</p>
                          <p
                            className={cn(
                              "font-mono",
                              t.pips === null
                                ? "text-bone-faint"
                                : t.pips >= 0
                                ? "text-profit"
                                : "text-loss"
                            )}
                          >
                            {t.pips === null ? "—" : `${t.pips >= 0 ? "+" : ""}${t.pips}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-bone-faint">Risk %</p>
                          <p className="font-mono text-bone">{t.riskPct}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-bone-faint">RR ratio</p>
                          <p className="font-mono text-bone">1:{t.rr}</p>
                        </div>
                        <div className="col-span-2 sm:col-span-4">
                          <p className="text-xs text-bone-faint">Strategy</p>
                          <p className="text-bone-dim">{t.strategy}</p>
                        </div>
                        <div className="col-span-2 sm:col-span-2">
                          <p className="text-xs text-bone-faint">Emotion</p>
                          <p className="text-bone-dim">{t.emotion}</p>
                        </div>
                        <div className="col-span-2 sm:col-span-4">
                          <p className="text-xs text-bone-faint">Notes</p>
                          <p className="text-bone-dim">{t.notes || "—"}</p>
                        </div>
                        <div className="col-span-2 flex items-center justify-between gap-2 sm:col-span-4">
                          <span className="flex items-center gap-2 text-bone-faint">
                            <ImageIcon size={14} />
                            <span className="text-xs">
                              {t.screenshotName ?? "No screenshot attached"}
                            </span>
                          </span>
                          {onDelete && (
                            <button
                              onClick={() => handleDelete(t.id)}
                              disabled={deletingId === t.id}
                              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-loss transition-colors hover:bg-loss/10"
                            >
                              {deletingId === t.id ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Trash2 size={13} />
                              )}
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
