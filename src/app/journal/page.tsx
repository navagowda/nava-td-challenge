"use client";

import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Topbar from "@/components/layout/Topbar";
import AddTradeForm from "@/components/journal/AddTradeForm";
import TradeList from "@/components/journal/TradeList";
import { Trade } from "@/types";

export default function JournalPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTrades = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/trades");
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error || "Failed to load trades.");
      }
      setTrades(body.trades ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trades.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrades();
  }, [loadTrades]);

  async function handleDelete(id: string) {
    const previous = trades;
    setTrades((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(`/api/trades/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to delete trade.");
      }
    } catch (err) {
      setTrades(previous);
      setError(err instanceof Error ? err.message : "Failed to delete trade.");
    }
  }

  return (
    <AppShell>
      <Topbar title="Trade journal" subtitle="Every forex trade, logged honestly" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <AddTradeForm onSaved={loadTrades} />
        </div>
        <div className="lg:col-span-3">
          <TradeList trades={trades} loading={loading} error={error} onDelete={handleDelete} />
        </div>
      </div>
    </AppShell>
  );
}
