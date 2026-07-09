"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-void-900 bg-void-radial">
      <Sidebar />
      <MobileNav />
      <main className="px-5 pb-16 pt-24 lg:ml-64 lg:px-10 lg:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-7xl min-w-0"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
