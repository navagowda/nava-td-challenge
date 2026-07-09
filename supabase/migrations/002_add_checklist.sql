-- Run this once in the Supabase SQL Editor after schema.sql.
-- Adds pre-trade checklist tracking used by the Add Trade form and the
-- 50-Trade Challenge's Discipline % stat.

alter table public.trades
  add column if not exists checklist jsonb,
  add column if not exists checklist_pct numeric;
