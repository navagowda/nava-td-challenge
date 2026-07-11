-- NAVA Phase 3.1 MT5 integration
create table if not exists public.mt5_accounts (
  account_login bigint primary key,
  server text not null default '',
  broker text not null default '',
  name text not null default '',
  currency text not null default 'USD',
  leverage integer not null default 0,
  balance numeric not null default 0,
  equity numeric not null default 0,
  margin numeric not null default 0,
  free_margin numeric not null default 0,
  margin_level numeric not null default 0,
  floating_pnl numeric not null default 0,
  open_positions integer not null default 0,
  last_sync timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.mt5_open_positions (
  id text primary key,
  account_login bigint not null,
  ticket bigint not null,
  symbol text not null,
  direction text not null,
  volume numeric not null default 0,
  open_price numeric not null default 0,
  current_price numeric not null default 0,
  stop_loss numeric not null default 0,
  take_profit numeric not null default 0,
  floating_pnl numeric not null default 0,
  open_time timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists mt5_open_positions_account_idx
on public.mt5_open_positions(account_login);

alter table public.mt5_accounts enable row level security;
alter table public.mt5_open_positions enable row level security;

drop policy if exists "Authenticated users can read mt5 accounts" on public.mt5_accounts;
create policy "Authenticated users can read mt5 accounts"
on public.mt5_accounts for select using (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can read mt5 positions" on public.mt5_open_positions;
create policy "Authenticated users can read mt5 positions"
on public.mt5_open_positions for select using (auth.role() = 'authenticated');
