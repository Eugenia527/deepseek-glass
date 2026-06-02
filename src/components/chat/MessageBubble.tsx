"use client";

import { useSettings } from "@/store/SettingsContext";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/utils";
import type { Message } from "@/store/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const { state: settings } = useSettings();
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  const bubbleClass = () => {
    if (isUser) {
      switch (settings.bubbleStyle) {
        case "rounded":
          return "bubble-rounded bg-indigo-500 text-white shadow-md";
        case "flat":
          return "bubble-flat bg-indigo-500 text-white";
        case "bubbles":
        default:
          return "bubble-user";
      }
    }
    if (isAssistant) {
      switch (settings.bubbleStyle) {
        case "rounded":
          return "bubble-rounded glass-subtle";
        case "flat":
          return "bubble-flat glass-subtle";
        case "bubbles":
        default:
          return "bubble-ai";
      }
    }
    return "";
  };

  return (
    <div
      className={cn(
        "flex gap-3 animate-scale-in",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-lg shrink-0 select-none",
          isUser
            ? "bg-indigo-500/20"
            : "glass-subtle",
        )}
      >
        {isUser ? (settings.userAvatar.value) : "🤖"}
      </div>

      {/* Bubble + Time */}
      <div className={cn("flex flex-col max-w-[80%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            bubbleClass(),
            isStreaming && "streaming-cursor",
            "message-content whitespace-pre-wrap break-words",
          )}
        >
          {isStreaming && !message.content ? (
            <span className="text-foreground/40 italic">思考中...</span>
          ) : isAssistant ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          ) : (
            <span>{message.content}</span>
          )}
        </div>
        <span className="text-[10px] text-foreground/30 mt-1 px-2">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
