import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

export type TradingViewAlert = {
  id: string;
  receivedAt: string;
  sourceIp?: string;
  payload: unknown;
  summary: string;
};

type StoreShape = {
  alerts: TradingViewAlert[];
};

export class AlertStore {
  private path: string;
  private data: StoreShape;
  private max = 100;

  constructor(path = join(process.cwd(), "data", "tradingview-alerts.json")) {
    this.path = path;
    mkdirSync(dirname(path), { recursive: true });
    this.data = this.read();
  }

  private read(): StoreShape {
    if (!existsSync(this.path)) return { alerts: [] };
    try {
      return JSON.parse(readFileSync(this.path, "utf8")) as StoreShape;
    } catch {
      return { alerts: [] };
    }
  }

  private persist() {
    writeFileSync(this.path, JSON.stringify(this.data, null, 2));
  }

  add(alert: Omit<TradingViewAlert, "id" | "receivedAt"> & { receivedAt?: string }) {
    const entry: TradingViewAlert = {
      id: `tv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      receivedAt: alert.receivedAt ?? new Date().toISOString(),
      sourceIp: alert.sourceIp,
      payload: alert.payload,
      summary: alert.summary,
    };
    this.data.alerts.unshift(entry);
    this.data.alerts = this.data.alerts.slice(0, this.max);
    this.persist();
    return entry;
  }

  list(limit = 20): TradingViewAlert[] {
    return this.data.alerts.slice(0, limit);
  }

  count() {
    return this.data.alerts.length;
  }
}

export function summarizeTradingViewPayload(payload: unknown): string {
  if (typeof payload === "string") {
    const trimmed = payload.trim();
    return trimmed.slice(0, 500) || "(empty alert)";
  }
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    const parts = [
      obj.ticker ?? obj.symbol,
      obj.action ?? obj.strategy ?? obj.order,
      obj.price ?? obj.close,
      obj.message ?? obj.msg ?? obj.text,
      obj.interval ?? obj.timeframe,
    ]
      .filter((v) => v !== undefined && v !== null && String(v).length > 0)
      .map(String);
    if (parts.length) return parts.join(" · ").slice(0, 500);
    try {
      return JSON.stringify(payload).slice(0, 500);
    } catch {
      return "TradingView alert";
    }
  }
  return String(payload ?? "TradingView alert").slice(0, 500);
}
