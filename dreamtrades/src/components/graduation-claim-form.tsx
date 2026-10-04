"use client";

import { useState, type FormEvent } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "done"; count: number | null }
  | { status: "error"; message: string };

export function GraduationClaimForm({ className }: { className?: string }) {
  const [name, setName] = useState("");
  const [telegram, setTelegram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status === "submitting" || state.status === "done") return;

    const telegramTrimmed = telegram.trim();
    const whatsappTrimmed = whatsapp.trim();

    if (!telegramTrimmed) {
      setState({
        status: "error",
        message: "Add your Telegram @username so we can reach you.",
      });
      return;
    }

    if (!whatsappTrimmed) {
      setState({
        status: "error",
        message: "Add your WhatsApp number so we can reach you.",
      });
      return;
    }

    if (!consent) {
      setState({
        status: "error",
        message: "Please confirm we can reach out to you.",
      });
      return;
    }

    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          telegram: telegramTrimmed,
          whatsapp: whatsappTrimmed,
          note,
          consent,
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { error?: string; count?: number; message?: string }
        | null;

      if (!res.ok) {
        setState({
          status: "error",
          message: data?.error || "Could not submit. Try again in a moment.",
        });
        return;
      }

      setState({
        status: "done",
        count: typeof data?.count === "number" ? data.count : null,
      });
    } catch {
      setState({
        status: "error",
        message: "Network error — check your connection and try again.",
      });
    }
  }

  if (state.status === "done") {
    return (
      <div
        className={cn(
          "rounded-md border border-mark/40 bg-[color-mix(in_srgb,#0f9f8a_12%,white)] p-5",
          className,
        )}
        data-testid="graduation-claim-done"
        role="status"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">Counted</p>
        <p className="mt-2 font-heading text-lg font-semibold tracking-tight text-ink">
          You’re counted — we’ll reach out.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink/65">
          Join the rooms above while you wait. We’ll contact you on Telegram and WhatsApp.
          {state.count != null ? ` You’re graduate #${state.count}.` : ""}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "rounded-md border border-ink/10 bg-white/75 p-5",
        className,
      )}
      data-testid="graduation-claim-form"
      noValidate
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">
        Get counted
      </p>
      <p className="mt-2 font-heading text-lg font-semibold tracking-tight text-ink">
        Tell us how to reach you
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink/65">
        Finish line claim — name optional. Telegram <span className="font-medium text-ink">and</span>{" "}
        WhatsApp are both required so we can reach you on either channel.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
            Name <span className="normal-case tracking-normal">(optional)</span>
          </span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            className="mt-1.5 w-full rounded-md border border-ink/15 bg-[#f4f7f8] px-3 py-2 text-sm text-ink outline-none ring-mark/40 focus:border-mark focus:ring-2"
            placeholder="Your name"
            data-testid="claim-name"
          />
        </label>

        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
            Telegram @username <span className="normal-case tracking-normal">(required)</span>
          </span>
          <input
            type="text"
            name="telegram"
            autoComplete="username"
            required
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            maxLength={64}
            className="mt-1.5 w-full rounded-md border border-ink/15 bg-[#f4f7f8] px-3 py-2 text-sm text-ink outline-none ring-mark/40 focus:border-mark focus:ring-2"
            placeholder="@yourhandle"
            data-testid="claim-telegram"
          />
        </label>

        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
            WhatsApp number <span className="normal-case tracking-normal">(required)</span>
          </span>
          <input
            type="tel"
            name="whatsapp"
            autoComplete="tel"
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            maxLength={32}
            className="mt-1.5 w-full rounded-md border border-ink/15 bg-[#f4f7f8] px-3 py-2 text-sm text-ink outline-none ring-mark/40 focus:border-mark focus:ring-2"
            placeholder="+1234567890"
            data-testid="claim-whatsapp"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
            Note <span className="normal-case tracking-normal">(optional)</span>
          </span>
          <textarea
            name="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={500}
            rows={3}
            className="mt-1.5 w-full resize-y rounded-md border border-ink/15 bg-[#f4f7f8] px-3 py-2 text-sm text-ink outline-none ring-mark/40 focus:border-mark focus:ring-2"
            placeholder="Anything we should know?"
            data-testid="claim-note"
          />
        </label>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 size-4 accent-[var(--mark)]"
          data-testid="claim-consent"
        />
        <span className="text-sm leading-relaxed text-ink/70">
          It’s OK to contact me on the details I shared about DreamTrades.
        </span>
      </label>

      {state.status === "error" && (
        <p
          className="mt-3 text-sm font-medium text-flare"
          role="alert"
          data-testid="claim-error"
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={state.status === "submitting"}
        className={cn(
          buttonVariants({ size: "lg" }),
          "mt-5 w-full rounded-md bg-mark text-[#041512] hover:bg-[#14b8a0] disabled:opacity-60 sm:w-auto",
        )}
        data-testid="claim-submit"
      >
        {state.status === "submitting" ? "Sending…" : "Count me in"}
      </button>
    </form>
  );
}
