"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import RiskDial from "@/components/ui/RiskDial";
import GlassCard from "@/components/ui/GlassCard";

const principles = [
  "Position size is decided before entry, not adjusted after.",
  "A daily loss limit ends the session — no exceptions, no revenge trades.",
  "Every trade is logged, win or lose, with the reasoning behind it.",
  "Profit is treated as a byproduct of process, never the goal itself.",
];

export default function RiskFirstSection() {
  return (
    <section id="philosophy" className="relative px-6 py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mb-3 inline-block font-mono text-xs uppercase tracking-[0.25em] text-gold">
            The philosophy
          </span>
          <h2 className="font-display text-3xl font-semibold leading-tight text-bone sm:text-4xl">
            Risk is the input.
            <br />
            Profit is the output.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-bone-dim">
            This workspace exists to enforce one order of operations: define
            the risk, size the position, then take the trade. Everything in
            NAVA is built backward from that rule.
          </p>

          <ul className="mt-8 space-y-4">
            {principles.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-bone-dim">
                <span className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                  <Check size={12} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassCard glow className="flex flex-col items-center py-10">
            <RiskDial usedPct={38} />
            <p className="mt-6 max-w-xs text-center text-xs leading-relaxed text-bone-faint">
              A live read on how much of today&apos;s risk budget has been
              used — the first thing checked before any new trade.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
