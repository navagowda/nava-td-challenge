-- Persistent NAVA chart workspaces and native annotations.
-- Run once in Supabase SQL Editor.

create table if not exists public.chart_workspaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  symbol text not null,
  interval text not null,
  workspace jsonb not null default '{}'::jsonb,
  drawings jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id, symbol, interval)
);

alter table public.chart_workspaces enable row level security;

create policy "Users can read own chart workspaces"
on public.chart_workspaces for select
using (auth.uid() = user_id);

create policy "Users can insert own chart workspaces"
on public.chart_workspaces for insert
with check (auth.uid() = user_id);

create policy "Users can update own chart workspaces"
on public.chart_workspaces for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own chart workspaces"
on public.chart_workspaces for delete
using (auth.uid() = user_id);

create index if not exists chart_workspaces_user_symbol_interval_idx
on public.chart_workspaces (user_id, symbol, interval);
