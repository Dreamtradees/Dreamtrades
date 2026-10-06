/**
 * Affiliate / partner registry for DreamTrades.
 * Add her here when you have her brand name — slug becomes her link code.
 *
 * Share link:  https://dreamtrades.vercel.app/with/SLUG
 * Her CRM:     https://dreamtrades.vercel.app/partners/SLUG?key=HER_PORTAL_SECRET
 *
 * Portal secrets: set AFFILIATE_<SLUG>_SECRET in Vercel (e.g. AFFILIATE_PARTNER_SECRET),
 * or fall back to ADMIN_SECRET for owner testing only.
 */

export type Affiliate = {
  /** URL-safe code used in ?ref= and /with/[slug] */
  slug: string;
  /** Display name in admin, Telegram DMs, partner portal */
  name: string;
  /** Short line on her landing page */
  blurb: string;
};

/** Registered partners — edit/add as affiliates join. */
export const AFFILIATES: Affiliate[] = [
  {
    slug: "partner",
    name: "Launch Partner",
    blurb:
      "Learn how to trade with DreamTrades — fundamentals first, then join the VIP room when you graduate.",
  },
];

const SLUG_RE = /^[a-z0-9][a-z0-9_-]{1,31}$/;

export function normalizeAffiliateSlug(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const slug = raw.trim().toLowerCase();
  if (!SLUG_RE.test(slug)) return "";
  return slug;
}

export function getAffiliate(slug: string): Affiliate | undefined {
  const normalized = normalizeAffiliateSlug(slug);
  if (!normalized) return undefined;
  return AFFILIATES.find((a) => a.slug === normalized);
}

/** Allow known affiliates, or any well-formed slug (captures new codes early). */
export function resolveAffiliateRef(raw: unknown): string {
  return normalizeAffiliateSlug(raw);
}

export function affiliateDisplayName(slug: string): string {
  return getAffiliate(slug)?.name ?? slug;
}

/**
 * Partner portal auth: AFFILIATE_<SLUG>_SECRET (uppercased, hyphens→underscores)
 * e.g. slug "sara-fx" → AFFILIATE_SARA_FX_SECRET
 * Falls back to ADMIN_SECRET so you can open portals while testing.
 */
export function affiliatePortalAuthorized(slug: string, key: string | undefined): boolean {
  if (!key?.trim()) return false;
  const normalized = normalizeAffiliateSlug(slug);
  if (!normalized) return false;

  const envKey = `AFFILIATE_${normalized.replace(/-/g, "_").toUpperCase()}_SECRET`;
  const partnerSecret = process.env[envKey]?.trim();
  if (partnerSecret && key.trim() === partnerSecret) return true;

  const admin = process.env.ADMIN_SECRET?.trim();
  return Boolean(admin && key.trim() === admin);
}

export const AFFILIATE_REF_STORAGE_KEY = "dreamtrades_affiliate_ref";
