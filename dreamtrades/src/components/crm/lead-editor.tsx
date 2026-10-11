"use client";

import { useId, type FormEvent, type ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  ASSIGNEE_PRESETS,
  CRM_STAGES,
  DEFAULT_ASSIGNEE,
  SOURCE_MANUAL,
  SOURCE_PRESETS,
  type CrmLead,
  type CrmStage,
} from "@/lib/crm";
import { cn } from "@/lib/utils";
import { crmFieldClass, crmLabelClass } from "@/components/crm/fields";

export type LeadFormValues = {
  name: string;
  telegram: string;
  whatsapp: string;
  country: string;
  source: string;
  campaign: string;
  broker: string;
  accountNumber: string;
  firstDepositUsd: string;
  firstDepositDate: string;
  assignedTo: string;
  stage: CrmStage;
  lastContact: string;
  nextFollowUp: string;
  notes: string;
  consent: boolean;
};

export function emptyLeadForm(): LeadFormValues {
  return {
    name: "",
    telegram: "",
    whatsapp: "",
    country: "",
    source: SOURCE_MANUAL,
    campaign: "",
    broker: "",
    accountNumber: "",
    firstDepositUsd: "",
    firstDepositDate: "",
    assignedTo: DEFAULT_ASSIGNEE,
    stage: "New",
    lastContact: "",
    nextFollowUp: "",
    notes: "",
    consent: false,
  };
}

export function leadToForm(lead: CrmLead): LeadFormValues {
  return {
    name: lead.name,
    telegram: lead.telegram,
    whatsapp: lead.whatsapp,
    country: lead.country,
    source: lead.source || SOURCE_MANUAL,
    campaign: lead.campaign,
    broker: lead.broker,
    accountNumber: lead.accountNumber,
    firstDepositUsd: lead.firstDepositUsd == null ? "" : String(lead.firstDepositUsd),
    firstDepositDate: lead.firstDepositDate,
    assignedTo: lead.assignedTo || DEFAULT_ASSIGNEE,
    stage: lead.stage,
    lastContact: lead.lastContact,
    nextFollowUp: lead.nextFollowUp,
    notes: lead.notes,
    consent: lead.consent,
  };
}

export function formToPayload(form: LeadFormValues) {
  return {
    name: form.name,
    telegram: form.telegram,
    whatsapp: form.whatsapp,
    country: form.country,
    source: form.source,
    campaign: form.campaign,
    broker: form.broker,
    accountNumber: form.accountNumber,
    firstDepositUsd: form.firstDepositUsd.trim() === "" ? null : form.firstDepositUsd,
    firstDepositDate: form.firstDepositDate,
    assignedTo: form.assignedTo,
    stage: form.stage,
    lastContact: form.lastContact,
    nextFollowUp: form.nextFollowUp,
    notes: form.notes,
    consent: form.consent,
  };
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className={crmLabelClass}>{label}</span>
      {children}
    </label>
  );
}

