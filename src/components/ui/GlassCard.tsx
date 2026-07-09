"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
  as?: "div" | "section";
  delay?: number;
}

export default function GlassCard({
  children,
  className,
  glow = false,
  hover = true,
  delay = 0,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hover ? { y: -4 } : undefined}
      className={cn(
        "glass relative min-w-0 overflow-hidden rounded-2xl p-6 transition-shadow duration-300",
        glow && "shadow-gold-glow-sm hover:shadow-gold-glow",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-card-sheen" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
