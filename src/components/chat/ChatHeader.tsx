"use client";

import { useChat } from "@/store/ChatContext";
import { MODELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
}

export function ChatHeader({ onMenuClick, onSettingsClick }: ChatHeaderProps) {
  const { activeSession, state } = useChat();

  return (
    <header className="glass-subtle border-b border-white/5 px-3 py-2.5 flex items-center gap-2 shrink-0 z-20">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center glass-subtle hover:bg-white/10 transition-colors text-lg"
        aria-label="菜单"
      >
        ☰
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0 text-center lg:text-left">
        <h1 className="text-base font-semibold truncate text-foreground/90">
          {activeSession?.title || "DeepSeek Glass"}
        </h1>
        {activeSession && (
          <p className="text-xs text-foreground/40 truncate">
            {MODELS.find((m) => m.id === activeSession.model)?.name || activeSession.model}
          </p>
        )}
      </div>

      {/* Streaming indicator */}
      {state.streamingStatus === "streaming" && (
        <span className="flex items-center gap-1 text-xs text-indigo-400 animate-glass-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          回复中
        </span>
      )}

      {/* Settings button */}
      <button
        onClick={onSettingsClick}
        className="w-9 h-9 rounded-full flex items-center justify-center glass-subtle hover:bg-white/10 transition-colors text-lg"
        aria-label="设置"
      >
        ⚙️
      </button>
    </header>
  );
}
