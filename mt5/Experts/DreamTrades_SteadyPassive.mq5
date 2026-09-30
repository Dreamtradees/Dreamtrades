//+------------------------------------------------------------------+
//| DreamTrades_SteadyPassive.mq5                                    |
//| Steady, low-frequency trend pullback EA for MetaTrader 5         |
//| Not financial advice. Use demo first. Past results ≠ future.     |
//+------------------------------------------------------------------+
#property copyright "DreamTrades"
#property link      "https://t.me/+F5BDH-TyKCI1ZDVk"
#property version   "1.00"
#property strict
#property description "DreamTrades Steady Passive — conservative EMA pullback bot"
#property description "Attach to a chart, enable Algo Trading, use demo first."

#include <Trade/Trade.mqh>

input group "=== DreamTrades identity ==="
input long   InpMagic           = 260930;          // Magic number
input string InpComment         = "DT-SteadyPassive"; // Order comment

input group "=== Strategy (slow / passive) ==="
input ENUM_TIMEFRAMES InpTrendTF = PERIOD_H1;      // Trend timeframe
input int    InpFastEMA         = 34;              // Fast EMA
input int    InpSlowEMA         = 89;              // Slow EMA
input int    InpPullbackEMA     = 21;              // Pullback EMA
input int    InpATRPeriod       = 14;              // ATR period
input double InpATRStopMult     = 2.0;             // SL = ATR * this
input double InpATRTakeMult     = 3.0;             // TP = ATR * this
input int    InpMinBarsBetween  = 12;              // Min bars between new trades

input group "=== Risk (keep this modest) ==="
input double InpRiskPercent     = 0.5;             // Risk % of balance per trade
input double InpMaxLots         = 0.50;            // Hard max lot size
input double InpMinLots         = 0.01;            // Min lot size
input int    InpMaxOpenTrades   = 1;               // Max open trades (this symbol+magic)
input double InpMaxDailyLossPct = 2.0;             // Pause if day loss reaches %
input bool   InpAllowBuy        = true;            // Allow buys
input bool   InpAllowSell       = true;            // Allow sells

input group "=== Filters ==="
input bool   InpUseSpreadFilter = true;            // Block wide spreads
input int    InpMaxSpreadPoints = 35;              // Max spread (points)
input bool   InpTradeOnlyM1Sessions = false;       // Optional London/NY window
input int    InpSessionStartHour = 7;              // Session start (server hour)
input int    InpSessionEndHour   = 20;             // Session end (server hour)

CTrade trade;
int fastHandle = INVALID_HANDLE;
int slowHandle = INVALID_HANDLE;
int pullHandle = INVALID_HANDLE;
int atrHandle  = INVALID_HANDLE;
datetime lastTradeBarTime = 0;
double dayStartBalance = 0.0;
int dayStamp = -1;

//+------------------------------------------------------------------+
int OnInit()
{
   trade.SetExpertMagicNumber(InpMagic);
   trade.SetDeviationInPoints(20);
   trade.SetTypeFillingBySymbol(_Symbol);
   trade.SetAsyncMode(false);

   if(InpFastEMA >= InpSlowEMA)
   {
      Print("DreamTrades: Fast EMA must be smaller than Slow EMA.");
      return INIT_PARAMETERS_INCORRECT;
   }

   fastHandle = iMA(_Symbol, InpTrendTF, InpFastEMA, 0, MODE_EMA, PRICE_CLOSE);
   slowHandle = iMA(_Symbol, InpTrendTF, InpSlowEMA, 0, MODE_EMA, PRICE_CLOSE);
   pullHandle = iMA(_Symbol, InpTrendTF, InpPullbackEMA, 0, MODE_EMA, PRICE_CLOSE);
   atrHandle  = iATR(_Symbol, InpTrendTF, InpATRPeriod);

   if(fastHandle == INVALID_HANDLE || slowHandle == INVALID_HANDLE ||
      pullHandle == INVALID_HANDLE || atrHandle == INVALID_HANDLE)
   {
      Print("DreamTrades: failed to create indicators.");
      return INIT_FAILED;
   }

   ResetDailyGuard();
   Print("DreamTrades SteadyPassive ready on ", _Symbol, " / ", EnumToString(InpTrendTF));
   return INIT_SUCCEEDED;
}

