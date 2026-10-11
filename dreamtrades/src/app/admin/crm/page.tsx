import { CrmShell, CrmLocked } from "@/components/crm/crm-shell";
import { CrmWorkspace } from "@/components/crm/crm-workspace";
import { ownerAdminAuthorized } from "@/lib/admin-auth";
import { listCrmLeads } from "@/lib/crm-store";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ key?: string }>;
};

export default async function CrmPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const key = params.key?.trim() || "";
  if (!ownerAdminAuthorized(key)) {
    return <CrmLocked />;
  }

  let loadError: string | null = null;
  let leads: Awaited<ReturnType<typeof listCrmLeads>>["leads"] = [];
  let durable = false;
  let backend = "memory";

  try {
    const data = await listCrmLeads();
    leads = data.leads;
    durable = data.durable;
    backend = data.backend;
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Failed to load the desk";
  }

  return (
    <CrmShell adminKey={key} current="desk">
      {loadError ? (
        <p className="text-sm font-medium text-flare" role="alert">
          {loadError}
        </p>
      ) : (
        <CrmWorkspace
          initialLeads={leads}
          adminKey={key}
          durable={durable}
          backend={backend}
        />
      )}
    </CrmShell>
  );
}
