"use client";

import { useChat } from "@/store/ChatContext";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { MessageBubble } from "./MessageBubble";
import { WelcomeScreen } from "./WelcomeScreen";
import { useEffect } from "react";

interface ChatMessagesProps {
  onPromptClick?: (prompt: string) => void;
}

export function ChatMessages({ onPromptClick }: ChatMessagesProps) {
  const { activeSession, state } = useChat();
  const messages = activeSession?.messages || [];
  const { containerRef, handleScroll, scrollToBottom } = useAutoScroll(
    messages.length,
  );

  // Scroll when messages change or streaming
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, messages[messages.length - 1]?.content, scrollToBottom]);

  if (!activeSession || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <WelcomeScreen onPromptClick={onPromptClick} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto messages-scroll scrollbar-glass px-3 py-4 flex flex-col gap-4"
    >
      {messages.map((msg, i) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isStreaming={
            state.streamingStatus === "streaming" &&
            i === messages.length - 1 &&
            msg.role === "assistant"
          }
        />
      ))}

      {/* Error banner */}
      {state.error && (
        <div className="glass-subtle border border-red-400/30 rounded-xl p-3 text-sm text-red-400 text-center mx-4">
          ⚠️ {state.error}
        </div>
      )}

      {/* Bottom spacer for scroll */}
      <div className="h-2 shrink-0" />
    </div>
  );
}
