import type { ReactNode } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

type Section = "desk" | "scripts" | "guide";

const LINKS: { id: Section; label: string; href: string }[] = [
  { id: "desk", label: "Desk", href: "/admin/crm" },
  { id: "scripts", label: "Scripts", href: "/admin/crm/scripts" },
  { id: "guide", label: "How to use", href: "/admin/crm/guide" },
];

export function CrmShell({
  adminKey,
  current,
  children,
}: {
  adminKey: string;
  current: Section;
  children: ReactNode;
}) {
  const query = `?key=${encodeURIComponent(adminKey)}`;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-mark">DreamTrades · Admin</p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Lead desk
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
              Private book for DreamTrades. The team copies a script and sends it by hand.
              Nothing here messages a client on its own.
            </p>
          </div>
          <nav className="flex flex-wrap gap-2" aria-label="Lead desk sections">
            {LINKS.map((link) => (
              <Link
                key={link.id}
                href={`${link.href}${query}`}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium",
                  current === link.id
                    ? "bg-ink text-[#f4f7f8]"
                    : "border border-ink/10 bg-white/70 text-ink/70 hover:text-ink",
                )}
                aria-current={current === link.id ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/admin/completions${query}`}
              className="rounded-md border border-ink/10 bg-white/70 px-3 py-2 text-sm font-medium text-ink/70 hover:text-ink"
            >
              Graduates list
            </Link>
          </nav>
        </div>
        <div className="mt-8">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}

export function CrmLocked() {
  const adminSecretSet = Boolean(process.env.ADMIN_SECRET?.trim());
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-12 md:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-mark">DreamTrades · Admin</p>
        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-ink">Lead desk</h1>
        <div
          className="mt-8 rounded-md border border-flare/30 bg-[color-mix(in_srgb,#e85d4c_8%,white)] p-5"
          data-testid="crm-unauthorized"
        >
          <p className="font-heading text-lg font-semibold text-ink">Unauthorized</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/65">
            Open this page with{" "}
            <code className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[12px]">
              /admin/crm?key=YOUR_ADMIN_SECRET
            </code>
            . The key has to match <span className="font-mono text-[12px]">ADMIN_SECRET</span>.
            {!adminSecretSet ? (
              <>
                {" "}
                <span className="font-medium text-flare">
                  ADMIN_SECRET is not set on this deployment yet.
                </span>
              </>
            ) : null}
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
