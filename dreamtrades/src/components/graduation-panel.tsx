"use client";

import { QRCodeSVG } from "qrcode.react";
import { TELEGRAM_VIP_URL, WHATSAPP_GROUP_URL } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Channel = {
  id: string;
  label: string;
  hint: string;
  href: string;
  emptyLabel: string;
};

const CHANNELS: Channel[] = [
  {
    id: "telegram",
    label: "Telegram VIP group",
    hint: "Scan or open the VIP room — continue with the crew.",
    href: TELEGRAM_VIP_URL,
    emptyLabel: "Telegram VIP link coming soon",
  },
  {
    id: "whatsapp",
    label: "WhatsApp group",
    hint: "Scan or open WhatsApp — stay in the loop.",
    href: WHATSAPP_GROUP_URL,
    emptyLabel: "WhatsApp group link coming soon",
  },
];

export function GraduationPanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-rise mt-6 rounded-md border border-mark/35 bg-gradient-to-br from-mark/10 via-white/70 to-[#d5e0ea]/55 p-5",
        className,
      )}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">You graduated</p>
      <p className="mt-3 font-heading text-lg font-semibold leading-snug tracking-tight text-ink md:text-xl">
        Congratulations — you finally passed and understood the basic steps of trading and are now
        ready to jump into the field.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink/65">
        Join the DreamTrades rooms below. Same plan you practiced — now with the group beside you.
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {CHANNELS.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
}

function ChannelCard({ channel }: { channel: Channel }) {
  const ready = Boolean(channel.href);

  return (
    <div className="flex flex-col gap-3 rounded-md border border-ink/10 bg-white/70 p-4">
      <div>
        <p className="font-heading text-base font-semibold text-ink">{channel.label}</p>
        <p className="mt-1 text-xs leading-relaxed text-ink/55">{channel.hint}</p>
      </div>
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        {ready ? (
          <a
            href={channel.href}
            target="_blank"
            rel="noreferrer"
            className="mx-auto shrink-0 rounded-md border border-ink/10 bg-[#f4f7f8] p-2 transition-transform hover:-translate-y-0.5 sm:mx-0"
            aria-label={`Scan QR to open ${channel.label}`}
            data-testid={`qr-${channel.id}`}
          >
            <QRCodeSVG
              value={channel.href}
              size={128}
              level="M"
              bgColor="#f4f7f8"
              fgColor="#11161d"
              marginSize={0}
            />
          </a>
        ) : (
          <div
            className="mx-auto flex size-[128px] shrink-0 items-center justify-center rounded-md border border-dashed border-ink/20 bg-[#f4f7f8] px-3 text-center sm:mx-0"
            aria-hidden
          >
            <p className="font-mono text-[10px] uppercase leading-relaxed tracking-wide text-ink/40">
              QR when link is set
            </p>
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {ready ? (
            <>
              <a
                href={channel.href}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ size: "default" }),
                  "w-full rounded-md bg-mark text-[#041512] hover:bg-[#14b8a0]",
                )}
                data-testid={`join-${channel.id}`}
              >
                Open {channel.label}
              </a>
              <a
                href={channel.href}
                target="_blank"
                rel="noreferrer"
                className="break-all font-mono text-[11px] leading-relaxed text-mark underline-offset-2 hover:underline"
                data-testid={`link-${channel.id}`}
              >
                {channel.href}
              </a>
            </>
          ) : (
            <span
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "w-full cursor-not-allowed rounded-md border-ink/15 bg-transparent text-ink/45 opacity-80",
              )}
              aria-disabled
            >
              {channel.emptyLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
