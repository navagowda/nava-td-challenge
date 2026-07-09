"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "solid" | "outline" | "ghost";
  icon?: ReactNode;
}

export default function GlowButton({
  children,
  variant = "solid",
  icon,
  className,
  ...props
}: GlowButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 focus-visible:outline-gold",
        variant === "solid" &&
          "bg-gold-gradient text-void-950 shadow-gold-glow-sm hover:shadow-gold-glow hover:scale-[1.02]",
        variant === "outline" &&
          "border border-gold/40 text-bone hover:border-gold hover:bg-gold/5",
        variant === "ghost" && "text-bone-dim hover:text-bone",
        className
      )}
      {...props}
    >
      {children}
      {icon && (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
          {icon}
        </span>
      )}
    </button>
  );
}
