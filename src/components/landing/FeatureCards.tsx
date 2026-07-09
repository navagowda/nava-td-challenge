"use client";

import {
  NotebookPen,
  ShieldCheck,
  LineChart,
  Layers,
  BarChart3,
  FileText,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";

const features = [
  {
    icon: NotebookPen,
    title: "Trade journal",
    description:
      "Log every entry, exit, and stop with notes and screenshots — a permanent record of what actually happened.",
  },
  {
    icon: ShieldCheck,
    title: "Risk management",
    description:
      "Position sizing, risk/reward, and daily loss limits calculated before a single order goes out.",
  },
  {
    icon: LineChart,
    title: "Live charting",
    description:
      "A dedicated chart workspace for reading price the same way, every session.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Equity curve, drawdown, and performance broken down by strategy — the numbers that matter.",
  },
  {
    icon: Layers,
    title: "Strategy vault",
    description:
      "Every playbook documented: entry rules, exit rules, and the notes that keep them sharp.",
  },
  {
    icon: FileText,
    title: "Reports",
    description:
      "Daily, weekly, and monthly summaries — a quiet accountability check after every session.",
  },
];

export default function FeatureCards() {
  return (
    <section id="features" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="The workspace"
          title="Six rooms. One discipline."
          description="Everything built to support one goal: trade the plan, track the result, and never guess where the risk went."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <GlassCard key={f.title} delay={i * 0.06} glow>
                <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-gold-gradient shadow-gold-glow-sm">
                  <Icon size={19} className="text-void-950" />
                </div>
                <h3 className="font-display text-lg font-semibold text-bone">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-bone-dim">
                  {f.description}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
