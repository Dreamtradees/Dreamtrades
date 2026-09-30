//+------------------------------------------------------------------+
//| DreamTrades_XAU_ScalpSignals.mq5                                 |
//| M1/M5 scalping arrows for XAUUSD (or any symbol)                 |
//| Educational tool — not financial advice.                         |
//+------------------------------------------------------------------+
#property copyright "DreamTrades"
#property link      "https://t.me/+F5BDH-TyKCI1ZDVk"
#property version   "1.00"
#property indicator_chart_window
#property indicator_buffers 2
#property indicator_plots   2

#property indicator_label1  "Scalp Buy"
#property indicator_type1   DRAW_ARROW
#property indicator_color1  clrTeal
#property indicator_width1  2

#property indicator_label2  "Scalp Sell"
#property indicator_type2   DRAW_ARROW
#property indicator_color2  clrFireBrick
#property indicator_width2  2

input int InpFastEMA = 9;
input int InpSlowEMA = 21;
input int InpRSIPeriod = 7;
input double InpArrowGapPoints = 40;

double buyBuffer[];
double sellBuffer[];
int fastHandle = INVALID_HANDLE;
int slowHandle = INVALID_HANDLE;
int rsiHandle  = INVALID_HANDLE;

int OnInit()
{
   SetIndexBuffer(0, buyBuffer, INDICATOR_DATA);
   SetIndexBuffer(1, sellBuffer, INDICATOR_DATA);
   PlotIndexSetInteger(0, PLOT_ARROW, 233);
   PlotIndexSetInteger(1, PLOT_ARROW, 234);
   PlotIndexSetDouble(0, PLOT_EMPTY_VALUE, EMPTY_VALUE);
   PlotIndexSetDouble(1, PLOT_EMPTY_VALUE, EMPTY_VALUE);
   ArraySetAsSeries(buyBuffer, true);
   ArraySetAsSeries(sellBuffer, true);

   fastHandle = iMA(_Symbol, PERIOD_CURRENT, InpFastEMA, 0, MODE_EMA, PRICE_CLOSE);
   slowHandle = iMA(_Symbol, PERIOD_CURRENT, InpSlowEMA, 0, MODE_EMA, PRICE_CLOSE);
   rsiHandle  = iRSI(_Symbol, PERIOD_CURRENT, InpRSIPeriod, PRICE_CLOSE);

   if(fastHandle == INVALID_HANDLE || slowHandle == INVALID_HANDLE || rsiHandle == INVALID_HANDLE)
      return INIT_FAILED;

   IndicatorSetString(INDICATOR_SHORTNAME, "DT XAU Scalp Signals");
   return INIT_SUCCEEDED;
}

void OnDeinit(const int reason)
{
   if(fastHandle != INVALID_HANDLE) IndicatorRelease(fastHandle);
   if(slowHandle != INVALID_HANDLE) IndicatorRelease(slowHandle);
   if(rsiHandle  != INVALID_HANDLE) IndicatorRelease(rsiHandle);
}

int OnCalculate(const int rates_total,
                const int prev_calculated,
                const datetime &time[],
                const double &open[],
                const double &high[],
                const double &low[],
                const double &close[],
                const long &tick_volume[],
                const long &volume[],
                const int &spread[])
{
   if(rates_total < InpSlowEMA + 5) return 0;

   ArraySetAsSeries(high, true);
   ArraySetAsSeries(low, true);

   double fast[], slow[], rsi[];
   ArraySetAsSeries(fast, true);
   ArraySetAsSeries(slow, true);
   ArraySetAsSeries(rsi, true);

   int toCopy = rates_total;
   if(CopyBuffer(fastHandle, 0, 0, toCopy, fast) <= 0) return 0;
   if(CopyBuffer(slowHandle, 0, 0, toCopy, slow) <= 0) return 0;
   if(CopyBuffer(rsiHandle,  0, 0, toCopy, rsi)  <= 0) return 0;

   int start = rates_total - prev_calculated;
   if(start < 3) start = 3;
   if(prev_calculated == 0)
   {
      ArrayInitialize(buyBuffer, EMPTY_VALUE);
      ArrayInitialize(sellBuffer, EMPTY_VALUE);
      start = rates_total - InpSlowEMA - 2;
   }

   double point = SymbolInfoDouble(_Symbol, SYMBOL_POINT);
   double gap = InpArrowGapPoints * point;

   for(int i = start; i >= 1; --i)
   {
      buyBuffer[i] = EMPTY_VALUE;
      sellBuffer[i] = EMPTY_VALUE;

      bool crossUp = fast[i+1] <= slow[i+1] && fast[i] > slow[i];
      bool crossDn = fast[i+1] >= slow[i+1] && fast[i] < slow[i];
      bool rsiUp = rsi[i+1] < 35.0 && rsi[i] >= 35.0;
      bool rsiDn = rsi[i+1] > 65.0 && rsi[i] <= 65.0;

      if(crossUp || (fast[i] > slow[i] && rsiUp))
         buyBuffer[i] = low[i] - gap;
      if(crossDn || (fast[i] < slow[i] && rsiDn))
         sellBuffer[i] = high[i] + gap;
   }

   return rates_total;
}
