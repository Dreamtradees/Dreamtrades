"use client";

import { useState, type FormEvent } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type State =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "done"; message: string }
  | { status: "error"; message: string };

const fieldClass =
  "mt-1.5 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none ring-mark/40 focus:border-mark focus:ring-2";

export function HomeSignup() {
  const [name, setName] = useState("");
  const [telegram, setTelegram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<State>({ status: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status === "submitting" || state.status === "done") return;

    if (!name.trim()) {
      setState({ status: "error", message: "Add your name so the team knows who to ask for." });
      return;
    }
    if (!telegram.trim()) {
      setState({ status: "error", message: "Add your Telegram @username so we can reach you." });
      return;
    }
    if (!whatsapp.trim()) {
      setState({ status: "error", message: "Add your WhatsApp number so we can reach you." });
      return;
    }
    if (!consent) {
      setState({ status: "error", message: "Please confirm DreamTrades can reach out to you." });
      return;
    }

    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          telegram,
          whatsapp,
          consent,
        }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string; message?: string } | null;
      if (!res.ok) {
        setState({
          status: "error",
          message: data?.error || "Could not save that. Try again in a moment.",
        });
        return;
      }
      setState({
        status: "done",
        message:
          data?.message ||
          "Saved. The DreamTrades team will reach out by hand — nothing is sent to you automatically.",
      });
    } catch {
      setState({
        status: "error",
        message: "Network error — check your connection and try again.",
      });
    }
  }

  return (
    <section id="vip" className="scroll-mt-8 border-t border-ink/10 bg-sheet/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-mark">DreamTrades VIP</p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Leave your details. A person writes back.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70 md:text-lg">
            Share your name, Telegram, and WhatsApp. DreamTrades saves them on the lead desk so the
            team can contact you about the course and the VIP room.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/65">
            Your details are sent to DreamTrades and stored. They do not stay only in this browser.
            Nothing is messaged back to you on its own — a person on the team copies a note and
            sends it by hand.
          </p>
        </div>

        {state.status === "done" ? (
          <div
            className="rounded-md border border-mark/40 bg-[color-mix(in_srgb,#0f9f8a_12%,white)] p-5"
            data-testid="home-signup-done"
            role="status"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">Saved</p>
            <p className="mt-2 font-heading text-lg font-semibold tracking-tight text-ink">
              You’re on the list.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">{state.message}</p>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="rounded-md border border-ink/10 bg-white/80 p-5"
            data-testid="home-signup"
            noValidate
          >
            <p className="font-heading text-lg font-semibold tracking-tight text-ink">
              Tell DreamTrades how to reach you
            </p>
            <div className="mt-5 grid gap-4">
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
                  Name
                </span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  required
                  className={fieldClass}
                  data-testid="signup-name"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
                  Telegram @username
                </span>
                <input
                  type="text"
                  name="telegram"
                  autoComplete="username"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  maxLength={64}
                  required
                  placeholder="@yourhandle"
                  className={fieldClass}
                  data-testid="signup-telegram"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
                  WhatsApp number
                </span>
                <input
                  type="tel"
                  name="whatsapp"
                  autoComplete="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  maxLength={32}
                  required
                  placeholder="+1234567890"
                  className={fieldClass}
                  data-testid="signup-whatsapp"
                />
              </label>
            </div>
            <label className="mt-4 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 size-4 accent-[var(--mark)]"
                data-testid="signup-consent"
              />
              <span className="text-sm leading-relaxed text-ink/70">
                DreamTrades may contact me on Telegram or WhatsApp. I understand a person sends
                that message.
              </span>
            </label>
            {state.status === "error" ? (
              <p className="mt-3 text-sm font-medium text-flare" role="alert" data-testid="signup-error">
                {state.message}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={state.status === "submitting"}
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-5 rounded-md bg-mark px-5 text-[#041512] hover:bg-[#14b8a0] disabled:opacity-60",
              )}
              data-testid="signup-submit"
            >
              {state.status === "submitting" ? "Saving…" : "Send my details"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
