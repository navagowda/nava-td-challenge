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
import { drawdownData } from "@/lib/mockData";

export default function DrawdownChart({ height = 240 }: { height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={drawdownData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="drawdownFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF5C5C" stopOpacity={0} />
              <stop offset="100%" stopColor="#FF5C5C" stopOpacity={0.35} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1B1B1F" vertical={false} />
          <XAxis dataKey="date" stroke="#77767A" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#77767A" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            contentStyle={{
              background: "#131316",
              border: "1px solid #26262C",
              borderRadius: 12,
              fontSize: 12,
            }}
            formatter={(v: number) => [`${v}%`, "Drawdown"]}
          />
          <Area
            type="monotone"
            dataKey="drawdown"
            stroke="#FF5C5C"
            strokeWidth={2}
            fill="url(#drawdownFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