export function LeadEditor({
  form,
  onChange,
  onSubmit,
  submitLabel,
  busy,
  error,
  testId,
}: {
  form: LeadFormValues;
  onChange: (next: LeadFormValues) => void;
  onSubmit: () => void;
  submitLabel: string;
  busy: boolean;
  error: string | null;
  testId?: string;
}) {
  const sourceListId = useId();
  const presetAssignee = (ASSIGNEE_PRESETS as readonly string[]).includes(form.assignedTo);
  const assigneeSelect = presetAssignee ? form.assignedTo : "__custom";

  function set<K extends keyof LeadFormValues>(key: K, value: LeadFormValues[K]) {
    onChange({ ...form, [key]: value });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!busy) onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} data-testid={testId} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={crmFieldClass}
            maxLength={80}
            required
            data-testid="lead-name"
          />
        </Field>
        <Field label="Stage">
          <select
            value={form.stage}
            onChange={(e) => set("stage", e.target.value as CrmStage)}
            className={crmFieldClass}
            data-testid="lead-stage"
          >
            {CRM_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Telegram">
          <input
            value={form.telegram}
            onChange={(e) => set("telegram", e.target.value)}
            className={crmFieldClass}
            placeholder="@username"
            maxLength={64}
            data-testid="lead-telegram"
          />
        </Field>
        <Field label="WhatsApp">
          <input
            value={form.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
            className={crmFieldClass}
            placeholder="+1234567890"
            maxLength={32}
            data-testid="lead-whatsapp"
          />
        </Field>
        <Field label="Country">
          <input
            value={form.country}
            onChange={(e) => set("country", e.target.value)}
            className={crmFieldClass}
            placeholder="e.g. United Kingdom"
            maxLength={80}
          />
        </Field>
        <Field label="Source">
          <input
            value={form.source}
            onChange={(e) => set("source", e.target.value)}
            className={crmFieldClass}
            list={sourceListId}
            maxLength={80}
          />
          <datalist id={sourceListId}>
            {SOURCE_PRESETS.map((source) => (
              <option key={source} value={source} />
            ))}
          </datalist>
        </Field>
        <Field label="Campaign">
          <input
            value={form.campaign}
            onChange={(e) => set("campaign", e.target.value)}
            className={crmFieldClass}
            maxLength={80}
          />
        </Field>
        <Field label="Broker">
          <input
            value={form.broker}
            onChange={(e) => set("broker", e.target.value)}
            className={crmFieldClass}
            maxLength={80}
          />
        </Field>
        <Field label="Account number">
          <input
            value={form.accountNumber}
            onChange={(e) => set("accountNumber", e.target.value)}
            className={crmFieldClass}
            maxLength={40}
          />
        </Field>
        <Field label="First deposit USD">
          <input
            value={form.firstDepositUsd}
            onChange={(e) => set("firstDepositUsd", e.target.value)}
            className={crmFieldClass}
            inputMode="decimal"
            placeholder="0.00"
          />
        </Field>
        <Field label="First deposit date">
          <input
            type="date"
            value={form.firstDepositDate}
            onChange={(e) => set("firstDepositDate", e.target.value)}
            className={crmFieldClass}
          />
        </Field>
        <div className="block">
          <span className={crmLabelClass}>Assigned to</span>
          <select
            value={assigneeSelect}
            onChange={(e) => {
              const next = e.target.value;
              set("assignedTo", next === "__custom" ? "" : next);
            }}
            className={crmFieldClass}
            data-testid="lead-assignee"
          >
            {ASSIGNEE_PRESETS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            <option value="__custom">Custom desk name</option>
          </select>
          {!presetAssignee ? (
            <input
              value={form.assignedTo}
              onChange={(e) => set("assignedTo", e.target.value)}
              className={crmFieldClass}
              placeholder="Desk name"
              maxLength={80}
            />
          ) : null}
        </div>
        <Field label="Last contact">
          <input
            type="date"
            value={form.lastContact}
            onChange={(e) => set("lastContact", e.target.value)}
            className={crmFieldClass}
          />
        </Field>
        <Field label="Next follow-up">
          <input
            type="date"
            value={form.nextFollowUp}
            onChange={(e) => set("nextFollowUp", e.target.value)}
            className={crmFieldClass}
            data-testid="lead-follow-up"
          />
        </Field>
      </div>
      <Field label="Notes">
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={4}
          maxLength={2000}
          className={cn(crmFieldClass, "resize-y")}
        />
      </Field>
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => set("consent", e.target.checked)}
          className="mt-1 size-4 accent-[var(--mark)]"
          data-testid="lead-consent"
        />
        <span className="text-sm leading-relaxed text-ink/70">
          This person agreed DreamTrades may contact them. A person on the team sends the message.
        </span>
      </label>
      {error ? (
        <p className="text-sm font-medium text-flare" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className={cn(
          buttonVariants({ size: "lg" }),
          "rounded-md bg-mark px-4 text-[#041512] hover:bg-[#14b8a0] disabled:opacity-60",
        )}
      >
        {busy ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
