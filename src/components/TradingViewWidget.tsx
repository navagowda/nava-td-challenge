"use client";

import { useEffect, useRef } from "react";

interface TradingViewWidgetProps {
  symbol?: string;
  height?: number;
  interval?: string;
}

/**
 * Embeds TradingView's Advanced Real-Time Chart widget.
 * Docs: https://www.tradingview.com/widget/advanced-chart/
 */
export default function TradingViewWidget({
  symbol = "FX:EURUSD",
  height = 560,
  interval = "15",
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = "";

    // TradingView's autosize feature measures against a specific sibling
    // div — it must exist in the DOM before the script runs, and be
    // recreated fresh each time (not reused across re-renders).
    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget h-full w-full";
    container.current.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval,
      timezone: "Asia/Kolkata",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "rgba(10, 10, 11, 1)",
      gridColor: "rgba(38, 38, 44, 0.6)",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      support_host: "https://www.tradingview.com",
    });

    container.current.appendChild(script);
  }, [symbol, interval]);

  return (
    <div
      className="tradingview-widget-container w-full min-w-0 overflow-hidden rounded-2xl border border-void-border"
      ref={container}
      style={{ height, minHeight: height }}
    />
  );
}