//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   if(fastHandle != INVALID_HANDLE) IndicatorRelease(fastHandle);
   if(slowHandle != INVALID_HANDLE) IndicatorRelease(slowHandle);
   if(pullHandle != INVALID_HANDLE) IndicatorRelease(pullHandle);
   if(atrHandle  != INVALID_HANDLE) IndicatorRelease(atrHandle);
}

//+------------------------------------------------------------------+
void OnTick()
{
   ResetDailyGuard();
   if(!TerminalInfoInteger(TERMINAL_TRADE_ALLOWED)) return;
   if(!MQLInfoInteger(MQL_TRADE_ALLOWED)) return;
   if(IsDailyLossBreached()) return;
   if(CountOpenTrades() >= InpMaxOpenTrades) return;
   if(!IsNewSignalBar()) return;
   if(!SessionOk()) return;
   if(InpUseSpreadFilter && SpreadPoints() > InpMaxSpreadPoints) return;

   double fast[], slow[], pull[], atr[];
   ArraySetAsSeries(fast, true);
   ArraySetAsSeries(slow, true);
   ArraySetAsSeries(pull, true);
   ArraySetAsSeries(atr, true);

   if(CopyBuffer(fastHandle, 0, 0, 3, fast) < 3) return;
   if(CopyBuffer(slowHandle, 0, 0, 3, slow) < 3) return;
   if(CopyBuffer(pullHandle, 0, 0, 3, pull) < 3) return;
   if(CopyBuffer(atrHandle,  0, 0, 3, atr)  < 3) return;
   if(atr[1] <= 0) return;

   double close1 = iClose(_Symbol, InpTrendTF, 1);
   double low1   = iLow(_Symbol, InpTrendTF, 1);
   double high1  = iHigh(_Symbol, InpTrendTF, 1);

   // Passive: fast above slow. Passive: price pulled into pullback EMA then closed back above it.
   bool bullTrend = fast[1] > slow[1] && fast[2] > slow[2];
   bool bearTrend = fast[1] < slow[1] && fast[2] < slow[2];
   bool bullPull  = low1 <= pull[1] && close1 > pull[1] && close1 > openOf(1);
   bool bearPull  = high1 >= pull[1] && close1 < pull[1] && close1 < openOf(1);

   if(InpAllowBuy && bullTrend && bullPull)
      OpenDirectional(ORDER_TYPE_BUY, atr[1]);
   else if(InpAllowSell && bearTrend && bearPull)
      OpenDirectional(ORDER_TYPE_SELL, atr[1]);
}

//+------------------------------------------------------------------+
double openOf(const int shift)
{
   return iOpen(_Symbol, InpTrendTF, shift);
}

//+------------------------------------------------------------------+
bool IsNewSignalBar()
{
   datetime barTime = iTime(_Symbol, InpTrendTF, 0);
   if(barTime <= 0) return false;

   // Enforce spacing between entries
   if(lastTradeBarTime > 0)
   {
      int bars = Bars(_Symbol, InpTrendTF, lastTradeBarTime, barTime);
      if(bars >= 0 && bars < InpMinBarsBetween) return false;
   }

   static datetime lastChecked = 0;
   if(barTime == lastChecked) return false;
   lastChecked = barTime;
   return true;
}

//+------------------------------------------------------------------+
bool SessionOk()
{
   if(!InpTradeOnlyM1Sessions) return true;
   MqlDateTime dt;
   TimeToStruct(TimeCurrent(), dt);
   if(InpSessionStartHour < InpSessionEndHour)
      return (dt.hour >= InpSessionStartHour && dt.hour < InpSessionEndHour);
   // overnight window
   return (dt.hour >= InpSessionStartHour || dt.hour < InpSessionEndHour);
}

//+------------------------------------------------------------------+
int SpreadPoints()
{
   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   double point = SymbolInfoDouble(_Symbol, SYMBOL_POINT);
   if(point <= 0) return 100000;
   return (int)MathRound((ask - bid) / point);
}

//+------------------------------------------------------------------+
void ResetDailyGuard()
{
   MqlDateTime dt;
   TimeToStruct(TimeCurrent(), dt);
   int stamp = dt.year * 10000 + dt.mon * 100 + dt.day;
   if(stamp != dayStamp)
   {
      dayStamp = stamp;
      dayStartBalance = AccountInfoDouble(ACCOUNT_BALANCE);
   }
}

