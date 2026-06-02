"use client";

import { useState, useRef } from "react";
import { useSettings } from "@/store/SettingsContext";
import { AVATAR_PRESETS, ROBOT_AVATAR_PRESETS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { AvatarConfig } from "@/store/types";

interface AvatarCustomizerProps {
  mode: "user" | "robot";
}

export function AvatarCustomizer({ mode }: AvatarCustomizerProps) {
  const { state, setAvatar, setRobotAvatar } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatar = mode === "user" ? state.userAvatar : state.robotAvatar;
  const presets = mode === "user" ? AVATAR_PRESETS : ROBOT_AVATAR_PRESETS;
  const onSet = mode === "user" ? setAvatar : setRobotAvatar;

  const currentValue = avatar.value;

  const handlePreset = (preset: AvatarConfig) => {
    onSet(preset);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      onSet({ type: "url", value: dataUrl, label: file.name });
    };
    reader.readAsDataURL(file);
    // Reset so the same file can be re-selected
    e.target.value = "";
  };

  const label = mode === "user" ? "你的头像" : "机器人头像";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground/70">{label}</span>
        <div className="w-9 h-9 rounded-xl glass flex items-center justify-center overflow-hidden">
          {avatar.type === "url" ? (
            <img
              src={avatar.value}
              alt={label}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <span className="text-xl">{currentValue}</span>
          )}
        </div>
      </div>

      {/* Preset grid */}
      <div className="grid grid-cols-6 gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePreset(preset)}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all",
              avatar.type === "preset" &&
                avatar.value === preset.value
                ? "glass glass-dark ring-1 ring-indigo-400/50 scale-105"
                : "glass-subtle hover:bg-white/10",
            )}
            title={preset.label}
          >
            {preset.value}
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
        <span>📷</span>
        上传本地照片
      </button>

      {avatar.type === "url" && avatar.label && (
        <p className="text-[10px] text-foreground/30 truncate">
          当前: {avatar.label}
        </p>
      )}
    </div>
  );
}
