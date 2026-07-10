"use client";

import { useEffect, useRef } from "react";

interface TradingViewWidgetProps {
  symbol?: string;
  height?: number | string;
  interval?: string;
  studies?: string[];
}

/**
 * Embeds TradingView's Advanced Real-Time Chart widget.
 * Docs: https://www.tradingview.com/widget/advanced-chart/
 */
export default function TradingViewWidget({
  symbol = "FX:EURUSD",
  height = 560,
  interval = "15",
  studies = [],
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = "";

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
      hide_side_toolbar: false,
      hide_legend: false,
      save_image: true,
      allow_symbol_change: true,
      calendar: false,
      studies,
      support_host: "https://www.tradingview.com",
    });

    container.current.appendChild(script);
  }, [symbol, interval, studies]);

  return (
    <div
      className="tradingview-widget-container h-full w-full min-w-0 overflow-hidden rounded-xl border border-void-border"
      ref={container}
      style={{ height, minHeight: typeof height === "number" ? height : undefined }}
    />
  );
}
