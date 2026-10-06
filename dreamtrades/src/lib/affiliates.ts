/**
 * Affiliate / partner registry.
 * Face brands (like SARA TRADING FX) own the public funnel UI;
 * DreamTrades stays the silent backend (leads, notify, curriculum engine).
 *
 * Share link:  https://dreamtrades.vercel.app/with/SLUG
 * Her CRM:     https://dreamtrades.vercel.app/partners/SLUG?key=HER_PORTAL_SECRET
 *
 * Portal secrets: set AFFILIATE_<SLUG>_SECRET in Vercel (e.g. AFFILIATE_SARA_SECRET).
 */

export type Affiliate = {
  /** URL-safe code used in ?ref= and /with/[slug] */
  slug: string;
  /** Public brand — hero-level name on her landing + funnel chrome */
  name: string;
  /** Short eyebrow above the brand */
  eyebrow: string;
  /** Main headline under the brand (her voice) */
  tagline: string;
  /** Supporting sentence on her landing */
  blurb: string;
  /** Primary CTA label */
  ctaLabel: string;
  /** Footer line (no DreamTrades mention) */
  footerNote: string;
  /** When true, AFFILIATE_<SLUG>_ADMIN_SECRET opens /admin/completions for HER attributed leads only. */
  teamAdmin?: boolean;
};

/** Registered partners — edit/add as affiliates join. */
export const AFFILIATES: Affiliate[] = [
  {
    slug: "sara",
    name: "SARA TRADING FX",
    eyebrow: "Sara’s trading group · fundamentals first",
    tagline: "Learn how to trade with the Sara crew — not how to chase signals.",
    blurb:
      "Seven plain-English lessons, a hard checklist, then your seat with SARA TRADING FX. Built for newbies who want judgment, not tip spam.",
    ctaLabel: "Start with Sara",
    footerNote: "Education for the SARA TRADING FX group. Not financial advice.",
    teamAdmin: true,
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
