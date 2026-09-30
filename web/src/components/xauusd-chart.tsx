"use client";

import { useEffect, useRef } from "react";

type Props = {
  height?: number;
};

export function XauusdChart({ height = 520 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";
    const widgetHost = document.createElement("div");
    widgetHost.className = "tradingview-widget-container__widget";
    widgetHost.style.height = "100%";
    widgetHost.style.width = "100%";
    container.appendChild(widgetHost);

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "OANDA:XAUUSD",
      interval: "15",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      backgroundColor: "rgba(238, 244, 240, 1)",
      gridColor: "rgba(16, 35, 31, 0.08)",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: false,
      calendar: false,
      support_host: "https://www.tradingview.com",
      withdateranges: true,
      range: "5D",
    });
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div
      className="tradingview-widget-container overflow-hidden rounded-sm border border-ink/10 bg-[color-mix(in_srgb,white_70%,transparent)]"
      style={{ height }}
    >
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
