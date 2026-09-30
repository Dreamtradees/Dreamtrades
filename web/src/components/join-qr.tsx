"use client";

import { QRCodeSVG } from "qrcode.react";
import { TELEGRAM_GROUP_URL } from "@/lib/site";

export function JoinQr() {
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <a
        href={TELEGRAM_GROUP_URL}
        target="_blank"
        rel="noreferrer"
        className="rounded-sm border border-[#f4efe4]/20 bg-[#f4efe4] p-3 transition-transform hover:-translate-y-0.5"
        aria-label="Scan to open the DreamTrades Telegram group"
      >
        <QRCodeSVG
          value={TELEGRAM_GROUP_URL}
          size={148}
          level="M"
          bgColor="#f4efe4"
          fgColor="#10231f"
          marginSize={0}
        />
      </a>
      <div className="max-w-xs">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#e8c089]">
          Scan to join
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#f4efe4]/75">
          Point your camera at the code — it opens the DreamTrades Telegram
          group automatically.
        </p>
        <a
          href={TELEGRAM_GROUP_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block font-mono text-xs text-[#e8c089] underline-offset-4 hover:underline"
        >
          Or tap to open the group
        </a>
      </div>
    </div>
  );
}
