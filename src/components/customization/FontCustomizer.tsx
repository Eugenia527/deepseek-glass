"use client";

import { useSettings } from "@/store/SettingsContext";
import { FONT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { FontFamily } from "@/store/types";

export function FontCustomizer() {
  const { state, setFontFamily } = useSettings();

  const fontMap: Record<string, string> = {
    system: "var(--font-sans)",
    serif: "var(--font-serif)",
    mono: "var(--font-mono)",
  };

  return (
    <div className="space-y-2">
      <span className="text-sm text-foreground/70">字体</span>
      <div className="grid grid-cols-3 gap-2">
        {FONT_OPTIONS.map((font) => (
          <button
            key={font.value}
            onClick={() => setFontFamily(font.value as FontFamily)}
            className={cn(
              "py-2.5 rounded-xl text-sm transition-all",
              state.fontFamily === font.value
                ? "glass glass-dark ring-1 ring-indigo-400/50"
                : "glass-subtle hover:bg-white/10",
            )}
          >
            <span
              className="block text-xs"
              style={{ fontFamily: fontMap[font.value] || font.family }}
            >
              {font.label}
            </span>
            <span
              className="block text-[10px] text-foreground/40 mt-0.5"
              style={{ fontFamily: fontMap[font.value] || font.family }}
            >
              Aa 中文 预览
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
