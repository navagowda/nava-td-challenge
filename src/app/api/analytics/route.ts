import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
const num = (v: unknown) => Number(v ?? 0);
const monthLabel = (key: string) => new Date(`${key}-01T00:00:00Z`).toLocaleDateString("en-US", { month: "short", year: "2-digit" });

export async function GET() {
  try {
    const supabase = createClient();
    const [{ data: accounts, error: accountError }, { data: trades, error: tradesError }] = await Promise.all([
      supabase.from("mt5_accounts").select("*").order("last_sync", { ascending: false }).limit(1),
      supabase.from("trades").select("*").eq("status", "closed").order("date", { ascending: true }).order("created_at", { ascending: true }),
    ]);
    if (accountError) throw accountError;
    if (tradesError) throw tradesError;
    const account = accounts?.[0] ?? null;
    const closed = trades ?? [];
    const totalPnl = closed.reduce((s, t) => s + num(t.pnl), 0);
    const wins = closed.filter((t) => num(t.pnl) > 0).length;
    const losses = closed.filter((t) => num(t.pnl) < 0).length;
    const winRate = closed.length ? (wins / closed.length) * 100 : 0;
    const pipsTrades = closed.filter((t) => t.pips !== null && t.pips !== undefined);
    const avgPips = pipsTrades.length ? pipsTrades.reduce((s, t) => s + num(t.pips), 0) / pipsTrades.length : 0;
    const pairMap = new Map<string, any>(); const sessionMap = new Map<string, any>(); const strategyMap = new Map<string, any>(); const monthlyMap = new Map<string, number>();
    for (const t of closed) {
      const pair = String(t.pair || "Unknown"), session = String(t.session || "Unspecified"), strategy = String(t.strategy || "MT5 auto-sync"), pnl = num(t.pnl);
      const pr = pairMap.get(pair) ?? { pair, pnl: 0, trades: 0, wins: 0, pips: 0, pipsCount: 0 }; pr.pnl += pnl; pr.trades++; if (pnl > 0) pr.wins++; if (t.pips !== null && t.pips !== undefined) { pr.pips += num(t.pips); pr.pipsCount++; } pairMap.set(pair, pr);
      const sr = sessionMap.get(session) ?? { session, pnl: 0, trades: 0, wins: 0 }; sr.pnl += pnl; sr.trades++; if (pnl > 0) sr.wins++; sessionMap.set(session, sr);
      const tr = strategyMap.get(strategy) ?? { strategy, pnl: 0, trades: 0, wins: 0 }; tr.pnl += pnl; tr.trades++; if (pnl > 0) tr.wins++; strategyMap.set(strategy, tr);
      const month = String(t.date).slice(0, 7); monthlyMap.set(month, (monthlyMap.get(month) ?? 0) + pnl);
    }
    const pairPerformance = Array.from(pairMap.values()).map((r: any) => ({ ...r, winRate: r.trades ? (r.wins / r.trades) * 100 : 0, avgPips: r.pipsCount ? r.pips / r.pipsCount : 0 })).sort((a: any,b: any)=>b.pnl-a.pnl);
    const sessionPerformance = Array.from(sessionMap.values()).map((r: any)=>({ ...r, winRate: r.trades ? (r.wins/r.trades)*100 : 0 })).sort((a:any,b:any)=>b.pnl-a.pnl);
    const strategyPerformance = Array.from(strategyMap.values()).map((r: any)=>({ ...r, winRate: r.trades ? (r.wins/r.trades)*100 : 0 })).sort((a:any,b:any)=>b.pnl-a.pnl);
    const balance = num(account?.balance); let running = balance - totalPnl; let peak = running;
    const equityCurve: any[] = [], drawdown: any[] = []; const byDate = new Map<string, number>();
    for (const t of closed) byDate.set(String(t.date), (byDate.get(String(t.date)) ?? 0) + num(t.pnl));
    for (const [date, pnl] of byDate) { running += pnl; peak = Math.max(peak, running); equityCurve.push({ date, equity: Number(running.toFixed(2)) }); drawdown.push({ date, drawdown: peak > 0 ? Number((((running-peak)/peak)*100).toFixed(2)) : 0 }); }
    if (!equityCurve.length && account) equityCurve.push({ date: new Date().toISOString().slice(0,10), equity: num(account.equity || account.balance) });
    let monthStartBalance = balance - totalPnl;
    const monthlyReturns = Array.from(monthlyMap.entries()).sort(([a],[b])=>a.localeCompare(b)).map(([month,pnl])=>{ const pct = monthStartBalance ? (pnl/monthStartBalance)*100 : 0; monthStartBalance += pnl; return { month: monthLabel(month), pnl: Number(pnl.toFixed(2)), returnPct: Number(pct.toFixed(2)) }; });
    const bestPair = pairPerformance[0] ?? { pair: "—", pnl: 0 }; const worstPair = pairPerformance.length ? pairPerformance[pairPerformance.length-1] : { pair: "—", pnl: 0 };
    const now = new Date(), today = now.toISOString().slice(0,10); const weekStart = new Date(now); weekStart.setUTCDate(now.getUTCDate()-((now.getUTCDay()+6)%7)); const monthStart = `${today.slice(0,7)}-01`;
    const makeReport = (id:string, period:"daily"|"weekly"|"monthly", label:string, start:string, end:string) => { const rows = closed.filter((t)=>String(t.date)>=start && String(t.date)<=end); const pnls=rows.map((t)=>num(t.pnl)); const rw=rows.filter((t)=>num(t.pnl)>0).length; return { id,period,label,dateRange:start===end?start:`${start} to ${end}`,netPnl:pnls.reduce((a,b)=>a+b,0),winRate:rows.length?Number(((rw/rows.length)*100).toFixed(1)):0,trades:rows.length,bestTrade:pnls.length?Math.max(...pnls):0,worstTrade:pnls.length?Math.min(...pnls):0 }; };
    const grossProfit = closed.filter(t=>num(t.pnl)>0).reduce((s,t)=>s+num(t.pnl),0); const grossLoss = Math.abs(closed.filter(t=>num(t.pnl)<0).reduce((s,t)=>s+num(t.pnl),0));
    return NextResponse.json({ summary:{avgPips,bestPair,worstPair,totalTrades:closed.length,totalPnl,winRate,profitFactor:grossLoss?grossProfit/grossLoss:grossProfit?grossProfit:0}, equityCurve,drawdown,winLoss:[{name:"Wins",value:wins},{name:"Losses",value:losses}],monthlyReturns,pairPerformance,sessionPerformance,strategyPerformance,reports:[makeReport("daily","daily","Today",today,today),makeReport("weekly","weekly","This week",weekStart.toISOString().slice(0,10),today),makeReport("monthly","monthly","This month",monthStart,today)],account:account?{balance:num(account.balance),equity:num(account.equity),floatingPnl:num(account.floating_pnl),margin:num(account.margin),freeMargin:num(account.free_margin),marginLevel:num(account.margin_level),openPositions:num(account.open_positions),currency:account.currency,lastSync:account.last_sync}:null });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load live analytics." }, { status:500 }); }
}
