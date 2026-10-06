"use client";

import { useEffect } from "react";
import { AFFILIATE_REF_STORAGE_KEY, normalizeAffiliateSlug } from "@/lib/affiliates";

/**
 * Persists ?ref= from the URL into sessionStorage so the claim form
 * still attributes the lead after they browse /learn.
 */
export function AffiliateRefCapture() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const fromQuery = normalizeAffiliateSlug(params.get("ref") ?? "");
    if (fromQuery) {
      try {
        sessionStorage.setItem(AFFILIATE_REF_STORAGE_KEY, fromQuery);
      } catch {
        /* ignore quota / private mode */
      }
    }
  }, []);

  return null;
}

export function readStoredAffiliateRef(): string {
  if (typeof window === "undefined") return "";
  try {
    return normalizeAffiliateSlug(sessionStorage.getItem(AFFILIATE_REF_STORAGE_KEY) ?? "");
  } catch {
    return "";
  }
}
