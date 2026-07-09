//+------------------------------------------------------------------+
//| NavaSync.mq5                                                     |
//| Sends each closed trade from this MT5 account to your NAVA       |
//| trading workspace. Free, runs entirely inside your terminal.     |
//|                                                                    |
//| SETUP:                                                            |
//| 1. Copy this file into: MetaTrader 5/MQL5/Experts/                |
//| 2. Open MetaEditor, compile it (F7).                               |
//| 3. In MT5: Tools > Options > Expert Advisors >                    |
//|    check "Allow WebRequest for listed URL" and add your exact     |
//|    webhook URL, e.g. https://your-app.vercel.app                  |
//| 4. Drag NavaSync onto any one chart (only one instance needed —   |
//|    it tracks the whole account, not just that symbol).            |
//| 5. Set the WebhookURL and SharedSecret inputs below to match      |
//|    your Vercel environment variables.                             |
//+------------------------------------------------------------------+
#property strict

input string WebhookURL   = "https://your-app.vercel.app/api/mt5/webhook";
input string SharedSecret = "replace-with-a-long-random-string";

int OnInit()
{
   Print("NAVA sync EA initialized. Closed trades will be sent to: ", WebhookURL);
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason)
{
}

//+------------------------------------------------------------------+
//| Fires on every trade-related change on this account               |
//+------------------------------------------------------------------+
void OnTradeTransaction(const MqlTradeTransaction &trans,
                         const MqlTradeRequest &request,
                         const MqlTradeResult &result)
{
   if(trans.type != TRADE_TRANSACTION_DEAL_ADD)
      return;

   ulong dealTicket = trans.deal;
   if(!HistoryDealSelect(dealTicket))
      return;

   long entryType = HistoryDealGetInteger(dealTicket, DEAL_ENTRY);

   // Only fire when a position is being closed (fully or partially)
   if(entryType != DEAL_ENTRY_OUT && entryType != DEAL_ENTRY_OUT_BY)
      return;

   SendClosedTrade(dealTicket);
}

//+------------------------------------------------------------------+
//| Builds the JSON payload for one closed deal and posts it          |
//+------------------------------------------------------------------+
void SendClosedTrade(ulong outDealTicket)
{
   string symbol      = HistoryDealGetString(outDealTicket, DEAL_SYMBOL);
   double exitPrice    = HistoryDealGetDouble(outDealTicket, DEAL_PRICE);
   double volume       = HistoryDealGetDouble(outDealTicket, DEAL_VOLUME);
   double profit       = HistoryDealGetDouble(outDealTicket, DEAL_PROFIT)
                        + HistoryDealGetDouble(outDealTicket, DEAL_SWAP)
                        + HistoryDealGetDouble(outDealTicket, DEAL_COMMISSION);
   datetime closeTime  = (datetime)HistoryDealGetInteger(outDealTicket, DEAL_TIME);
   long positionId     = HistoryDealGetInteger(outDealTicket, DEAL_POSITION_ID);

   double entryPrice = 0;
   double stopLoss   = 0;
   double takeProfit = 0;
   string direction  = "long";

   // Walk this position's full deal history to find the opening deal,
   // which carries the entry price, direction, and (via its order) SL/TP.
   if(HistorySelectByPosition(positionId))
   {
      int total = HistoryDealsTotal();
      for(int i = 0; i < total; i++)
      {
         ulong ticket = HistoryDealGetTicket(i);
         if(ticket == 0)
            continue;

         if(HistoryDealGetInteger(ticket, DEAL_ENTRY) == DEAL_ENTRY_IN)
         {
            entryPrice = HistoryDealGetDouble(ticket, DEAL_PRICE);
            long dealType = HistoryDealGetInteger(ticket, DEAL_TYPE);
            direction = (dealType == DEAL_TYPE_BUY) ? "long" : "short";

            ulong openOrder = HistoryDealGetInteger(ticket, DEAL_ORDER);
            if(HistoryOrderSelect(openOrder))
            {
               stopLoss   = HistoryOrderGetDouble(openOrder, ORDER_SL);
               takeProfit = HistoryOrderGetDouble(openOrder, ORDER_TP);
            }
            break;
         }
      }
   }

   string closeTimeStr = TimeToString(closeTime, TIME_DATE | TIME_SECONDS);

   string json = StringFormat(
      "{\"symbol\":\"%s\",\"direction\":\"%s\",\"entry\":%.5f,\"exit\":%.5f," +
      "\"stopLoss\":%.5f,\"takeProfit\":%.5f,\"lotSize\":%.2f,\"pnl\":%.2f," +
      "\"closeTime\":\"%s\"}",
      symbol, direction, entryPrice, exitPrice,
      stopLoss, takeProfit, volume, profit, closeTimeStr
   );

   uchar data[];
   int   len = StringToCharArray(json, data, 0, StringLen(json)) - 1;
   ArrayResize(data, len);

   uchar  result[];
   string resultHeaders;
   string headers = "Content-Type: application/json\r\nX-NAVA-SECRET: " + SharedSecret + "\r\n";

   ResetLastError();
   int status = WebRequest("POST", WebhookURL, headers, 5000, data, result, resultHeaders);

   if(status == -1)
   {
      int err = GetLastError();
      Print("NAVA sync failed (error ", err, "). Check Tools > Options > Expert Advisors ",
            "and confirm the webhook URL is in the allowed list.");
   }
   else if(status >= 400)
   {
      Print("NAVA sync rejected by server. HTTP status: ", status);
   }
   else
   {
      Print("NAVA sync sent for ", symbol, ". HTTP status: ", status);
   }
}
