import { MarketDesk } from "@/components/market-desk";
import type { MarketId } from "@/lib/markets";

type Props = {
  showLink?: boolean;
  chartVariant?: "lite" | "full";
  chartHeight?: number;
  initialSymbol?: MarketId;
};

/** Back-compat wrapper — markets desk with gold as the default focus. */
export function XauusdDesk(props: Props) {
  return <MarketDesk {...props} initialSymbol={props.initialSymbol ?? "XAUUSD"} />;
}
