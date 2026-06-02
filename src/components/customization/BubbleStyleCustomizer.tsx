"use client";

import { useSettings } from "@/store/SettingsContext";
import { BUBBLE_STYLES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { BubbleStyle } from "@/store/types";

export function BubbleStyleCustomizer() {
  const { state, setBubbleStyle } = useSettings();

  return (
    <div className="space-y-2">
      <span className="text-sm text-foreground/70">聊天气泡样式</span>
      <div className="flex gap-2">
        {BUBBLE_STYLES.map((style) => (
          <button
            key={style.value}
            onClick={() => setBubbleStyle(style.value)}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5",
              state.bubbleStyle === style.value
                ? "glass glass-dark ring-1 ring-indigo-400/50"
                : "glass-subtle hover:bg-white/10",
            )}
          >
            <span>{style.icon}</span>
            {style.label}
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className="flex flex-col gap-1.5 mt-2">
        <div
          className={cn(
            "self-end px-3 py-1.5 text-xs max-w-[70%]",
            state.bubbleStyle === "bubbles" && "bubble-user",
            state.bubbleStyle === "rounded" &&
              "bubble-rounded bg-pink-300/40 backdrop-blur-md text-pink-800",
            state.bubbleStyle === "flat" &&
              "bubble-flat bg-pink-300/40 backdrop-blur-md text-pink-800",
          )}
        >
          这是一条用户消息预览
        </div>
        <div
          className={cn(
            "self-start px-3 py-1.5 text-xs max-w-[70%]",
            state.bubbleStyle === "bubbles" && "bubble-ai",
            state.bubbleStyle === "rounded" && "bubble-rounded glass-subtle",
            state.bubbleStyle === "flat" && "bubble-flat glass-subtle",
          )}
        >
          这是 AI 回复预览
        </div>
      </div>
    </div>
  );
}
