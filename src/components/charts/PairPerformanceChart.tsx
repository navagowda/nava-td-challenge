"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { pairPerformance } from "@/lib/mockData";

export default function PairPerformanceChart({ height = 260 }: { height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={pairPerformance}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
        >
          <CartesianGrid stroke="#1B1B1F" horizontal={false} />
          <XAxis type="number" stroke="#77767A" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="pair"
            stroke="#77767A"
            fontSize={11}
            width={80}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#131316",
              border: "1px solid #26262C",
              borderRadius: 12,
              fontSize: 12,
            }}
            formatter={(v: number) => [`$${v.toLocaleString("en-US")}`, "P&L"]}
          />
          <Bar dataKey="pnl" radius={[0, 6, 6, 0]} fill="#C9A227" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
