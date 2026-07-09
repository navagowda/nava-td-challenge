"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { equityCurve, dashboardStats } from "@/lib/mockData";
import { TrendingUp } from "lucide-react";

export default function DashboardPreview() {
  return (
    <section id="preview" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Inside the workspace"
          title="A cockpit, not a scoreboard"
          description="A single glance shows balance, risk used, and the equity curve — no vanity metrics, just the numbers that keep the process honest."
          align="center"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto mt-14 max-w-4xl [perspective:1400px]"
        >
          <div
            className="glass glass-gold-edge rounded-3xl p-6 shadow-card sm:p-8"
            style={{ transform: "rotateX(4deg)" }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-bone-faint">
                  Account balance
                </p>
                <p className="mt-1 font-mono text-3xl font-semibold text-bone">
                  <AnimatedCounter
                    value={dashboardStats.accountBalance}
                    prefix="$"
                  />
                </p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-profit/10 px-3 py-1 text-xs font-medium text-profit">
                <TrendingUp size={13} />
                +{dashboardStats.winRate}% win rate
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityCurve} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C9A227" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#C9A227" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{
                      background: "#131316",
                      border: "1px solid #26262C",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "#B9B7B0" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="equity"
                    stroke="#C9A227"
                    strokeWidth={2}
                    fill="url(#equityFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Daily P&L", value: dashboardStats.dailyPnl, prefix: "$" },
                { label: "Monthly P&L", value: dashboardStats.monthlyPnl, prefix: "$" },
                { label: "Risk used", value: dashboardStats.riskUsedPct, suffix: "%" },
                { label: "Open trades", value: dashboardStats.openTrades },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-void-800/60 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wider text-bone-faint">
                    {s.label}
                  </p>
                  <p className="mt-1 font-mono text-lg font-semibold text-bone">
                    <AnimatedCounter
                      value={s.value}
                      prefix={s.prefix}
                      suffix={s.suffix}
                    />
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -inset-x-10 -bottom-10 -z-10 h-32 bg-gold/10 blur-[80px]" />
        </motion.div>

        <GlassCard hover={false} className="mx-auto mt-10 max-w-2xl text-center" glow>
          <p className="text-sm leading-relaxed text-bone-dim">
            This preview reflects a personal account. NAVA does not manage
            funds, run trading challenges, or offer payouts to anyone.
          </p>
        </GlassCard>
      </div>
    </section>
  );
}
