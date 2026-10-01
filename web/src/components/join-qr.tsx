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
        className="rounded-sm border border-[#c4a35a]/40 bg-[#f4f7fb] p-3 transition-transform hover:-translate-y-0.5"
        aria-label="Scan to open the LJ CIRCLE Telegram group"
      >
        <QRCodeSVG
          value={TELEGRAM_GROUP_URL}
          size={160}
          level="M"
          bgColor="#f4f7fb"
          fgColor="#0a1628"
          marginSize={0}
        />
      </a>
      <div className="max-w-xs">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#c4a35a]">
          Scan to join
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#f4f7fb]/75">
          Camera opens the LJ CIRCLE Telegram group automatically — same link as
          the button.
        </p>
        <a
          href={TELEGRAM_GROUP_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block font-mono text-xs text-[#c4a35a] underline-offset-4 hover:underline"
        >
          Or tap to open the group
        </a>
      </div>
    </div>
  );
}
