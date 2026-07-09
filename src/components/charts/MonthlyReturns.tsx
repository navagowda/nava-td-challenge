"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { monthlyReturns } from "@/lib/mockData";

export default function MonthlyReturns({ height = 280 }: { height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyReturns} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="#1B1B1F" vertical={false} />
          <XAxis dataKey="month" stroke="#77767A" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#77767A" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            contentStyle={{
              background: "#131316",
              border: "1px solid #26262C",
              borderRadius: 12,
              fontSize: 12,
            }}
            formatter={(v: number) => [`${v}%`, "Return"]}
          />
          <Bar dataKey="returnPct" radius={[6, 6, 6, 6]}>
            {monthlyReturns.map((entry, i) => (
              <Cell key={i} fill={entry.returnPct >= 0 ? "#C9A227" : "#FF5C5C"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
