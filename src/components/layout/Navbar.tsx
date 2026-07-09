"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import GlowButton from "@/components/ui/GlowButton";
import Logo from "@/components/ui/Logo";
import { ArrowUpRight } from "lucide-react";

export default function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-full glass px-6 py-3">
        <Link href="/">
          <Logo size={28} />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-bone-dim md:flex">
          <a href="#philosophy" className="transition-colors hover:text-bone">
            Philosophy
          </a>
          <a href="#features" className="transition-colors hover:text-bone">
            Workspace
          </a>
          <a href="#preview" className="transition-colors hover:text-bone">
            Preview
          </a>
        </nav>
        <Link href="/login">
          <GlowButton variant="outline" icon={<ArrowUpRight size={15} />}>
            Private login
          </GlowButton>
        </Link>
      </div>
    </motion.header>
  );
}
