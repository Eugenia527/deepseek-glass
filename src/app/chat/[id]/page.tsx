"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@/store/ChatContext";
import { useSettings } from "@/store/SettingsContext";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import { cn, formatTime } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "@/store/types";

export default function ChatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const chat = useChat();
  const { state: settings } = useSettings();
  const { sendMessage, abort } = useStreamingChat();
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const session = chat.state.sessions.find((s) => s.id === id);
  const messages = session?.messages || [];

  // Switch to this session
  useEffect(() => {
    chat.switchSession(id);
  }, [id]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, messages[messages.length - 1]?.content]);

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || streaming) return;
    if (!settings.apiKey) {
      setError("请先在设置中配置 API Key");
      return;
    }

    const content = input.trim();
    setInput("");
    setError(null);

    // Add user message
    chat.addMessage("user", content);

    // Add empty assistant message placeholder
    chat.addMessage("assistant", "");

    // Build API messages
    const existingMsgs = session?.messages || [];
    const apiMsgs = [
      { role: "system" as const, content: "你是一个有帮助的 AI 助手。请用简洁、准确、友好的方式回答问题。支持 Markdown 格式。" },
      ...existingMsgs.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user" as const, content },
    ];

    setStreaming(true);
    sendMessage(apiMsgs, session?.model || settings.defaultModel, settings.apiKey, {
      onChunk: (text) => {
        chat.appendChunk(text);
      },
      onDone: () => {
        chat.streamComplete();
        setStreaming(false);
        // Auto title
        autoTitle();
      },
      onError: (err) => {
        chat.streamError(err);
        setStreaming(false);
        setError(err);
      },
    });
  };

  const autoTitle = async () => {
    const s = chat.state.sessions.find((s2) => s2.id === id);
    if (!s || s.title !== "新对话") return;
    const uMsg = s.messages.find((m) => m.role === "user");
    const aMsg = s.messages.find((m) => m.role === "assistant" && m.content.length > 0);
    if (!uMsg || !aMsg) return;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": settings.apiKey },
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const bgStyle =
    settings.chatBackground.type === "preset-gradient"
      ? settings.chatBackground.value
      : `url(${settings.chatBackground.value}) center/cover fixed`;

  // Group messages by date for timestamps
  const shouldShowTimestamp = (i: number, msg: Message) => {
    if (i === 0) return true;
    const prev = messages[i - 1];
    return msg.timestamp - prev.timestamp > 300000; // 5 min gap
  };

  return (
    <div className="h-dvh flex flex-col relative" style={{ background: bgStyle }}>
      <div className="absolute inset-0 bg-white/30 dark:bg-black/30 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        {/* iOS iMessage Navigation Bar */}
        <header className="glass-strong border-b border-white/5 px-3 pt-12 pb-2 shrink-0 z-20">
          <div className="flex items-center gap-3">
            {/* Back button */}
            <button
              onClick={() => router.push("/chat")}
              className="w-8 h-8 flex items-center justify-center text-indigo-400"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Contact avatar + name */}
            <div className="w-9 h-9 rounded-full glass flex items-center justify-center text-lg shrink-0">
              🤖
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-semibold text-foreground/90 truncate">
                {session?.title || "DeepSeek"}
              </h1>
              {streaming && (
                <p className="text-xs text-indigo-400 animate-glass-pulse">正在输入...</p>
              )}
            </div>
          </div>
        </header>

        {/* Messages */}
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
                      {/* Avatar (only for AI) */}
                      {!isUser && (
                        <div className="w-7 h-7 rounded-full glass flex items-center justify-center text-sm shrink-0 mt-1">
                          🤖
                        </div>
                      )}

                      {/* Bubble */}
                      <div
                        className={cn(
                          "max-w-[75%] px-4 py-2.5 text-[15px] leading-relaxed",
                          isUser
                            ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-[20px_20px_4px_20px] shadow-md shadow-indigo-500/20"
                            : "glass rounded-[20px_20px_20px_4px] message-content",
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

                      {/* Avatar (only for user) */}
                      {isUser && (
                        <div className="w-7 h-7 rounded-full glass flex items-center justify-center text-sm shrink-0 mt-1">
                          {settings.userAvatar.value}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Error */}
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

        {/* iMessage Input Bar */}
        <div className="glass-strong border-t border-white/5 px-3 pt-2 pb-8 shrink-0 z-20">
          <div className="flex items-end gap-2">
            {/* Text input */}
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

            {/* Send button */}
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
