"use client";

import { motion } from "framer-motion";

interface RiskDialProps {
  usedPct: number;
  size?: number;
}

export default function RiskDial({ usedPct, size = 180 }: RiskDialProps) {
  const clamped = Math.min(100, Math.max(0, usedPct));
  const radius = 70;
  const circumference = Math.PI * radius; // half circle
  const offset = circumference - (clamped / 100) * circumference;

  const color =
    clamped < 50 ? "#3ECF8E" : clamped < 80 ? "#E8C766" : "#FF5C5C";

  return (
    <div className="relative flex flex-col items-center" style={{ width: size }}>
      <svg viewBox="0 0 180 100" width={size} height={size * 0.56}>
        <path
          d="M10 95 A80 80 0 0 1 170 95"
          fill="none"
          stroke="#1B1B1F"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <motion.path
          d="M10 95 A80 80 0 0 1 170 95"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="-mt-8 flex flex-col items-center">
        <span className="font-mono text-3xl font-semibold text-bone">
          {clamped}%
        </span>
        <span className="text-xs uppercase tracking-widest text-bone-faint">
          Daily risk used
        </span>
      </div>
    </div>
  );
}
