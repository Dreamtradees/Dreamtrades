export type CompletionRecord = {
  id: string;
  name: string;
  telegram: string;
  whatsapp: string;
  note: string;
  createdAt: string;
};

export type CompletionInput = {
  name?: unknown;
  telegram?: unknown;
  whatsapp?: unknown;
  note?: unknown;
  consent?: unknown;
};

export type CompletionValidation =
  | { ok: true; value: Omit<CompletionRecord, "id" | "createdAt"> }
  | { ok: false; error: string };

const MAX_NAME = 80;
const MAX_TELEGRAM = 64;
const MAX_WHATSAPP = 32;
const MAX_NOTE = 500;

function asTrimmedString(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function normalizeTelegram(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const withoutAt = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
  return withoutAt.replace(/\s+/g, "");
}

function normalizeWhatsapp(raw: string): string {
  return raw.trim().replace(/[^\d+]/g, "");
}

export function validateCompletionInput(input: CompletionInput): CompletionValidation {
  const name = asTrimmedString(input.name, MAX_NAME);
  const telegramRaw = asTrimmedString(input.telegram, MAX_TELEGRAM);
  const whatsappRaw = asTrimmedString(input.whatsapp, MAX_WHATSAPP);
  const note = asTrimmedString(input.note, MAX_NOTE);
  const consent = input.consent === true;

  if (!consent) {
    return { ok: false, error: "Please confirm we can reach out to you." };
  }

  const telegram = normalizeTelegram(telegramRaw);
  const whatsapp = normalizeWhatsapp(whatsappRaw);

  if (!telegram) {
    return {
      ok: false,
      error: "Add your Telegram @username so we can reach you.",
    };
  }

  if (!whatsapp) {
    return {
      ok: false,
      error: "Add your WhatsApp number so we can reach you.",
    };
  }

  if (!/^[A-Za-z][A-Za-z0-9_]{3,31}$/.test(telegram)) {
    return {
      ok: false,
      error: "Telegram username looks off — use letters, numbers, underscore (4–32 chars).",
    };
  }

  if (!/^\+?\d{7,15}$/.test(whatsapp)) {
    return {
      ok: false,
      error: "WhatsApp number looks off — use digits with optional leading +.",
    };
  }

  return {
    ok: true,
    value: {
      name,
      telegram: `@${telegram}`,
      whatsapp,
      note,
    },
  };
}

export function formatCompletionTelegramMessage(
  record: CompletionRecord,
  count: number | null,
): string {
  const when = (() => {
    try {
      return new Date(record.createdAt).toISOString();
    } catch {
      return record.createdAt;
    }
  })();

  const lines = [
    "✅ DreamTrades checklist complete",
    "",
    count != null ? `Graduate #${count}` : "Graduate (count pending Redis)",
    `Name: ${record.name || "—"}`,
    `Telegram: ${record.telegram || "—"}`,
    `WhatsApp: ${record.whatsapp || "—"}`,
    `Note: ${record.note || "—"}`,
    `When: ${when}`,
    `Id: ${record.id}`,
  ];
  return lines.join("\n");
}

export function newCompletionId(): string {
  return `cmp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
