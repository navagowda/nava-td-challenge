"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, Mail, ShieldCheck, AlertCircle } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";
import RiskPulse from "@/components/ui/RiskPulse";
import Logo from "@/components/ui/Logo";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      // Hard navigation (not router.push) so the freshly-set session
      // cookie is guaranteed to be committed and sent on the very next
      // request — middleware reads it server-side, and a soft client-side
      // push can race ahead of that cookie actually being written.
      window.location.href = "/dashboard";
    } catch (err) {
      setError(
        err instanceof Error
          ? `Something went wrong: ${err.message}`
          : "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void-900 px-6">
      <div className="absolute inset-0 bg-void-radial" />
      <div className="absolute inset-0 grid-noise opacity-30" />
      <div className="absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-gold/10 blur-[110px]" />
      <div className="absolute -right-32 bottom-1/4 h-72 w-72 rounded-full bg-gold/[0.06] blur-[110px]" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass glass-gold-edge rounded-3xl p-8 shadow-card sm:p-10">
          <div className="mb-6 flex flex-col items-center text-center">
            <Link href="/" className="mb-5">
              <Logo variant="mark" size={44} animated />
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1 text-[11px] uppercase tracking-widest text-gold">
              <ShieldCheck size={12} />
              Private access only
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs uppercase tracking-wider text-bone-faint">
                Email
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-void-border bg-void-800 px-4 py-3 transition-colors focus-within:border-gold">
                <Mail size={16} className="text-bone-faint" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full bg-transparent text-sm text-bone placeholder:text-bone-faint focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs uppercase tracking-wider text-bone-faint">
                Password
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-void-border bg-void-800 px-4 py-3 transition-colors focus-within:border-gold">
                <Lock size={16} className="text-bone-faint" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-transparent text-sm text-bone placeholder:text-bone-faint focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-loss/30 bg-loss/10 px-4 py-3 text-sm text-loss">
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            <GlowButton type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying…" : "Enter workspace"}
            </GlowButton>
          </form>

          <div className="mt-8">
            <RiskPulse className="mx-auto h-8 w-40 opacity-60" />
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-bone-faint">
          This is a private, single-user login for personal forex trade
          tracking. No public sign-up exists — accounts are created directly
          in the Supabase dashboard.
        </p>
      </motion.div>
    </div>
  );
}