//+------------------------------------------------------------------+
bool IsDailyLossBreached()
{
   if(InpMaxDailyLossPct <= 0 || dayStartBalance <= 0) return false;
   double equity = AccountInfoDouble(ACCOUNT_EQUITY);
   double lossPct = ((dayStartBalance - equity) / dayStartBalance) * 100.0;
   return (lossPct >= InpMaxDailyLossPct);
}

//+------------------------------------------------------------------+
int CountOpenTrades()
{
   int count = 0;
   for(int i = PositionsTotal() - 1; i >= 0; --i)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0) continue;
      if(!PositionSelectByTicket(ticket)) continue;
      if(PositionGetString(POSITION_SYMBOL) != _Symbol) continue;
      if((long)PositionGetInteger(POSITION_MAGIC) != InpMagic) continue;
      count++;
   }
   return count;
}

//+------------------------------------------------------------------+
double NormalizeVolume(double volume)
{
   double vmin  = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double vmax  = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   double step  = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);
   if(step <= 0) step = 0.01;

   volume = MathMax(volume, MathMax(vmin, InpMinLots));
   volume = MathMin(volume, MathMin(vmax, InpMaxLots));
   volume = MathFloor(volume / step) * step;

   int digits = (int)MathMax(0, MathCeil(-MathLog10(step)));
   return NormalizeDouble(volume, digits);
}

//+------------------------------------------------------------------+
double LotsForRisk(const double stopDistance)
{
   if(stopDistance <= 0) return InpMinLots;

   double balance = AccountInfoDouble(ACCOUNT_BALANCE);
   double riskMoney = balance * (InpRiskPercent / 100.0);

   double tickSize  = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);
   double tickValue = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
   if(tickSize <= 0 || tickValue <= 0) return InpMinLots;

   double moneyPerLot = (stopDistance / tickSize) * tickValue;
   if(moneyPerLot <= 0) return InpMinLots;

   return NormalizeVolume(riskMoney / moneyPerLot);
}

//+------------------------------------------------------------------+
void OpenDirectional(const ENUM_ORDER_TYPE type, const double atr)
{
   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   int digits = (int)SymbolInfoInteger(_Symbol, SYMBOL_DIGITS);
   double stopDist = atr * InpATRStopMult;
   double takeDist = atr * InpATRTakeMult;
   double lots = LotsForRisk(stopDist);
   if(lots < SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN)) return;

   double price = (type == ORDER_TYPE_BUY) ? ask : bid;
   double sl, tp;
   if(type == ORDER_TYPE_BUY)
   {
      sl = NormalizeDouble(price - stopDist, digits);
      tp = NormalizeDouble(price + takeDist, digits);
   }
   else
   {
      sl = NormalizeDouble(price + stopDist, digits);
      tp = NormalizeDouble(price - takeDist, digits);
   }

   // Respect broker stop level
   long stopsLevel = SymbolInfoInteger(_Symbol, SYMBOL_TRADE_STOPS_LEVEL);
   double point = SymbolInfoDouble(_Symbol, SYMBOL_POINT);
   double minDist = stopsLevel * point;
   if(minDist > 0)
   {
      if(type == ORDER_TYPE_BUY)
      {
         if(price - sl < minDist) sl = NormalizeDouble(price - minDist, digits);
         if(tp - price < minDist) tp = NormalizeDouble(price + minDist, digits);
      }
      else
      {
         if(sl - price < minDist) sl = NormalizeDouble(price + minDist, digits);
         if(price - tp < minDist) tp = NormalizeDouble(price - minDist, digits);
      }
   }

   bool ok = false;
   if(type == ORDER_TYPE_BUY)
      ok = trade.Buy(lots, _Symbol, price, sl, tp, InpComment);
   else
      ok = trade.Sell(lots, _Symbol, price, sl, tp, InpComment);

   if(ok)
   {
      lastTradeBarTime = iTime(_Symbol, InpTrendTF, 0);
      Print("DreamTrades entry ", EnumToString(type),
            " lots=", lots, " sl=", sl, " tp=", tp);
   }
   else
   {
      Print("DreamTrades order failed: ", trade.ResultRetcode(), " ", trade.ResultRetcodeDescription());
   }
}

//+------------------------------------------------------------------+
