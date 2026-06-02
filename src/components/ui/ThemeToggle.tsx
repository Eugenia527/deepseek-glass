"use client";

import { useTheme } from "@/store/ThemeContext";
import type { ThemeMode } from "@/store/types";

const modes: { mode: ThemeMode; icon: string; label: string }[] = [
  { mode: "light", icon: "☀️", label: "浅色" },
  { mode: "dark", icon: "🌙", label: "深色" },
  { mode: "system", icon: "💻", label: "系统" },
];

export function ThemeToggle() {
  const { state, setMode } = useTheme();

  return (
    <div className="flex items-center gap-1 glass-subtle rounded-full p-1">
      {modes.map(({ mode, icon, label }) => (
        <button
          key={mode}
          title={label}
          onClick={() => setMode(mode)}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-200 ${
            state.mode === mode
              ? "bg-white/20 shadow-sm scale-105"
              : "hover:bg-white/10"
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
