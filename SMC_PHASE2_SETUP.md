# NAVA Phase 2 — Smart Money Concepts Toolkit

This update adds a manual, cloud-saved SMC annotation toolkit to the NAVA chart.

## Included tools

- BOS label
- CHoCH label
- Bullish Order Block
- Bearish Order Block
- Bullish Fair Value Gap
- Bearish Fair Value Gap
- Buy-side Liquidity line
- Sell-side Liquidity line
- Premium / Discount range with 50% equilibrium
- Existing trend line, horizontal line, rectangle and freehand tools

## How to use

1. Open **Chart**.
2. Expand the right-side **Smart Money Toolkit**, or use the movable drawing toolbar.
3. Select a tool.
4. Click once for BOS/CHoCH/liquidity tools, or drag for OB/FVG/Premium-Discount tools.
5. Select **Use chart** when finished so you can pan and interact with TradingView again.

All annotations are stored in the existing `chart_workspaces` Supabase table per user, symbol and timeframe.

## Important limitation

The current market chart is TradingView's free embedded iframe. NAVA cannot read its candle coordinates or inject custom Pine/community indicators. Therefore this update provides professional manual SMC annotations, not automatic BOS/FVG/order-block detection. The annotations persist in NAVA, but they are screen-relative overlays and do not remain anchored to exact candles after chart zooming or panning.

True candle-anchored automatic SMC detection would require replacing the iframe with a chart library that exposes candle data and drawing APIs.
