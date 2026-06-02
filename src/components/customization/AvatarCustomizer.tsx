"use client";

import { useState } from "react";
import { useSettings } from "@/store/SettingsContext";
import { AVATAR_PRESETS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { AvatarConfig } from "@/store/types";

export function AvatarCustomizer() {
  const { state, setAvatar } = useSettings();
  const [urlInput, setUrlInput] = useState("");

  const currentValue =
    state.userAvatar.type === "preset"
      ? state.userAvatar.value
      : state.userAvatar.value;

  const handlePreset = (preset: (typeof AVATAR_PRESETS)[number]) => {
    setAvatar(preset);
  };

  const handleUrl = () => {
    if (!urlInput.trim()) return;
    setAvatar({ type: "url", value: urlInput.trim() });
    setUrlInput("");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground/70">你的头像</span>
        <span className="text-2xl">{currentValue}</span>
      </div>

      {/* Preset grid */}
      <div className="grid grid-cols-6 gap-1.5">
        {AVATAR_PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePreset(preset)}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all",
              state.userAvatar.type === "preset" &&
                state.userAvatar.value === preset.value
                ? "glass glass-dark ring-1 ring-indigo-400/50 scale-105"
                : "glass-subtle hover:bg-white/10",
            )}
            title={preset.label}
          >
            {preset.value}
          </button>
        ))}
      </div>

      {/* Custom URL input */}
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
