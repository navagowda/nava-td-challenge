//+------------------------------------------------------------------+
//| NavaSync.mq5 - NAVA Phase 3.1                                   |
//| Syncs MT5 account status, open positions and newly closed trades |
//+------------------------------------------------------------------+
#property strict
#property version   "3.10"

input string WebhookURL   = "https://nava-td-challenge.vercel.app/api/mt5/sync";
input string SharedSecret = "CHANGE_TO_YOUR_MT5_WEBHOOK_SECRET";
input int    SyncSeconds  = 10;
input int    HistoryLookbackDays = 7;

ulong lastSentDeal = 0;

string EscapeJson(string value)
{
   StringReplace(value, "\\", "\\\\");
   StringReplace(value, "\"", "\\\"");
   StringReplace(value, "\r", "");
   StringReplace(value, "\n", "\\n");
   return value;
}

string TimeJson(datetime value)
{
   return TimeToString(value, TIME_DATE|TIME_SECONDS);
}

int OnInit()
{
   if(SyncSeconds < 5)
   {
      Print("NAVA: SyncSeconds must be at least 5.");
      return INIT_PARAMETERS_INCORRECT;
   }
   EventSetTimer(SyncSeconds);
   Print("NAVA sync started: ", WebhookURL);
   SendSnapshot();
   return INIT_SUCCEEDED;
}

void OnDeinit(const int reason)
{
   EventKillTimer();
}

void OnTimer()
{
   SendSnapshot();
}

void OnTradeTransaction(const MqlTradeTransaction &trans,
                        const MqlTradeRequest &request,
                        const MqlTradeResult &result)
{
   if(trans.type == TRADE_TRANSACTION_DEAL_ADD)
      SendSnapshot();
}

string BuildAccountJson()
{
   long login = AccountInfoInteger(ACCOUNT_LOGIN);
   long leverage = AccountInfoInteger(ACCOUNT_LEVERAGE);
   double balance = AccountInfoDouble(ACCOUNT_BALANCE);
   double equity = AccountInfoDouble(ACCOUNT_EQUITY);
   double margin = AccountInfoDouble(ACCOUNT_MARGIN);
   double freeMargin = AccountInfoDouble(ACCOUNT_MARGIN_FREE);
   double marginLevel = AccountInfoDouble(ACCOUNT_MARGIN_LEVEL);
   double floating = equity - balance;

   return StringFormat(
      "{\"login\":%I64d,\"server\":\"%s\",\"broker\":\"%s\",\"name\":\"%s\",\"currency\":\"%s\",\"leverage\":%I64d,\"balance\":%.2f,\"equity\":%.2f,\"margin\":%.2f,\"freeMargin\":%.2f,\"marginLevel\":%.2f,\"floatingPnl\":%.2f}",
      login,
      EscapeJson(AccountInfoString(ACCOUNT_SERVER)),
      EscapeJson(AccountInfoString(ACCOUNT_COMPANY)),
      EscapeJson(AccountInfoString(ACCOUNT_NAME)),
      EscapeJson(AccountInfoString(ACCOUNT_CURRENCY)),
      leverage,balance,equity,margin,freeMargin,marginLevel,floating
   );
}

string BuildPositionsJson()
{
   string json = "[";
   bool first = true;
   int total = PositionsTotal();

   for(int i=0;i<total;i++)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0 || !PositionSelectByTicket(ticket)) continue;

      if(!first) json += ",";
      first = false;

      long type = PositionGetInteger(POSITION_TYPE);
      string direction = type == POSITION_TYPE_SELL ? "short" : "long";
      json += StringFormat(
         "{\"ticket\":%I64u,\"symbol\":\"%s\",\"direction\":\"%s\",\"volume\":%.2f,\"openPrice\":%.8f,\"currentPrice\":%.8f,\"stopLoss\":%.8f,\"takeProfit\":%.8f,\"floatingPnl\":%.2f,\"openTime\":\"%s\"}",
         ticket,
         EscapeJson(PositionGetString(POSITION_SYMBOL)),
         direction,
         PositionGetDouble(POSITION_VOLUME),
         PositionGetDouble(POSITION_PRICE_OPEN),
         PositionGetDouble(POSITION_PRICE_CURRENT),
         PositionGetDouble(POSITION_SL),
         PositionGetDouble(POSITION_TP),
         PositionGetDouble(POSITION_PROFIT),
         TimeJson((datetime)PositionGetInteger(POSITION_TIME))
      );
   }
   return json + "]";
}

