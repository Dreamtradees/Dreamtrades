"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Desktop target height; mobile uses a shorter CSS clamp. */
  height?: number;
  /** overview = lighter symbol widget; advanced = full TradingView chart */
  variant?: "overview" | "advanced";
};

export function XauusdChart({ height = 480, variant = "advanced" }: Props) {
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
      { rootMargin: "200px 0px", threshold: 0.01 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const container = hostRef.current;
    if (!container) return;

    let cancelled = false;
    container.innerHTML = "";
    setReady(false);

    const widgetHost = document.createElement("div");
    widgetHost.className = "tradingview-widget-container__widget h-full w-full";
    container.appendChild(widgetHost);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;

    if (variant === "advanced") {
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: "OANDA:XAUUSD",
        interval: "15",
        timezone: "Etc/UTC",
        theme: "light",
        style: "1",
        locale: "en",
        backgroundColor: "rgba(247, 249, 251, 1)",
        gridColor: "rgba(17, 22, 29, 0.08)",
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        calendar: false,
        allow_symbol_change: false,
        support_host: "https://www.tradingview.com",
        withdateranges: true,
        range: "1D",
      });
    } else {
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
      script.innerHTML = JSON.stringify({
        symbols: [["XAUUSD", "OANDA:XAUUSD|1D"]],
        chartOnly: false,
        width: "100%",
        height: "100%",
        locale: "en",
        colorTheme: "light",
        autosize: true,
        showVolume: false,
        showMA: false,
        hideDateRanges: false,
        hideMarketStatus: false,
        hideSymbolLogo: false,
        scalePosition: "right",
        scaleMode: "Normal",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "10",
        noTimeScale: false,
        valuesTracking: "1",
        changeMode: "price-and-percent",
        chartType: "area",
        lineWidth: 2,
        lineType: 0,
        dateRanges: ["1d|1", "1m|30", "3m|60", "12m|1D", "60m|1W", "all|1M"],
        color: "rgba(15, 159, 138, 1)",
      });
    }

    const markReady = () => {
      if (!cancelled) setReady(true);
    };
    script.onload = markReady;
    const readyTimer = window.setTimeout(markReady, 1400);

    container.appendChild(script);

    return () => {
      cancelled = true;
      window.clearTimeout(readyTimer);
      container.innerHTML = "";
    };
  }, [visible, variant]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-md border border-ink/10 bg-[color-mix(in_srgb,white_72%,transparent)]"
      style={{ height: `clamp(300px, 58vw, ${height}px)` }}
    >
      {!ready ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[color-mix(in_srgb,#eef2f5_94%,white)]">
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-mark">
              OANDA:XAUUSD
            </p>
            <p className="mt-2 font-heading text-lg text-ink/70">Loading live chart…</p>
          </div>
        </div>
      ) : null}
      <div
        ref={hostRef}
        className="tradingview-widget-container h-full w-full"
        aria-label="Live XAUUSD TradingView chart"
      />
    </div>
  );
}
