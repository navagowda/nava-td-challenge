"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
import { createClient } from "@/lib/supabase/client";
import { navLinks } from "@/lib/navLinks";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-void-border bg-void-900/95 backdrop-blur-xl lg:flex">
      <div className="px-6 py-7">
        <Logo size={26} />
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "text-void-950"
                  : "text-bone-dim hover:bg-void-800 hover:text-bone"
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-gold-gradient shadow-gold-glow-sm"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon size={17} className="relative z-10" />
              <span className="relative z-10 font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-void-border p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-bone-faint transition-colors hover:bg-void-800 hover:text-loss"
        >
          <LogOut size={17} />
          <span>Exit workspace</span>
        </button>
      </div>
    </aside>
  );
}
