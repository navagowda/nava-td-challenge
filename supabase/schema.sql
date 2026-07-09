-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query)

create table if not exists public.trades (
  id text primary key,
  date date not null,
  pair text not null,
  session text not null,
  direction text not null,
  entry numeric not null,
  exit numeric,
  stop_loss numeric not null default 0,
  take_profit numeric not null default 0,
  lot_size numeric not null default 0,
  pips numeric,
  risk_pct numeric not null default 0,
  rr numeric not null default 0,
  pnl numeric,
  status text not null default 'open',
  strategy text not null default '',
  emotion text not null default 'Neutral',
  notes text not null default '',
  screenshot_name text,
  created_at timestamptz not null default now()
);

alter table public.trades enable row level security;

-- This is a single-user private workspace, so any authenticated session
-- (i.e. you, logged in) can read/write all rows.
create policy "Authenticated users can read trades"
  on public.trades for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert trades"
  on public.trades for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update trades"
  on public.trades for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete trades"
  on public.trades for delete
  using (auth.role() = 'authenticated');
