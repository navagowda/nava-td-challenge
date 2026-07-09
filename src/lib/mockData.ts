import {
  EquityPoint,
  MonthlyReturn,
  PairPerformance,
  ReportSummary,
  SessionPerformance,
  Strategy,
  StrategyPerformance,
  Trade,
  WatchlistItem,
} from "@/types";

export const forexPairs: string[] = [
  "EUR/USD",
  "GBP/USD",
  "XAU/USD",
  "USD/JPY",
  "GBP/JPY",
  "AUD/USD",
];

export const watchlist: WatchlistItem[] = [
  { pair: "EUR/USD", price: 1.0862, changePct: 0.18, session: "London" },
  { pair: "GBP/USD", price: 1.2704, changePct: -0.05, session: "London" },
  { pair: "XAU/USD", price: 2381.4, changePct: 0.42, session: "New York" },
  { pair: "USD/JPY", price: 161.35, changePct: 0.11, session: "Asia" },
  { pair: "GBP/JPY", price: 205.02, changePct: -0.22, session: "Asia" },
  { pair: "AUD/USD", price: 0.6675, changePct: 0.09, session: "Asia" },
];

export const equityCurve: EquityPoint[] = [
  { date: "Jan", equity: 40000 },
  { date: "Feb", equity: 41300 },
  { date: "Mar", equity: 40600 },
  { date: "Apr", equity: 42800 },
  { date: "May", equity: 43950 },
  { date: "Jun", equity: 43200 },
  { date: "Jul", equity: 45100 },
  { date: "Aug", equity: 46400 },
  { date: "Sep", equity: 45700 },
  { date: "Oct", equity: 47250 },
  { date: "Nov", equity: 48000 },
  { date: "Dec", equity: 48500 },
];

export const monthlyReturns: MonthlyReturn[] = [
  { month: "Jan", returnPct: 1.8 },
  { month: "Feb", returnPct: 3.3 },
  { month: "Mar", returnPct: -1.7 },
  { month: "Apr", returnPct: 5.4 },
  { month: "May", returnPct: 2.7 },
  { month: "Jun", returnPct: -1.7 },
  { month: "Jul", returnPct: 4.4 },
  { month: "Aug", returnPct: 2.9 },
  { month: "Sep", returnPct: -1.5 },
  { month: "Oct", returnPct: 3.4 },
  { month: "Nov", returnPct: 1.6 },
  { month: "Dec", returnPct: 1.0 },
];

export const winLossData = [
  { name: "Wins", value: 64 },
  { name: "Losses", value: 36 },
];

export const drawdownData = [
  { date: "Jan", drawdown: -1.1 },
  { date: "Feb", drawdown: -0.4 },
  { date: "Mar", drawdown: -3.9 },
  { date: "Apr", drawdown: -0.8 },
  { date: "May", drawdown: -1.9 },
  { date: "Jun", drawdown: -4.6 },
  { date: "Jul", drawdown: -1.0 },
  { date: "Aug", drawdown: -0.5 },
  { date: "Sep", drawdown: -3.2 },
  { date: "Oct", drawdown: -0.7 },
  { date: "Nov", drawdown: -0.4 },
  { date: "Dec", drawdown: -0.3 },
];

export const strategyPerformance: StrategyPerformance[] = [
  { strategy: "London Breakout", winRate: 69, trades: 46, pnl: 5200 },
  { strategy: "NY Session Continuation", winRate: 61, trades: 34, pnl: 3100 },
  { strategy: "Liquidity Sweep", winRate: 64, trades: 28, pnl: 2600 },
  { strategy: "Gold Scalping Setup", winRate: 60, trades: 18, pnl: 2400 },
  { strategy: "Support/Resistance Retest", winRate: 57, trades: 22, pnl: 1300 },
  { strategy: "Trend Continuation", winRate: 55, trades: 20, pnl: 900 },
];

