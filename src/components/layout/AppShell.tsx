"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  fullWidth?: boolean;
  compact?: boolean;
}

export default function AppShell({
  children,
  fullWidth = false,
  compact = false,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-void-900 bg-void-radial">
      <Sidebar />
      <MobileNav />
      <main
        className={cn(
          "pb-16 pt-24 lg:ml-64 lg:pt-8",
          compact ? "px-3 lg:px-4" : "px-5 lg:px-10"
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "min-w-0",
            fullWidth ? "w-full max-w-none" : "mx-auto max-w-7xl"
          )}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
