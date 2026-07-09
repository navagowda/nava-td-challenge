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
import { pairPerformance } from "@/lib/mockData";

export default function WinRateByPairChart({ height = 260 }: { height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={pairPerformance} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="#1B1B1F" vertical={false} />
          <XAxis dataKey="pair" stroke="#77767A" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#77767A"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              background: "#131316",
              border: "1px solid #26262C",
              borderRadius: 12,
              fontSize: 12,
            }}
            formatter={(v: number) => [`${v}%`, "Win rate"]}
          />
          <Bar dataKey="winRate" radius={[6, 6, 0, 0]}>
            {pairPerformance.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.winRate >= 60 ? "#3ECF8E" : entry.winRate >= 50 ? "#C9A227" : "#FF5C5C"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
