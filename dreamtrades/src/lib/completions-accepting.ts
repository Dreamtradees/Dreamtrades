import { localFileStoreActive, redisConfigured } from "@/lib/completions-store";
import { telegramEnvConfigured } from "@/lib/telegram-notify";

/** True when the claim form can accept a submit on this deployment. */
export function completionsAccepting(): boolean {
  if (telegramEnvConfigured() || redisConfigured()) return true;
  // Local/dev — file or memory store so the form can be exercised without secrets.
  if (localFileStoreActive()) return true;
  return (
    process.env.NODE_ENV === "development" ||
    process.env.COMPLETIONS_ALLOW_MEMORY === "1"
  );
}
