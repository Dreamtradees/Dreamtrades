"use client";

import { useEffect, useRef, useState } from "react";
import type { Market } from "@/lib/markets";

type Props = {
  market: Market;
  height?: number;
  variant?: "lite" | "full";
};

export function MarketChart({ market, height = 420, variant = "lite" }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = hostRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "180px 0px", threshold: 0.01 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const container = hostRef.current;
    if (!container) return;

    let cancelled = false;
    setReady(false);
    container.innerHTML = "";

    const widgetHost = document.createElement("div");
    widgetHost.className = "tradingview-widget-container__widget h-full w-full";
    container.appendChild(widgetHost);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;

    if (variant === "full") {
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: market.tvSymbol,
        interval: "15",
        timezone: "Etc/UTC",
        theme: "light",
        style: "1",
        locale: "en",
        backgroundColor: "rgba(238, 244, 240, 1)",
        gridColor: "rgba(16, 35, 31, 0.08)",
        hide_top_toolbar: true,
        hide_legend: true,
        save_image: false,
        calendar: false,
        allow_symbol_change: false,
        support_host: "https://www.tradingview.com",
        withdateranges: false,
        range: "1D",
      });
    } else {
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
      script.innerHTML = JSON.stringify({
        symbols: [[market.label, `${market.tvSymbol}|1D`]],
        chartOnly: false,
        width: "100%",
        height: "100%",
        locale: "en",
        colorTheme: "light",
        autosize: true,
        showVolume: false,
        showMA: false,
        hideDateRanges: false,
        hideMarketStatus: true,
        hideSymbolLogo: false,
        scalePosition: "right",
        scaleMode: "Normal",
        fontFamily: "IBM Plex Mono, sans-serif",
        fontSize: "10",
        noTimeScale: false,
        valuesTracking: "1",
        changeMode: "price-and-percent",
        chartType: "area",
        lineWidth: 2,
        lineType: 0,
        dateRanges: ["1d|1", "1m|30", "3m|60", "12m|1D", "60m|1W", "all|1M"],
        color: "rgba(31, 107, 87, 1)",
      });
    }

    const readyTimer = window.setTimeout(() => {
      if (!cancelled) setReady(true);
    }, 900);

    container.appendChild(script);

    return () => {
      cancelled = true;
      window.clearTimeout(readyTimer);
      container.innerHTML = "";
    };
  }, [visible, variant, market.id, market.label, market.tvSymbol]);

  return (
    <div
      className="relative overflow-hidden rounded-sm border border-ink/10 bg-[color-mix(in_srgb,white_70%,transparent)]"
      style={{ height }}
    >
      {!ready ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[color-mix(in_srgb,#eef4f0_92%,white)]">
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-tide">
              {market.label}
            </p>
            <p className="mt-2 font-heading text-lg text-ink/70">Loading chart…</p>
          </div>
        </div>
      ) : null}
      <div ref={hostRef} className="tradingview-widget-container h-full w-full" />
    </div>
  );
}
