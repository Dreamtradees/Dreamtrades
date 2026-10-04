import { redisConfigured } from "@/lib/completions-store";
import { telegramEnvConfigured } from "@/lib/telegram-notify";

/** True when the claim form can accept a submit on this deployment. */
export function completionsAccepting(): boolean {
  if (telegramEnvConfigured() || redisConfigured()) return true;
  // Local/dev only — memory store so the form can be exercised without secrets.
  return (
    process.env.NODE_ENV === "development" ||
    process.env.COMPLETIONS_ALLOW_MEMORY === "1"
  );
}
