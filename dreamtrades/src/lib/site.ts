export const BRAND_NAME = "DreamTrades";
export const BRAND_TAGLINE = "Learn how to trade — not how to take signals.";
export const BRAND_BLURB =
  "Simple fundamentals for newbies: direction, pairs, candles, supply & demand, risk, and a checklist before you click.";

/**
 * Community join links shown after the learn checklist is complete.
 * Prefer env overrides; fall back to the named constants below.
 */
export const TELEGRAM_VIP_URL_CONSTANT = "https://t.me/+BMI1xqg1TDwyYmQ8";

export const WHATSAPP_GROUP_URL_CONSTANT =
  "https://chat.whatsapp.com/JP4a2T2bpi17mdneoLVoUN?mode=gi_t";

export const TELEGRAM_VIP_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_VIP_URL?.trim() || TELEGRAM_VIP_URL_CONSTANT;

export const WHATSAPP_GROUP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL?.trim() || WHATSAPP_GROUP_URL_CONSTANT;
