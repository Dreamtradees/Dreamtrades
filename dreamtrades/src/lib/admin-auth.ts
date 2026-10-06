import { AFFILIATES, getAffiliate, normalizeAffiliateSlug } from "@/lib/affiliates";
import type { CompletionRecord } from "@/lib/completions";

/** Env var for a face-brand team admin (sees all leads on /admin/completions). */
export function affiliateAdminSecretEnvKey(slug: string): string {
  const normalized = normalizeAffiliateSlug(slug);
  return `AFFILIATE_${normalized.replace(/-/g, "_").toUpperCase()}_ADMIN_SECRET`;
}

export function teamAdminSlugs(): string[] {
  return AFFILIATES.filter((a) => a.teamAdmin).map((a) => a.slug);
}

/**
 * Owner ADMIN_SECRET or AFFILIATE_<slug>_ADMIN_SECRET for affiliates with teamAdmin.
 */
export function adminAccessAuthorized(key: string | undefined): boolean {
  const k = key?.trim();
  if (!k) return false;

  const owner = process.env.ADMIN_SECRET?.trim();
  if (owner && k === owner) return true;

  for (const affiliate of AFFILIATES) {
    if (!affiliate.teamAdmin) continue;
    const envKey = affiliateAdminSecretEnvKey(affiliate.slug);
    const teamSecret = process.env[envKey]?.trim();
    if (teamSecret && k === teamSecret) return true;
  }

  return false;
}

/** Which team admin slug unlocked this key, if any (not owner). */
export function teamAdminActorSlug(key: string | undefined): string | null {
  const k = key?.trim();
  if (!k) return null;
  if (process.env.ADMIN_SECRET?.trim() === k) return null;

  for (const affiliate of AFFILIATES) {
    if (!affiliate.teamAdmin) continue;
    const envKey = affiliateAdminSecretEnvKey(affiliate.slug);
    const teamSecret = process.env[envKey]?.trim();
    if (teamSecret && k === teamSecret) return affiliate.slug;
  }
  return null;
}

/**
 * Team admins only see leads from their start date onward (owner keeps full history).
 */
export function filterLeadsForTeamAdmin(
  items: CompletionRecord[],
  teamSlug: string | null,
): CompletionRecord[] {
  if (!teamSlug) return items;
  const since = getAffiliate(teamSlug)?.teamAdminSince?.trim();
  if (!since) return items;
  const sinceMs = Date.parse(since);
  if (Number.isNaN(sinceMs)) return items;
  return items.filter((item) => {
    const t = Date.parse(item.createdAt);
    return !Number.isNaN(t) && t >= sinceMs;
  });
}
