# NAVA Workspace Cloud Save + Persistent Drawings

## What this update saves

The chart workspace now auto-saves to Supabase separately for every symbol and timeframe:

- NAVA drawings: trend line, horizontal line, rectangle, freehand
- Enabled indicators
- Quick notes
- Position-size calculator values
- Checklist
- Watchlist and tools panel open/closed state

The header shows `Saving…`, `Saved`, or `Save failed`.

## Required Supabase step

Before deploying the updated code:

1. Open Supabase dashboard.
2. Go to **SQL Editor** → **New query**.
3. Open `supabase/chart_workspaces.sql` from this package.
4. Paste the complete SQL and click **Run**.
5. Confirm `chart_workspaces` appears in Table Editor.

## Deploy

Replace the included files in GitHub, commit, and wait for Vercel to redeploy.

## How to draw

Use the small NAVA toolbar over the chart:

- Chart arrow: return control to TradingView
- Pencil: trend line
- Horizontal line
- Square: rectangle
- Second pencil: freehand
- Undo: remove the newest drawing
- Trash: delete all drawings for the current symbol and timeframe

Drawings are automatically stored in Supabase and restored after logout or on another device.

## Important technical limitation

These are **NAVA overlay annotations**, not TradingView-native drawings. They are saved and restored, but they are anchored to the visible chart area rather than TradingView price/time coordinates. If you pan or zoom the TradingView chart, an annotation will not follow a specific candle. TradingView-native drawings can only be persistently saved through TradingView's own logged-in layouts or its separately licensed Advanced Charts library.
