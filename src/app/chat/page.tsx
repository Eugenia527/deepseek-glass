"use client";

import { useRouter } from "next/navigation";
import { useChat } from "@/store/ChatContext";
import { useSettings } from "@/store/SettingsContext";
import { MODELS, SUGGESTED_PROMPTS } from "@/lib/constants";
import { formatDate, cn } from "@/lib/utils";
import { useState } from "react";
import { SettingsSheet } from "@/components/settings/SettingsSheet";

export default function MessagesPage() {
  const router = useRouter();
  const { state: chatState, switchSession, newSession, deleteSession } = useChat();
  const { state: settings } = useSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const sorted = [...chatState.sessions].sort((a, b) => b.updatedAt - a.updatedAt);

  const handleNewChat = () => {
    newSession(settings.defaultModel);
    const newId = chatState.sessions[0]?.id;
    if (newId) router.push(`/chat/${newId}`);
  };

  const handleOpenChat = (id: string) => {
    switchSession(id);
    router.push(`/chat/${id}`);
  };

  // Apply background
  const bgStyle =
    settings.chatBackground.type === "preset-gradient"
      ? settings.chatBackground.value
      : `url(${settings.chatBackground.value}) center/cover fixed`;

  return (
    <div className="h-dvh flex flex-col relative" style={{ background: bgStyle }}>
      <div className="absolute inset-0 bg-black/5 dark:bg-black/30 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        {/* iOS Navigation Bar */}
        <header className="glass-strong border-b border-white/5 px-5 pt-12 pb-3 shrink-0 z-20">
          <div className="flex items-center justify-between">
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="text-indigo-400 font-medium text-base"
                >
                  完成
                </button>
                <h1 className="text-lg font-bold text-foreground/90">选择对话</h1>
                <div className="w-12" />
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="text-indigo-400 text-sm font-medium"
                >
                  编辑
                </button>
                <h1 className="text-xl font-bold text-foreground/90 tracking-tight">
                  信息
                </h1>
                <button
                  onClick={handleNewChat}
                  className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </header>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto scrollbar-glass">
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-4">
              <div className="w-16 h-16 rounded-full glass-strong flex items-center justify-center text-3xl">
                💬
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground/70">没有对话</h2>
                <p className="text-sm text-foreground/40 mt-1">
                  点击右上角 + 开始与 DeepSeek 对话
                </p>
              </div>
              {!settings.apiKey && (
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="glass glass-dark glass-interactive px-5 py-2.5 rounded-full text-sm text-foreground/70"
                >
                  ⚙️ 先配置 API Key
                </button>
              )}
            </div>
          ) : (
            <div className="py-2">
              {sorted.map((session) => {
                const lastMsg = session.messages.slice(-1)[0];
                const modelName = MODELS.find((m) => m.id === session.model)?.name || "";
                return (
                  <div
                    key={session.id}
                    onClick={() => {
                      if (editing) return;
                      handleOpenChat(session.id);
                    }}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-2.5 mx-2 my-0.5 rounded-2xl transition-all",
                      "hover:bg-white/5 cursor-pointer",
                      editing && "cursor-default",
                    )}
                  >
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-xl shrink-0 shadow-sm">
                      🤖
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex items-center justify-between">
                        <p className="text-base font-medium text-foreground/85 truncate">
                          {session.title}
                        </p>
                        <span className="text-xs text-foreground/30 shrink-0 ml-2">
                          {formatDate(session.updatedAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <p className="text-sm text-foreground/35 truncate flex-1">
                          {lastMsg ? lastMsg.content.slice(0, 50) : "新对话"}
                        </p>
                        {session.messages.length > 0 && (
                          <span className="text-[10px] text-foreground/20 bg-white/5 px-1.5 py-0.5 rounded-full shrink-0">
                            {session.messages.length}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete in edit mode */}
                    {editing && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shrink-0"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <line x1="6" y1="6" x2="18" y2="18" />
                          <line x1="6" y1="18" x2="18" y2="6" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Tab Bar (iOS style) */}
        <nav className="glass-strong border-t border-white/5 px-6 pb-8 pt-2 shrink-0 z-20">
          <div className="flex items-center justify-around">
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex flex-col items-center gap-0.5 text-foreground/40 hover:text-indigo-400 transition-colors"
            >
              <span className="text-xl">⚙️</span>
              <span className="text-[10px] font-medium">设置</span>
            </button>
            <div className="flex flex-col items-center gap-0.5 text-indigo-400">
              <span className="text-xl">💬</span>
              <span className="text-[10px] font-medium">对话</span>
            </div>
            <button
              onClick={() => router.push("/")}
              className="flex flex-col items-center gap-0.5 text-foreground/40 hover:text-indigo-400 transition-colors"
            >
              <span className="text-xl">🏠</span>
              <span className="text-[10px] font-medium">首页</span>
            </button>
          </div>
        </nav>
      </div>

      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
