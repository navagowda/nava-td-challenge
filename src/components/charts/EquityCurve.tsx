"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { equityCurve } from "@/lib/mockData";

export default function EquityCurve({ height = 300 }: { height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={equityCurve} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="equityFillMain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C9A227" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#C9A227" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1B1B1F" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#77767A"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#77767A"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              background: "#131316",
              border: "1px solid #26262C",
              borderRadius: 12,
              fontSize: 12,
            }}
            labelStyle={{ color: "#B9B7B0" }}
            formatter={(v: number) => [`$${v.toLocaleString("en-US")}`, "Equity"]}
          />
          <Area
            type="monotone"
            dataKey="equity"
            stroke="#C9A227"
            strokeWidth={2}
            fill="url(#equityFillMain)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
