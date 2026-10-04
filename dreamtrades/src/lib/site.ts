export const BRAND_NAME = "DreamTrades";
export const BRAND_TAGLINE = "Learn how to trade — not how to take signals.";
export const BRAND_BLURB =
  "Simple fundamentals for newbies: direction, pairs, candles, supply & demand, risk, and a checklist before you click.";

/**
 * Community join links shown after the learn checklist is complete.
 * Prefer non-empty env overrides; always fall back to the live invite URLs.
 */
export const TELEGRAM_VIP_URL_CONSTANT = "https://t.me/+BMI1xqg1TDwyYmQ8";

export const WHATSAPP_GROUP_URL_CONSTANT =
  "https://chat.whatsapp.com/JP4a2T2bpi17mdneoLVoUN?mode=gi_t";

/** Discord invite — set when you paste the live link. */
export const DISCORD_URL_CONSTANT = "";

/** Instagram profile — set when you paste the live link. */
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
