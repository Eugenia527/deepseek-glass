"use client";

import { useState, useRef } from "react";
import { useSettings } from "@/store/SettingsContext";
import { BACKGROUND_PRESETS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function BackgroundCustomizer() {
  const { state, setBackground } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePreset = (preset: (typeof BACKGROUND_PRESETS)[number]) => {
    setBackground(preset);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setBackground({ type: "url", value: dataUrl, label: file.name });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
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
          style={{
            background: currentBg,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {BACKGROUND_PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePreset(preset)}
            className={cn(
              "h-10 rounded-xl transition-all border-2",
              "flex items-center justify-center text-[10px] text-white/70 font-medium",
              state.chatBackground.type === "preset-gradient" &&
                state.chatBackground.value === preset.value
                ? "border-indigo-400 scale-105"
                : "border-transparent hover:scale-105",
            )}
            style={{
              background: preset.value,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            title={preset.label}
          >
            {preset.label === "纯白" ? "⬜" : ""}
          </button>
        ))}
      </div>

      {/* File upload button */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full py-2 rounded-xl glass-subtle text-xs hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
      >
        <span>🖼️</span>
        上传本地背景图片
      </button>

      {state.chatBackground.type === "url" && state.chatBackground.label && (
        <p className="text-[10px] text-foreground/30 truncate">
          当前背景: {state.chatBackground.label}
        </p>
      )}
    </div>
  );
}
