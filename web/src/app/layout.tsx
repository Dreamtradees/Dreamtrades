import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LJ CIRCLE — Attentive gold & forex desk",
  description:
    "LJ CIRCLE is an attentive trading desk for XAUUSD and majors — live prices, TradingView charts, and a focused Telegram circle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&family=Source+Sans+3:wght@400;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://s3.tradingview.com" />
        <link rel="dns-prefetch" href="https://s3.tradingview.com" />
        <link rel="preconnect" href="https://api.gold-api.com" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
