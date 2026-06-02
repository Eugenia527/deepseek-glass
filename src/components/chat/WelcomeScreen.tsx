"use client";

import { useSettings } from "@/store/SettingsContext";
import { SUGGESTED_PROMPTS } from "@/lib/constants";

interface WelcomeScreenProps {
  onPromptClick?: (prompt: string) => void;
}

export function WelcomeScreen({ onPromptClick }: WelcomeScreenProps) {
  const { state: settings } = useSettings();
  const displayName = typeof settings.userAvatar.value === "string" && settings.userAvatar.value.length <= 2
    ? settings.userAvatar.value : "👤";

  return (
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto text-center animate-scale-in">
      {/* Claude-style greeting avatar */}
      <div className="w-20 h-20 rounded-full glass-strong flex items-center justify-center text-4xl">
        🤖
      </div>

      <div>
        <h2 className="text-xl font-bold text-foreground/90 mb-1">
          你好，{displayName}
        </h2>
        <p className="text-sm text-foreground/50">
          我是 DeepSeek AI 助手，有什么可以帮你的？
        </p>
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onPromptClick?.(prompt)}
            className="glass-subtle glass-interactive rounded-full px-4 py-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* No API key hint */}
      {!settings.apiKey && (
        <div className="glass-subtle border border-yellow-400/20 rounded-xl p-3 text-sm text-yellow-400/80">
          ⚠️ 尚未设置 API Key，请点击右上角 ⚙️ 配置
        </div>
      )}
    </div>
  );
}
