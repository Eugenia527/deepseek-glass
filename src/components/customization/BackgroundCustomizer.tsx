"use client";

import { useState } from "react";
import { useSettings } from "@/store/SettingsContext";
import { BACKGROUND_PRESETS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { BackgroundConfig } from "@/store/types";

export function BackgroundCustomizer() {
  const { state, setBackground } = useSettings();
  const [urlInput, setUrlInput] = useState("");

  const handlePreset = (preset: (typeof BACKGROUND_PRESETS)[number]) => {
    setBackground(preset);
  };

  const handleUrl = () => {
    if (!urlInput.trim()) return;
    setBackground({ type: "url", value: urlInput.trim() });
    setUrlInput("");
  };

  const currentBg =
    state.chatBackground.type === "preset-gradient"
      ? state.chatBackground.value
      : `url(${state.chatBackground.value})`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground/70">聊天背景</span>
        <div
          className="w-8 h-8 rounded-lg border border-white/10"
          style={{ background: currentBg, backgroundSize: "cover" }}
        />
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {BACKGROUND_PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePreset(preset)}
            className={cn(
              "h-10 rounded-xl transition-all border-2",
              state.chatBackground.type === "preset-gradient" &&
                state.chatBackground.value === preset.value
                ? "border-indigo-400 scale-105"
                : "border-transparent hover:scale-105",
            )}
            style={{ background: preset.value }}
            title={preset.label}
          />
        ))}
      </div>

      <div className="flex gap-1.5">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="或输入图片 URL..."
          className="flex-1 glass-input text-xs py-1.5 px-3 rounded-xl"
          onKeyDown={(e) => e.key === "Enter" && handleUrl()}
        />
        <button
          onClick={handleUrl}
          disabled={!urlInput.trim()}
          className="px-3 py-1.5 rounded-xl glass-subtle text-xs hover:bg-white/10 disabled:opacity-30 transition-colors"
        >
          使用
        </button>
      </div>
    </div>
  );
}
