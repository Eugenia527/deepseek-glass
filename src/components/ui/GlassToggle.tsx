"use client";

import { cn } from "@/lib/utils";

interface GlassToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function GlassToggle({
  checked,
  onChange,
  disabled = false,
  className,
}: GlassToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-[31px] w-[51px] items-center rounded-full transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50",
        checked
          ? "bg-indigo-500"
          : "bg-black/20 dark:bg-white/15",
        disabled && "opacity-40 cursor-not-allowed",
        className,
      )}
      onClick={() => !disabled && onChange(!checked)}
    >
      <span
        className={cn(
          "inline-block h-[27px] w-[27px] rounded-full bg-white shadow-md",
          "transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
          checked ? "translate-x-[21px]" : "translate-x-[2px]",
        )}
      />
    </button>
  );
}