export const pairPerformance: PairPerformance[] = [
  { pair: "EUR/USD", trades: 42, winRate: 68, pnl: 3900, avgPips: 14.2 },
  { pair: "GBP/USD", trades: 30, winRate: 62, pnl: 2600, avgPips: 11.8 },
  { pair: "XAU/USD", trades: 18, winRate: 72, pnl: 4200, avgPips: 22.5 },
  { pair: "USD/JPY", trades: 24, winRate: 58, pnl: 1400, avgPips: 9.4 },
  { pair: "GBP/JPY", trades: 15, winRate: 47, pnl: -600, avgPips: -3.1 },
  { pair: "AUD/USD", trades: 20, winRate: 60, pnl: 1000, avgPips: 8.7 },
];

export const sessionPerformance: SessionPerformance[] = [
  { session: "London", trades: 55, winRate: 66, pnl: 5400 },
  { session: "New York", trades: 48, winRate: 61, pnl: 4300 },
  { session: "Asia", trades: 26, winRate: 50, pnl: -200 },
];

export const bestForexPair: PairPerformance = [...pairPerformance].sort(
  (a, b) => b.pnl - a.pnl
)[0];

export const worstForexPair: PairPerformance = [...pairPerformance].sort(
  (a, b) => a.pnl - b.pnl
)[0];

export const avgPipsPerTrade = Number(
  (
    pairPerformance.reduce((sum, p) => sum + p.avgPips * p.trades, 0) /
    pairPerformance.reduce((sum, p) => sum + p.trades, 0)
  ).toFixed(1)
);

export const recentTrades: Trade[] = [
  {
    id: "t-2031",
    date: "2026-07-03",
    pair: "XAU/USD",
    session: "New York",
    direction: "long",
    entry: 2372.4,
    exit: 2381.4,
    stopLoss: 2367.9,
    takeProfit: 2384.4,
    lotSize: 0.3,
    pips: 90,
    riskPct: 1,
    rr: 2.67,
    pnl: 270,
    status: "closed",
    strategy: "Gold Scalping Setup",
    emotion: "Confident",
    notes: "Clean reaction off the New York open with strong momentum. Trailed after 1.5R.",
  },
  {
    id: "t-2030",
    date: "2026-07-02",
    pair: "GBP/USD",
    session: "London",
    direction: "short",
    entry: 1.2732,
    exit: 1.2704,
    stopLoss: 1.2748,
    takeProfit: 1.2698,
    lotSize: 0.5,
    pips: 28,
    riskPct: 0.8,
    rr: 1.75,
    pnl: 140,
    status: "closed",
    strategy: "London Breakout",
    emotion: "Calm",
    notes: "Swept the Asia session high right at London open, reclaimed quickly and reversed.",
  },
  {
    id: "t-2029",
    date: "2026-07-02",
    pair: "USD/JPY",
    session: "Asia",
    direction: "long",
    entry: 161.62,
    exit: 161.35,
    stopLoss: 161.28,
    takeProfit: 162.1,
    lotSize: 0.4,
    pips: -27,
    riskPct: 0.6,
    rr: 1.41,
    pnl: -68,
    status: "closed",
    strategy: "Trend Continuation",
    emotion: "Frustrated",
    notes: "Entered into a thin Asia range without enough confirmation. Should have waited for London.",
  },
  {
    id: "t-2028",
    date: "2026-07-01",
    pair: "EUR/USD",
    session: "London",
    direction: "short",
    entry: 1.0891,
    exit: null,
    stopLoss: 1.0918,
    takeProfit: 1.0842,
    lotSize: 0.6,
    pips: null,
    riskPct: 1,
    rr: 1.81,
    pnl: null,
    status: "open",
    strategy: "Liquidity Sweep",
    emotion: "Neutral",
    notes: "Faded a liquidity sweep above the weekly high, holding into New York per plan.",
  },
];

