export type TradeDirection = "long" | "short";
export type TradeStatus = "open" | "closed" | "cancelled";
export type ForexSession = "London" | "New York" | "Asia";
export type TradeEmotion =
  | "Confident"
  | "Calm"
  | "Neutral"
  | "Fearful"
  | "Greedy"
  | "Frustrated";

export interface Trade {
  id: string;
  date: string;
  pair: string;
  session: ForexSession;
  direction: TradeDirection;
  entry: number;
  exit: number | null;
  stopLoss: number;
  takeProfit: number;
  lotSize: number;
  pips: number | null;
  riskPct: number;
  rr: number;
  pnl: number | null;
  status: TradeStatus;
  strategy: string;
  emotion: TradeEmotion;
  notes: string;
  screenshotName?: string;
  checklist?: Record<string, boolean>;
  checklistPct?: number;
}

export interface EquityPoint {
  date: string;
  equity: number;
}

export interface MonthlyReturn {
  month: string;
  returnPct: number;
}

export interface StrategyPerformance {
  strategy: string;
  winRate: number;
  trades: number;
  pnl: number;
}

export interface Strategy {
  id: string;
  name: string;
  category: string;
  entryRules: string[];
  exitRules: string[];
  notes: string;
  winRate: number;
  tag: "core" | "experimental" | "retired";
}

export interface ReportSummary {
  id: string;
  period: "daily" | "weekly" | "monthly";
  label: string;
  dateRange: string;
  netPnl: number;
  winRate: number;
  trades: number;
  bestTrade: number;
  worstTrade: number;
}

export interface WatchlistItem {
  pair: string;
  price: number;
  changePct: number;
  session: ForexSession;
}

export interface PairPerformance {
  pair: string;
  trades: number;
  winRate: number;
  pnl: number;
  avgPips: number;
}

export interface SessionPerformance {
  session: ForexSession;
  trades: number;
  winRate: number;
  pnl: number;
}
