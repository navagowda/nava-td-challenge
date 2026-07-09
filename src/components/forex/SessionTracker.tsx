"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

const sessions = [
  { name: "Asia", start: 0, end: 9 },
  { name: "London", start: 8, end: 17 },
  { name: "New York", start: 13, end: 22 },
];

function isActive(hour: number, start: number, end: number) {
  return start < end ? hour >= start && hour < end : hour >= start || hour < end;
}

export default function SessionTracker() {
  const [utcHour, setUtcHour] = useState<number | null>(null);

  useEffect(() => {
    function update() {
      const now = new Date();
      setUtcHour(now.getUTCHours() + now.getUTCMinutes() / 60);
    }
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <GlassCard glow hover={false}>
      <h3 className="mb-4 font-display text-lg font-semibold text-bone">Session tracker</h3>
      <div className="space-y-3">
        {sessions.map((s) => {
          const active = utcHour !== null && isActive(utcHour, s.start, s.end);
          return (
            <div
              key={s.name}
              className="flex items-center justify-between gap-3 rounded-xl bg-void-800/60 px-4 py-3"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    active
                      ? "bg-profit shadow-[0_0_8px_2px_rgba(62,207,142,0.6)]"
                      : "bg-bone-faint/30"
                  )}
                />
                <span className="text-sm font-medium text-bone">{s.name}</span>
              </div>
              <span className="font-mono text-xs text-bone-faint">
                {String(s.start).padStart(2, "0")}:00–{String(s.end).padStart(2, "0")}:00 UTC
              </span>
              <span className={cn("text-xs font-medium", active ? "text-profit" : "text-bone-faint")}>
                {utcHour === null ? "…" : active ? "Open" : "Closed"}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-bone-faint">
        Session windows are approximate UTC trading hours and do not adjust
        for daylight saving time.
      </p>
    </GlassCard>
  );
}
