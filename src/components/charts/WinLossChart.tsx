"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { winLossData } from "@/lib/mockData";

const COLORS = ["#C9A227", "#26262C"];

export default function WinLossChart({ height = 240 }: { height?: number }) {
  return (
    <div style={{ width: "100%", height }} className="relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={winLossData}
            dataKey="value"
            nameKey="name"
            innerRadius="70%"
            outerRadius="95%"
            paddingAngle={2}
            startAngle={90}
            endAngle={-270}
          >
            {winLossData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#131316",
              border: "1px solid #26262C",
              borderRadius: 12,
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-2xl font-semibold text-bone">
          {winLossData[0].value}%
        </span>
        <span className="text-[10px] uppercase tracking-widest text-bone-faint">
          Win rate
        </span>
      </div>
    </div>
  );
}
