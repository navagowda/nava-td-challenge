"use client";

import { ReactNode } from "react";
import GlassCard from "./GlassCard";
import AnimatedCounter from "./AnimatedCounter";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon?: ReactNode;
  trend?: number;
  delay?: number;
  decimals?: number;
}

export default function StatCard({
  label,
  value,
  prefix,
  suffix,
  icon,
  trend,
  delay = 0,
  decimals = 0,
}: StatCardProps) {
  return (
    <GlassCard glow delay={delay}>
      <div className="flex items-start justify-between">
        <p className="text-xs uppercase tracking-widest text-bone-faint">{label}</p>
        {icon && (
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gold/10 text-gold">
            {icon}
          </div>
        )}
      </div>
      <p className="mt-3 font-mono text-2xl font-semibold text-bone">
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </p>
      {trend !== undefined && (
        <p
          className={cn(
            "mt-1.5 text-xs font-medium",
            trend >= 0 ? "text-profit" : "text-loss"
          )}
        >
          {trend >= 0 ? "+" : ""}
          {trend}% vs. last period
        </p>
      )}
    </GlassCard>
  );
}
