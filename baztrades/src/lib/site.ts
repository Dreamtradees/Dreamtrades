export const BRAND_NAME = "Baz Trades";
export const BRAND_TAGLINE = "Walk onto the floor with a plan — not a tip.";
export const BRAND_BLURB =
  "Baz Trades teaches newbies the real mechanics: direction, pairs, candles, supply & demand, and risk — then a hard checklist before you click.";

/**
 * Community join links shown after the learn checklist is complete.
 * Prefer non-empty env overrides; placeholders until Baz sets live invites.
 */
/** Leave empty until Baz sets real invite URLs (or use NEXT_PUBLIC_* env). */
export const TELEGRAM_VIP_URL_CONSTANT = "";

export const WHATSAPP_GROUP_URL_CONSTANT = "";

export const DISCORD_URL_CONSTANT = "";

export const INSTAGRAM_URL_CONSTANT = "";

function publicUrl(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export const TELEGRAM_VIP_URL = publicUrl(
  process.env.NEXT_PUBLIC_TELEGRAM_VIP_URL,
  TELEGRAM_VIP_URL_CONSTANT,
);

export const WHATSAPP_GROUP_URL = publicUrl(
  process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL,
  WHATSAPP_GROUP_URL_CONSTANT,
);

export const DISCORD_URL = publicUrl(
  process.env.NEXT_PUBLIC_DISCORD_URL,
  DISCORD_URL_CONSTANT,
);

export const INSTAGRAM_URL = publicUrl(
  process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  INSTAGRAM_URL_CONSTANT,
);
