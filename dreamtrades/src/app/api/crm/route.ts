import { NextResponse } from "next/server";
import { ownerAdminAuthorized } from "@/lib/admin-auth";
import { validateManualLead, type CrmLeadInput } from "@/lib/crm";
import {
  createCrmLead,
  isCrmValidationError,
  listCrmLeads,
  updateCrmLead,
} from "@/lib/crm-store";
import { redisConfigured } from "@/lib/completions-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request): boolean {
  const url = new URL(request.url);
  return ownerAdminAuthorized(url.searchParams.get("key") ?? undefined);
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** Owner desk: GET /api/crm?key=ADMIN_SECRET */
export async function GET(request: Request) {
  if (!authorized(request)) return unauthorized();

  try {
    const data = await listCrmLeads();
    return NextResponse.json({
      ok: true,
      count: data.count,
      durable: data.durable,
      backend: data.backend,
      redisConfigured: redisConfigured(),
      leads: data.leads,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to list leads" },
      { status: 500 },
    );
  }
}

/** Owner adds a lead by hand. */
export async function POST(request: Request) {
  if (!authorized(request)) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = validateManualLead(
    (body && typeof body === "object" ? body : {}) as CrmLeadInput,
  );
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const saved = await createCrmLead({
      ...parsed.value,
      notified: false,
      notifyError: null,
    });
    return NextResponse.json({ ok: true, lead: saved.lead });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to add lead" },
      { status: 500 },
    );
  }
}

/** Owner edits one lead. Body: { id, ...fields } */
export async function PATCH(request: Request) {
  if (!authorized(request)) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const record = (body && typeof body === "object" ? body : {}) as CrmLeadInput & { id?: unknown };
  const id = typeof record.id === "string" ? record.id.trim() : "";
  if (!id) {
    return NextResponse.json({ error: "Missing lead id." }, { status: 400 });
  }

  try {
    const updated = await updateCrmLead(id, record);
    if (!updated) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, lead: updated.lead });
  } catch (err) {
    if (isCrmValidationError(err)) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update lead" },
      { status: 500 },
    );
  }
}
