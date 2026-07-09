"use client";

import { motion } from "framer-motion";

/**
 * NAVA's signature element: a candlestick line that behaves like a heartbeat
 * monitor. It flatlines, spikes, and steadies — encoding the brand idea that
 * discipline (a steady baseline) comes before any profit (the spikes).
 */
export default function RiskPulse({ className = "" }: { className?: string }) {
  const candles = [
    { x: 10, h: 8, up: true },
    { x: 26, h: 14, up: true },
    { x: 42, h: 6, up: false },
    { x: 58, h: 22, up: true },
    { x: 74, h: 10, up: false },
    { x: 90, h: 30, up: true },
    { x: 106, h: 12, up: true },
    { x: 122, h: 18, up: false },
    { x: 138, h: 40, up: true },
    { x: 154, h: 16, up: true },
    { x: 170, h: 9, up: false },
    { x: 186, h: 26, up: true },
  ];

  return (
    <svg
      viewBox="0 0 200 60"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d="M0 40 L10 40 L10 30 L26 30 L26 15 L42 15 L42 26 L58 26 L58 8 L74 8 L74 22 L90 22 L90 4 L106 4 L106 16 L122 16 L122 28 L138 28 L138 2 L154 2 L154 12 L170 12 L170 24 L186 24 L186 6 L200 6"
        fill="none"
        stroke="url(#pulse-gradient)"
        strokeWidth="1.4"
        strokeDasharray="1000"
        initial={{ strokeDashoffset: 1000 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 2.6, ease: [0.16, 1, 0.3, 1] }}
      />
      {candles.map((c, i) => (
        <motion.rect
          key={i}
          x={c.x - 2.5}
          y={30 - c.h / 2}
          width={5}
          height={c.h}
          rx={1}
          fill={c.up ? "#C9A227" : "#77767A"}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 0.5, delay: 0.15 * i + 0.4 }}
          style={{ transformOrigin: "center" }}
        />
      ))}
      <defs>
        <linearGradient id="pulse-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8A6C15" />
          <stop offset="50%" stopColor="#F4D77B" />
          <stop offset="100%" stopColor="#C9A227" />
        </linearGradient>
      </defs>
    </svg>
  );
}
