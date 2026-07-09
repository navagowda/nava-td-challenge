"use client";

import { motion } from "framer-motion";

export default function ChartBackground() {
  const lines = [
    "M0 320 C 150 260, 300 300, 450 220 C 600 150, 750 200, 900 120 C 1050 60, 1200 100, 1350 40",
    "M0 380 C 180 340, 320 400, 480 340 C 640 280, 780 340, 940 280 C 1100 220, 1250 260, 1400 200",
    "M0 440 C 200 420, 340 460, 500 420 C 660 380, 800 440, 960 400 C 1120 360, 1260 400, 1400 360",
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-void-radial" />
      <div className="absolute inset-0 grid-noise opacity-40" />
      <svg
        viewBox="0 0 1400 500"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-70"
      >
        {lines.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke={i === 0 ? "url(#hero-gold)" : "#1B1B1F"}
            strokeWidth={i === 0 ? 2 : 1}
            strokeDasharray="2000"
            initial={{ strokeDashoffset: 2000 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 3.2, delay: i * 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
        <defs>
          <linearGradient id="hero-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8A6C15" stopOpacity="0" />
            <stop offset="50%" stopColor="#F4D77B" />
            <stop offset="100%" stopColor="#C9A227" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>

      {/* floating glow orbs */}
      <motion.div
        className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-gold/10 blur-[100px]"
        animate={{ y: [0, -24, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-gold/[0.06] blur-[120px]"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-void-900 to-transparent" />
    </div>
  );
}