string BuildClosedTradesJson()
{
   datetime from = TimeCurrent() - HistoryLookbackDays * 86400;
   datetime to = TimeCurrent();
   if(!HistorySelect(from,to)) return "[]";

   string json = "[";
   bool first = true;
   int total = HistoryDealsTotal();

   for(int i=0;i<total;i++)
   {
      ulong deal = HistoryDealGetTicket(i);
      if(deal == 0 || deal <= lastSentDeal) continue;
      long entryType = HistoryDealGetInteger(deal, DEAL_ENTRY);
      if(entryType != DEAL_ENTRY_OUT && entryType != DEAL_ENTRY_OUT_BY) continue;

      long positionId = HistoryDealGetInteger(deal, DEAL_POSITION_ID);
      string symbol = HistoryDealGetString(deal, DEAL_SYMBOL);
      double exitPrice = HistoryDealGetDouble(deal, DEAL_PRICE);
      double volume = HistoryDealGetDouble(deal, DEAL_VOLUME);
      double pnl = HistoryDealGetDouble(deal, DEAL_PROFIT)
                 + HistoryDealGetDouble(deal, DEAL_SWAP)
                 + HistoryDealGetDouble(deal, DEAL_COMMISSION);
      datetime closeTime = (datetime)HistoryDealGetInteger(deal, DEAL_TIME);

      double entryPrice = 0, sl = 0, tp = 0;
      string direction = "long";
      if(HistorySelectByPosition(positionId))
      {
         int ptotal = HistoryDealsTotal();
         for(int j=0;j<ptotal;j++)
         {
            ulong inDeal = HistoryDealGetTicket(j);
            if(inDeal == 0 || HistoryDealGetInteger(inDeal, DEAL_ENTRY) != DEAL_ENTRY_IN) continue;
            entryPrice = HistoryDealGetDouble(inDeal, DEAL_PRICE);
            long dealType = HistoryDealGetInteger(inDeal, DEAL_TYPE);
            direction = dealType == DEAL_TYPE_SELL ? "short" : "long";
            ulong openOrder = (ulong)HistoryDealGetInteger(inDeal, DEAL_ORDER);
            if(HistoryOrderSelect(openOrder))
            {
               sl = HistoryOrderGetDouble(openOrder, ORDER_SL);
               tp = HistoryOrderGetDouble(openOrder, ORDER_TP);
            }
            break;
         }
      }

      if(!first) json += ",";
      first = false;
      json += StringFormat(
         "{\"dealTicket\":%I64u,\"positionId\":%I64d,\"symbol\":\"%s\",\"direction\":\"%s\",\"entry\":%.8f,\"exit\":%.8f,\"stopLoss\":%.8f,\"takeProfit\":%.8f,\"lotSize\":%.2f,\"pnl\":%.2f,\"closeTime\":\"%s\"}",
         deal,positionId,EscapeJson(symbol),direction,entryPrice,exitPrice,sl,tp,volume,pnl,TimeJson(closeTime)
      );
      if(deal > lastSentDeal) lastSentDeal = deal;
   }
   return json + "]";
}

void SendSnapshot()
{
   string body = "{\"account\":" + BuildAccountJson()
               + ",\"positions\":" + BuildPositionsJson()
               + ",\"closedTrades\":" + BuildClosedTradesJson() + "}";

   char data[];
   StringToCharArray(body,data,0,WHOLE_ARRAY,CP_UTF8);
   ArrayResize(data,ArraySize(data)-1);

   char result[];
   string responseHeaders;
   string headers = "Content-Type: application/json\r\nX-NAVA-SECRET: " + SharedSecret + "\r\n";

   ResetLastError();
   int status = WebRequest("POST",WebhookURL,headers,8000,data,result,responseHeaders);
   if(status == -1)
   {
      Print("NAVA sync error ",GetLastError(),". Add your Vercel domain under Tools > Options > Expert Advisors > Allow WebRequest.");
      return;
   }

   string response = CharArrayToString(result,0,-1,CP_UTF8);
   if(status >= 200 && status < 300)
      Print("NAVA sync OK. HTTP ",status," ",response);
   else
      Print("NAVA sync rejected. HTTP ",status," ",response);
}
