"use client";

import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "strong" | "subtle";
  edgeHighlight?: boolean;
  interactive?: boolean;
  className?: string;
}

export function GlassCard({
  children,
  variant = "default",
  edgeHighlight = false,
  interactive = false,
  className,
  ...props
}: GlassCardProps) {
  const variantClass = {
    default: "glass glass-dark",
    strong: "glass-strong",
    subtle: "glass-subtle",
  }[variant];

  return (
    <div
      className={cn(
        variantClass,
        edgeHighlight && "glass-edge-highlight",
        interactive && "glass-interactive",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
