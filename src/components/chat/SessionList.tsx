"use client";

import { useChat } from "@/store/ChatContext";
import { useSettings } from "@/store/SettingsContext";
import { MODELS } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";

interface SessionListProps {
  onClose?: () => void;
}

export function SessionList({ onClose }: SessionListProps) {
  const { state, switchSession, deleteSession, activeSession, newSession } =
    useChat();
  const { state: settings } = useSettings();

  const sorted = [...state.sessions].sort(
    (a, b) => b.updatedAt - a.updatedAt,
  );

  const handleSelect = (id: string) => {
    switchSession(id);
    onClose?.();
  };

  const handleNew = () => {
    newSession(settings.defaultModel);
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full">
      <button
        onClick={handleNew}
        className="glass glass-dark glass-interactive mx-3 mt-3 px-4 py-2.5 text-sm font-medium flex items-center gap-2"
      >
        <span className="text-lg">+</span>
        新对话
      </button>

      <div className="flex-1 overflow-y-auto scrollbar-glass mt-2 px-2">
        {sorted.length === 0 && (
          <p className="text-xs text-foreground/30 text-center py-8">
            暂无对话记录
          </p>
        )}
        {sorted.map((session) => {
          const modelName =
            MODELS.find((m) => m.id === session.model)?.name || session.model;
          const isActive = session.id === activeSession?.id;
          const lastMsg = session.messages[session.messages.length - 1];

          return (
            <div
              key={session.id}
              onClick={() => handleSelect(session.id)}
              className={cn(
                "group relative mx-1 mb-1 rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-200",
                isActive ? "glass glass-dark" : "hover:bg-white/5",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate text-foreground/80">
                    {session.title}
                  </p>
                  <p className="text-xs text-foreground/35 truncate mt-0.5">
                    {lastMsg ? lastMsg.content.slice(0, 40) : "空对话"}
                  </p>
                  <p className="text-[10px] text-foreground/20 mt-1">
                    {modelName} · {formatDate(session.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-500/20 hover:text-red-400 transition-all shrink-0"
                  aria-label="删除"
                >
                  🗑
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
