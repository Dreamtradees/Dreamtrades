import { z } from "zod";

function envBool(value: string | undefined, fallback = false): boolean {
  if (value === undefined || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

const schema = z.object({
  telegramBotToken: z.string().optional(),
  telegramAllowedUserIds: z.array(z.string()),
  cursorApiKey: z.string().optional(),
  cursorDefaultRepo: z.string().default(""),
  cursorDefaultRef: z.string().default("main"),
  cursorDefaultModel: z.string().optional(),
  port: z.number().int().positive().default(43127),
  host: z.string().default("0.0.0.0"),
  mockMode: z.boolean(),
  cursorApiBase: z.string().default("https://api.cursor.com"),
  tradingViewWebhookSecret: z.string().optional(),
  publicBaseUrl: z.string().optional(),
});

export type AppConfig = z.infer<typeof schema>;

export function loadConfig(): AppConfig {
  const allowed = (process.env.TELEGRAM_ALLOWED_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN?.trim() || undefined;
  const cursorApiKey = process.env.CURSOR_API_KEY?.trim() || undefined;
  const forceMock = envBool(process.env.MOCK_MODE, false);
  const hasLiveCreds = Boolean(telegramBotToken && cursorApiKey);

  return schema.parse({
    telegramBotToken,
    telegramAllowedUserIds: allowed,
    cursorApiKey,
    cursorDefaultRepo: process.env.CURSOR_DEFAULT_REPO?.trim() ?? "",
    cursorDefaultRef: process.env.CURSOR_DEFAULT_REF?.trim() || "main",
    cursorDefaultModel: process.env.CURSOR_DEFAULT_MODEL?.trim() || undefined,
    port: Number(process.env.PORT || 43127),
    host: process.env.HOST || "0.0.0.0",
    mockMode: forceMock || !hasLiveCreds,
    cursorApiBase: process.env.CURSOR_API_BASE?.trim() || "https://api.cursor.com",
    tradingViewWebhookSecret: process.env.TRADINGVIEW_WEBHOOK_SECRET?.trim() || undefined,
    publicBaseUrl: process.env.PUBLIC_BASE_URL?.trim() || undefined,
  });
}

export function connectionStatus(config: AppConfig) {
  return {
    mode: config.mockMode ? "mock" : "live",
    telegram: {
      configured: Boolean(config.telegramBotToken),
      allowlistSize: config.telegramAllowedUserIds.length,
      allowlistOpen: config.telegramAllowedUserIds.length === 0,
    },
    cursor: {
      configured: Boolean(config.cursorApiKey),
      defaultRepo: config.cursorDefaultRepo || null,
      defaultRef: config.cursorDefaultRef,
      defaultModel: config.cursorDefaultModel || null,
    },
    tradingView: {
      configured: Boolean(config.tradingViewWebhookSecret),
      publicBaseUrl: config.publicBaseUrl || null,
      webhookReady: Boolean(config.tradingViewWebhookSecret && config.publicBaseUrl),
    },
    ready: !config.mockMode,
  };
}

export function tradingViewWebhookUrl(config: AppConfig): string | null {
  if (!config.tradingViewWebhookSecret || !config.publicBaseUrl) return null;
  const base = config.publicBaseUrl.replace(/\/$/, "");
  return `${base}/webhooks/tradingview/${config.tradingViewWebhookSecret}`;
}
