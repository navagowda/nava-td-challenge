# NAVA Phase 3.1 — MT5 Setup

## 1) Supabase
Run `supabase/mt5_phase3.sql` once in the Supabase SQL Editor.

## 2) Vercel
Confirm this variable exists:

`MT5_WEBHOOK_SECRET` = a long random private string

Redeploy after changing it.

## 3) MT5
1. Copy `mt5/NavaSync.mq5` into `MQL5/Experts`.
2. Open MetaEditor (F4), open NavaSync and compile (F7). It must show 0 errors.
3. MT5 → Tools → Options → Expert Advisors.
4. Enable **Allow WebRequest for listed URL**.
5. Add `https://nava-td-challenge.vercel.app`.
6. Drag NavaSync onto one chart.
7. Set `SharedSecret` to exactly the same value as Vercel `MT5_WEBHOOK_SECRET`.
8. Enable Algo Trading.

The EA syncs account data and open positions every 10 seconds, and closed trades into the existing `trades` table.