export const strategies: Strategy[] = [
  {
    id: "s-1",
    name: "London Breakout",
    category: "London session",
    entryRules: [
      "Mark the Asia session high/low before London open",
      "Wait for a 15-minute close beyond the Asia range at London open",
      "Confirm with rising volume/momentum on the break",
    ],
    exitRules: [
      "Initial stop at the Asia range midpoint",
      "Trail stop to the prior swing after 1R",
      "Full exit before New York overlap begins",
    ],
    notes: "Core strategy. Best performance in the first two hours of London.",
    winRate: 69,
    tag: "core",
  },
  {
    id: "s-2",
    name: "NY Session Continuation",
    category: "New York session",
    entryRules: [
      "Only when London trend is intact into the NY open",
      "Enter on a shallow pullback during the London/NY overlap",
    ],
    exitRules: ["Stop below the pullback low", "Exit on loss of the intraday trendline"],
    notes: "Works best on days with a clear directional London session.",
    winRate: 61,
    tag: "core",
  },
  {
    id: "s-3",
    name: "Liquidity Sweep",
    category: "Multi-session",
    entryRules: [
      "Wait for a sweep of a well-defined prior session high or low",
      "Confirm reclaim with a strong rejection candle",
      "Enter on retest of the reclaimed level",
    ],
    exitRules: ["Stop beyond the sweep wick", "Take partial at 1.5R, trail remainder"],
    notes: "Works around session opens and major news windows.",
    winRate: 64,
    tag: "core",
  },
  {
    id: "s-4",
    name: "Support/Resistance Retest",
    category: "Swing",
    entryRules: [
      "Mark higher-timeframe support/resistance zones",
      "Wait for a break and retest with rejection",
    ],
    exitRules: ["Stop beyond the zone", "Target the next structural level"],
    notes: "Needs patience — recent trades show entries taken before full confirmation.",
    winRate: 57,
    tag: "experimental",
  },
  {
    id: "s-5",
    name: "Trend Continuation",
    category: "Swing",
    entryRules: [
      "Only in pairs trending above/below the rising/falling 20 EMA",
      "Enter on a shallow pullback with reduced momentum",
    ],
    exitRules: ["Stop below/above the pullback", "Exit on a close through the 20 EMA"],
    notes: "Best on majors during a clear directional week.",
    winRate: 55,
    tag: "experimental",
  },
  {
    id: "s-6",
    name: "Gold Scalping Setup",
    category: "XAU/USD scalping",
    entryRules: [
      "Trade only during London or New York session for liquidity",
      "Enter on a momentum break of a tight opening range in XAU/USD",
    ],
    exitRules: ["Tight stop beyond the range", "Scale out in 1R increments"],
    notes: "Highest average pips per trade, but requires strict session timing.",
    winRate: 60,
    tag: "experimental",
  },
];

export const reports: ReportSummary[] = [
  {
    id: "r-daily-1",
    period: "daily",
    label: "Thursday, 3 July 2026",
    dateRange: "Jul 3, 2026",
    netPnl: 270,
    winRate: 100,
    trades: 1,
    bestTrade: 270,
    worstTrade: 270,
  },
  {
    id: "r-weekly-1",
    period: "weekly",
    label: "Week 27",
    dateRange: "Jun 29 – Jul 3, 2026",
    netPnl: 342,
    winRate: 66,
    trades: 4,
    bestTrade: 270,
    worstTrade: -68,
  },
  {
    id: "r-monthly-1",
    period: "monthly",
    label: "June 2026",
    dateRange: "Jun 1 – Jun 30, 2026",
    netPnl: 1850,
    winRate: 61,
    trades: 22,
    bestTrade: 420,
    worstTrade: -180,
  },
];

export const dashboardStats = {
  accountBalance: 48500,
  dailyPnl: 270,
  monthlyPnl: 1850,
  winRate: 64,
  riskUsedPct: 32,
  openTrades: 1,
};
