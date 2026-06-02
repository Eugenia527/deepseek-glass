"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useChat } from "@/store/ChatContext";
import { useSettings } from "@/store/SettingsContext";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import { DEEPSEEK_BASE_URL } from "@/lib/constants";
import { formatDate, formatTime, cn } from "@/lib/utils";
import { SettingsSheet } from "@/components/settings/SettingsSheet";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "@/store/types";

// ── Messages List View ──────────────────────────────────────────────

function MessagesListPage() {
  const router = useRouter();
  const { state: chatState, switchSession, newSession, deleteSession } = useChat();
  const { state: settings } = useSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const sorted = [...chatState.sessions].sort((a, b) => b.updatedAt - a.updatedAt);

  const handleNewChat = () => {
    newSession(settings.defaultModel);
    const sessions = chatState.sessions;
    const newId = sessions[sessions.length - 1]?.id;
    if (newId) router.push(`/chat?id=${newId}`);
  };

  const handleOpenChat = (id: string) => {
    switchSession(id);
    router.push(`/chat?id=${id}`);
  };

  const bgStyle =
    settings.chatBackground.type === "preset-gradient"
      ? settings.chatBackground.value
      : `url(${settings.chatBackground.value}) center/cover fixed`;

  return (
    <div className="h-dvh flex flex-col relative" style={{ background: bgStyle }}>
      <div className="absolute inset-0 bg-black/5 dark:bg-black/30 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
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
              {mounted && !settings.apiKey && (
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
                    <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-xl shrink-0 shadow-sm overflow-hidden">
                      {settings.robotAvatar.type === "url" ? (
                        <img src={settings.robotAvatar.value} alt="AI" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        settings.robotAvatar.value
                      )}
                    </div>
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

// ── Chat Detail View ─────────────────────────────────────────────────

function ChatDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const chat = useChat();
  const { state: settings } = useSettings();
  const { sendMessage } = useStreamingChat();
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const session = chat.state.sessions.find((s) => s.id === id);
  const messages = session?.messages || [];

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { chat.switchSession(id); }, [id]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, messages[messages.length - 1]?.content]);
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || streaming) return;
    if (!settings.apiKey) { setError("请先在设置中配置 API Key"); return; }

    const content = input.trim();
    setInput("");
    setError(null);
    chat.addMessage("user", content);
    chat.addMessage("assistant", "");

    const existingMsgs = session?.messages || [];
    const apiMsgs = [
      { role: "system" as const, content: "你是一个有帮助的 AI 助手。请用简洁、准确、友好的方式回答问题。支持 Markdown 格式。" },
      ...existingMsgs.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user" as const, content },
    ];

    setStreaming(true);
    sendMessage(apiMsgs, session?.model || settings.defaultModel, settings.apiKey, {
      onChunk: (text) => { chat.appendChunk(text); },
      onDone: () => { chat.streamComplete(); setStreaming(false); autoTitle(); },
      onError: (err) => { chat.streamError(err); setStreaming(false); setError(err); },
    });
  };

  const autoTitle = async () => {
    const s = chat.state.sessions.find((s2) => s2.id === id);
    if (!s || s.title !== "新对话") return;
    const uMsg = s.messages.find((m) => m.role === "user");
    const aMsg = s.messages.find((m) => m.role === "assistant" && m.content.length > 0);
    if (!uMsg || !aMsg) return;
    try {
      const res = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${settings.apiKey}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: `用中文为这段对话生成一个3-5字的简短标题，只回复标题:\n用户: ${uMsg.content.slice(0, 200)}\n助手: ${aMsg.content.slice(0, 200)}` }],
          model: "deepseek-chat",
          stream: false,
        }),
      });
      if (res.ok) {
        const d = await res.json();
        const t = d.choices?.[0]?.message?.content?.trim() || "新对话";
        chat.setSessionTitle(s.id, t.slice(0, 20));
      }
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const bgStyle =
    settings.chatBackground.type === "preset-gradient"
      ? settings.chatBackground.value
      : `url(${settings.chatBackground.value}) center/cover fixed`;

  const shouldShowTimestamp = (i: number, msg: Message) => {
    if (i === 0) return true;
    return msg.timestamp - messages[i - 1].timestamp > 300000;
  };

  return (
    <div className="h-dvh flex flex-col relative" style={{ background: bgStyle }}>
      <div className="absolute inset-0 bg-white/30 dark:bg-black/30 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        <header className="glass-strong border-b border-white/5 px-3 pt-12 pb-2 shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/chat")}
              className="w-8 h-8 flex items-center justify-center text-indigo-400"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="w-9 h-9 rounded-full glass flex items-center justify-center text-lg shrink-0 overflow-hidden">
              {settings.robotAvatar.type === "url" ? (
                <img src={settings.robotAvatar.value} alt="AI" className="w-full h-full object-cover rounded-full" />
              ) : (
                settings.robotAvatar.value
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-semibold text-foreground/90 truncate">
                {session?.title || "DeepSeek"}
              </h1>
              {streaming && <p className="text-xs text-indigo-400 animate-glass-pulse">正在输入...</p>}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-glass px-3 py-2">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-foreground/30">发送消息开始对话</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {messages.map((msg, i) => {
                const isUser = msg.role === "user";
                const isLast = i === messages.length - 1;
                const isStreamingMsg = isLast && msg.role === "assistant" && streaming;
                return (
                  <div key={msg.id}>
                    {shouldShowTimestamp(i, msg) && (
                      <div className="flex justify-center my-3">
                        <span className="text-[10px] text-foreground/25 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    )}
                    <div className={cn("flex gap-2", isUser ? "flex-row-reverse" : "flex-row")}>
                      {!isUser && (
                        <div className="w-7 h-7 rounded-full glass flex items-center justify-center text-sm shrink-0 mt-1 overflow-hidden">
                          {settings.robotAvatar.type === "url" ? (
                            <img src={settings.robotAvatar.value} alt="AI" className="w-full h-full object-cover rounded-full" />
                          ) : (
                            settings.robotAvatar.value
                          )}
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[75%] px-4 py-2.5 text-[15px] leading-relaxed",
                          isUser
                            ? "bubble-user"
                            : "bubble-ai message-content",
                          isStreamingMsg && "streaming-cursor",
                        )}
                      >
                        {isStreamingMsg && !msg.content ? (
                          <span className="text-foreground/30 italic text-sm">...</span>
                        ) : !isUser ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        ) : (
                          msg.content
                        )}
                      </div>
                      {isUser && (
                        <div className="w-7 h-7 rounded-full glass flex items-center justify-center text-sm shrink-0 mt-1 overflow-hidden">
                          {settings.userAvatar.type === "url" ? (
                            <img src={settings.userAvatar.value} alt="User" className="w-full h-full object-cover rounded-full" />
                          ) : (
                            settings.userAvatar.value
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {error && (
                <div className="glass-subtle border border-red-400/20 rounded-2xl p-3 text-sm text-red-400 text-center my-2">
                  {error}
                  <button onClick={() => setError(null)} className="ml-2 underline text-xs">关闭</button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="glass-strong border-t border-white/5 px-3 pt-2 pb-8 shrink-0 z-20">
          <div className="flex items-end gap-2">
            <div className="flex-1 glass-input rounded-[24px] flex items-end px-4 py-2 min-h-[42px]">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="iMessage"
                className="flex-1 bg-transparent border-none outline-none resize-none text-foreground placeholder:text-foreground/20 text-base leading-6 max-h-32 py-0.5"
                style={{ scrollbarWidth: "none" }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || streaming}
              className={cn(
                "w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0 transition-all duration-200 mb-0.5",
                input.trim() && !streaming
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 scale-100"
                  : "bg-white/10 text-foreground/20 scale-90",
              )}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Router ───────────────────────────────────────────────────────────

function ChatRouter() {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("id");

  if (chatId) return <ChatDetailPage id={chatId} />;
  return <MessagesListPage />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="h-dvh glass-strong flex items-center justify-center">
        <span className="text-foreground/40">加载中...</span>
      </div>
    }>
      <ChatRouter />
    </Suspense>
  );
}
