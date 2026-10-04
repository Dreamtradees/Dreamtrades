import type { Metadata } from "next";
import { BRAND_BLURB, BRAND_NAME, BRAND_TAGLINE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: `${BRAND_NAME} — Learn how to trade`,
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
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
