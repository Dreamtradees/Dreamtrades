import type { Hono } from "hono";
import type { AppConfig } from "./config.js";
import { AlertStore, summarizeTradingViewPayload } from "./alert-store.js";

export type AlertNotifier = {
  notifyTradingViewAlert: (summary: string, raw: unknown) => Promise<void>;
};

export function registerTradingViewRoutes(
  app: Hono,
  getConfig: () => AppConfig,
  alerts: AlertStore,
  notifier: AlertNotifier,
) {
  const handler = async (c: any) => {
    const config = getConfig();
    const secret = c.req.param("secret") || c.req.query("secret") || "";
    if (!config.tradingViewWebhookSecret) {
      return c.json({ ok: false, error: "TradingView webhook secret not configured" }, 503);
    }
    if (secret !== config.tradingViewWebhookSecret) {
      return c.json({ ok: false, error: "unauthorized" }, 401);
    }

    let payload: unknown;
    const contentType = c.req.header("content-type") || "";
    try {
      if (contentType.includes("application/json")) {
        payload = await c.req.json();
      } else {
        const text = await c.req.text();
        try {
          payload = JSON.parse(text);
        } catch {
          payload = text;
        }
      }
    } catch {
      payload = null;
    }

    const summary = summarizeTradingViewPayload(payload);
    const entry = alerts.add({
      summary,
      payload,
      sourceIp: c.req.header("x-forwarded-for") || undefined,
    });

    console.log(`TradingView alert ${entry.id}: ${summary}`);

    try {
      await notifier.notifyTradingViewAlert(summary, payload);
    } catch (err) {
      console.error("Failed to notify Telegram about TradingView alert:", err);
    }

    return c.json({ ok: true, id: entry.id });
  };

  app.post("/webhooks/tradingview/:secret", handler);
  app.post("/webhooks/tradingview", handler);

  app.get("/api/tradingview/alerts", (c) => {
    const config = getConfig();
    return c.json({
      count: alerts.count(),
      webhookPath: config.tradingViewWebhookSecret
        ? `/webhooks/tradingview/${config.tradingViewWebhookSecret}`
        : null,
      publicBaseUrl: config.publicBaseUrl || null,
      alerts: alerts.list(30),
    });
  });

  app.post("/api/tradingview/test", async (c) => {
    const config = getConfig();
    if (!config.tradingViewWebhookSecret) {
      return c.json({ ok: false, error: "secret missing" }, 503);
    }
    const sample = {
      ticker: "TESTUSDT",
      action: "buy",
      price: 1.23,
      message: "Manual test alert from bridge dashboard",
      interval: "5",
    };
    const summary = summarizeTradingViewPayload(sample);
    const entry = alerts.add({ summary, payload: sample, sourceIp: "local-test" });
    await notifier.notifyTradingViewAlert(summary, sample);
    return c.json({ ok: true, id: entry.id, summary });
  });
}
