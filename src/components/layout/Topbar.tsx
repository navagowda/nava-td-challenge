"use client";

import { Bell, Search } from "lucide-react";

export default function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold text-bone sm:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-bone-dim">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-bone-faint">
          <Search size={15} />
          <span className="hidden sm:inline">Search trades, strategies…</span>
        </div>
        <button
          aria-label="Notifications"
          className="glass grid h-10 w-10 place-items-center rounded-full text-bone-dim transition-colors hover:text-gold"
        >
          <Bell size={16} />
        </button>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gold-gradient font-display text-sm font-semibold text-void-950 shadow-gold-glow-sm">
          N
        </div>
      </div>
    </div>
  );
}
