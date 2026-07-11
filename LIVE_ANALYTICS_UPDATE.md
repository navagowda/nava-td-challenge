# NAVA Phase 3.3 — Live Workspace Data

This update removes remaining demo data from:
- Analytics
- Reports
- Risk Management
- Strategy Vault

It adds `/api/analytics`, which calculates all statistics from the existing Supabase `trades` and `mt5_accounts` tables.

No new SQL is required.

Upload this complete project to GitHub and allow Vercel to redeploy. Keep MT5 and NavaSync running for updates every 10 seconds.
