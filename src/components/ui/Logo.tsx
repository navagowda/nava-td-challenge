"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** "mark" = icon only, "full" = icon + wordmark, "stacked" = icon above wordmark + tagline */
  variant?: "mark" | "full" | "stacked";
  size?: number;
  className?: string;
  animated?: boolean;
  showTagline?: boolean;
}

/**
 * The NAVA monogram: a faceted "N" whose right leg resolves into three
 * ascending bars — the letterform and the equity/bar-chart motif are the
 * same strokes. Rendered as an SVG so it stays crisp at any size and can be
 * recolored via the shared gold gradient used across the app.
 */
function LogoMark({ size, animated }: { size: number; animated?: boolean }) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.1, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  const Path = animated ? motion.path : "path";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="NAVA"
    >
      <defs>
        <linearGradient id="nava-logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F4D77B" />
          <stop offset="45%" stopColor="#C9A227" />
          <stop offset="100%" stopColor="#8A6C15" />
        </linearGradient>
      </defs>

      {/* Left leg + diagonal spine of the N, tapering to a point like the reference marks */}
      <Path
        d="M20 100 L20 18 L98 100 L98 84 L34 18"
        stroke="url(#nava-logo-gradient)"
        strokeWidth="9"
        strokeLinecap="square"
        strokeLinejoin="miter"
        variants={animated ? draw : undefined}
        custom={0}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
      />

      {/* Right leg of the N */}
      <Path
        d="M98 18 L98 100"
        stroke="url(#nava-logo-gradient)"
        strokeWidth="9"
        strokeLinecap="square"
        variants={animated ? draw : undefined}
        custom={1}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
      />

      {/* Ascending bar-chart accent, doubling as the N's inner counter */}
      <Path
        d="M64 100 L64 62"
        stroke="url(#nava-logo-gradient)"
        strokeWidth="9"
        strokeLinecap="square"
        variants={animated ? draw : undefined}
        custom={2}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
      />
      <Path
        d="M81 100 L81 46"
        stroke="url(#nava-logo-gradient)"
        strokeWidth="9"
        strokeLinecap="square"
        variants={animated ? draw : undefined}
        custom={3}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
      />
    </svg>
  );
}

export default function Logo({
  variant = "full",
  size = 32,
  className,
  animated = false,
  showTagline = false,
}: LogoProps) {
  if (variant === "mark") {
    return (
      <div className={className}>
        <LogoMark size={size} animated={animated} />
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div className={cn("flex flex-col items-center", className)}>
        <LogoMark size={size} animated={animated} />
        <span className="mt-3 font-display text-2xl font-semibold tracking-[0.25em] text-bone">
          NAVA
        </span>
        {showTagline && (
          <>
            <span className="mt-2 h-px w-16 bg-gold/40" />
            <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-gold">
              Risk First. Profit Follows.
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size={size} animated={animated} />
      <span className="font-display text-xl font-semibold tracking-[0.2em] text-bone">
        NAVA
      </span>
    </div>
  );
}
