"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSettings } from "@/store/SettingsContext";
import { MODELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (content: string) => void;
  onStop?: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export function ChatInput({
  onSend,
  onStop,
  isStreaming,
  disabled,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { state: settings, setDefaultModel } = useSettings();

  // Auto-resize textarea
  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleSend = () => {
    if (!value.trim() || isStreaming || disabled) return;
    onSend(value);
    setValue("");
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="shrink-0 px-3 pb-3 pt-1 z-20">
      <div className="glass-chat-bar relative flex flex-col">
        {/* Model selector + input area */}
        <div className="flex items-end gap-2 p-3">
          {/* Model selector */}
          <select
            value={settings.defaultModel}
            onChange={(e) => setDefaultModel(e.target.value)}
            className="glass-subtle rounded-full px-3 py-2 text-xs font-medium text-foreground/70 outline-none cursor-pointer appearance-none pr-7 bg-no-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 8px center",
            }}
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="发送消息..."
            disabled={disabled}
            className={cn(
              "flex-1 bg-transparent border-none outline-none resize-none",
              "text-foreground placeholder:text-foreground/25",
              "text-base leading-6 py-1 max-h-40",
              disabled && "opacity-40",
            )}
          />

          {/* Send / Stop button */}
          {isStreaming ? (
            <button
              onClick={onStop}
              className="w-9 h-9 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors shrink-0"
              aria-label="停止"
            >
              <span className="w-3 h-3 bg-red-400 rounded-sm" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!value.trim() || disabled}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shrink-0",
                value.trim() && !disabled
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400"
                  : "glass-subtle text-foreground/25",
              )}
              aria-label="发送"
            >
              ↑
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
