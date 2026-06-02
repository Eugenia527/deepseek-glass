"use client";

import { GlassSheet } from "@/components/ui/GlassSheet";
import { ApiKeySettings } from "./ApiKeySettings";
import { AppearanceSettings } from "./AppearanceSettings";

interface SettingsSheetProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsSheet({ open, onClose }: SettingsSheetProps) {
  return (
    <GlassSheet open={open} onClose={onClose}>
      <h2 className="text-lg font-bold text-foreground/90 mb-5 text-center">
        设置
      </h2>

      <div className="flex flex-col gap-5 max-w-lg mx-auto">
        {/* API Key Section */}
        <section>
          <h3 className="text-sm font-semibold text-foreground/60 mb-2 flex items-center gap-2">
            🔑 API 配置
          </h3>
          <ApiKeySettings />
        </section>

        <hr className="border-white/5" />

        {/* Appearance Section */}
        <section>
          <h3 className="text-sm font-semibold text-foreground/60 mb-2 flex items-center gap-2">
            🎨 外观定制
          </h3>
          <AppearanceSettings />
        </section>

        <hr className="border-white/5" />

        {/* About Section */}
        <section className="text-center pb-4">
          <p className="text-xs text-foreground/30">
            DeepSeek Glass v1.0 · iOS 26 Liquid Glass
          </p>
          <p className="text-[10px] text-foreground/20 mt-1">
            Powered by DeepSeek API · Built with Next.js
          </p>
        </section>
      </div>
    </GlassSheet>
  );
}
