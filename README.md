# NAVA — Risk First. Profit Follows.

A private, personal trading workspace for tracking your own trades:
journal, risk tools, analytics, strategy vault, reports, and a live chart —
wrapped in a premium dark, gold-accented UI.

**This is a personal tool.** NAVA is not a prop trading firm, funding
program, brokerage, educational product, or copy-trading service. It does
not offer challenges, payouts, or financial products to anyone else.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (animation)
- Recharts (equity curve, drawdown, returns, strategy performance)
- Lucide Icons
- TradingView Advanced Chart widget

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build for production

```bash
npm run build
npm run start
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Framework preset: **Next.js** (auto-detected). No environment variables
   are required for the current mock-data version.
4. Deploy.

## Project structure

```
src/
  app/                # Routes (App Router) — one folder per page
    page.tsx           # Landing page
    login/              # Private login
    dashboard/          # Main cockpit
    chart/              # TradingView chart workspace
    journal/            # Trade journal
    risk/               # Risk management tools
    analytics/           # Performance analytics
    vault/               # Strategy vault
    reports/             # Daily / weekly / monthly reports
    settings/            # Profile, risk defaults, theme, backup
  components/
    ui/                 # GlassCard, GlowButton, AnimatedCounter, RiskDial, RiskPulse (signature motif), StatCard
    layout/             # Navbar, Sidebar, Topbar, AppShell
    landing/             # Hero, ChartBackground, FeatureCards, RiskFirstSection, DashboardPreview, Footer
    charts/              # Recharts wrappers (equity, drawdown, returns, win/loss, strategy)
    journal/             # AddTradeForm, TradeList
    risk/                # PositionSizeCalculator, RiskRewardCalculator, DailyLossLimit, TradingChecklist
    vault/               # StrategyCard
    reports/             # ReportCard
    TradingViewWidget.tsx
  lib/                  # mockData.ts, utils.ts
  types/                # Shared TypeScript types
```

## Connecting real data

Everything currently reads from `src/lib/mockData.ts` so the UI can be
explored immediately. To wire up real trades:

1. Replace the mock arrays with calls to your own storage (a database, a
   local JSON file, or an API route under `src/app/api/`).
2. The `Trade`, `Strategy`, and `ReportSummary` shapes are defined in
   `src/types/index.ts` — keep data conforming to those types and the UI
   updates automatically.
3. The login page is a UI shell only; add real authentication (e.g.
   NextAuth, Clerk, or a custom JWT flow) before deploying somewhere public.

## Notes on the TradingView widget

`src/components/TradingViewWidget.tsx` embeds TradingView's free
Advanced Real-Time Chart widget via their public embed script. Swap the
`symbol` prop to any TradingView-supported ticker.
