"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";
import ChartBackground from "./ChartBackground";
import RiskPulse from "@/components/ui/RiskPulse";
import Logo from "@/components/ui/Logo";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <ChartBackground />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full glass glass-gold-edge px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold"
        >
          <ShieldCheck size={13} />
          Private workspace · Personal use only
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <Logo variant="mark" size={96} animated className="drop-shadow-[0_0_40px_rgba(201,162,39,0.35)]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 font-display text-5xl font-semibold tracking-[0.15em] text-bone sm:text-6xl"
        >
          NAVA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 font-display text-2xl font-medium shimmer-text sm:text-3xl"
        >
          Risk First. Profit Follows.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-bone-dim sm:text-lg"
        >
          My private trading workspace — built for discipline, risk control,
          and performance tracking. A personal cockpit for my own trades,
          nothing more.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/login">
            <GlowButton icon={<ArrowRight size={16} />}>
              Enter workspace
            </GlowButton>
          </Link>
          <a href="#philosophy">
            <GlowButton variant="ghost">See the philosophy</GlowButton>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-16 max-w-md"
        >
          <RiskPulse className="mx-auto h-14 w-full" />
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.3em] text-bone-faint">
            Steady baseline · Controlled spikes
          </p>
        </motion.div>
      </div>
    </section>
  );
}
