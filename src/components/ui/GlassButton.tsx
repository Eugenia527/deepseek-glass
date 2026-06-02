"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ children, variant = "default", size = "md", className, ...props }, ref) => {
    const base = cn(
      "inline-flex items-center justify-center font-medium transition-all duration-200",
      "rounded-[16px] cursor-pointer select-none",
      "active:scale-[0.97] active:transition-transform active:duration-100",
    );

    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-5 py-2.5 text-base gap-2",
      lg: "px-7 py-3.5 text-lg gap-2.5",
    };

    const variants = {
      default:
        "glass glass-dark glass-interactive text-foreground",
      accent:
        "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:translate-y-[-1px]",
      ghost:
        "bg-transparent hover:bg-white/10 text-foreground",
    };

    return (
      <button
        ref={ref}
        className={cn(base, sizes[size], variants[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

GlassButton.displayName = "GlassButton";
