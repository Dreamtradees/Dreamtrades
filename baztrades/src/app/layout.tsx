import type { Metadata } from "next";
import { BRAND_BLURB, BRAND_NAME, BRAND_TAGLINE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: `${BRAND_NAME} — Walk onto the floor with a plan`,
  description: `${BRAND_TAGLINE} ${BRAND_BLURB}`,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://s3.tradingview.com" />
        <link rel="dns-prefetch" href="https://s3.tradingview.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
