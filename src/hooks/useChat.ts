"use client";

import { useCallback } from "react";
import { useChat } from "@/store/ChatContext";
import { useSettings } from "@/store/SettingsContext";
import { useStreamingChat } from "./useStreamingChat";

/**
 * High-level chat orchestration hook.
 * Wires together ChatContext + useStreamingChat + Settings.
 */
export function useChatActions() {
  const chat = useChat();
  const { state: settings } = useSettings();
  const { sendMessage, abort } = useStreamingChat();

  const send = useCallback(
    async (content: string) => {
      if (!settings.apiKey) {
        chat.streamError("请先在设置中配置 DeepSeek API Key");
        return;
      }
      if (!content.trim()) return;

      // Auto-create session if needed
      if (!chat.state.activeSessionId) {
        chat.newSession(settings.defaultModel);
      }

      const model =
        chat.activeSession?.model || settings.defaultModel;

      // Build API messages from EXISTING session (before adding new messages)
      const existingMessages = chat.activeSession?.messages || [];
      const apiMessages = [
        {
          role: "system" as const,
          content:
            "你是一个有帮助的 AI 助手。请用简洁、准确的方式回答问题。支持 Markdown 格式。",
        },
        ...existingMessages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user" as const, content: content.trim() },
      ];

      // Now add user message to session
      chat.addMessage("user", content.trim());

      // Create placeholder for streaming
      chat.addMessage("assistant", "");

      sendMessage(apiMessages, model, settings.apiKey, {
        onChunk: (text) => {
          chat.appendChunk(text);
        },
        onDone: () => {
          chat.streamComplete();
          // Auto-generate title if first exchange
          generateTitleIfNeeded();
        },
        onError: (err) => {
          chat.streamError(err);
        },
      });
    },
    [settings, chat, sendMessage],
  );

  const generateTitleIfNeeded = useCallback(async () => {
    const session = chat.activeSession;
    if (!session || session.title !== "新对话") return;

    const firstUserMsg = session.messages.find((m) => m.role === "user");
    const firstAiMsg = session.messages.find(
      (m) => m.role === "assistant" && m.content.length > 0,
    );
    if (!firstUserMsg || !firstAiMsg) return;

    try {
      const response = await fetch(`/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": settings.apiKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Generate a short 3-5 word title in Chinese for this conversation. Reply ONLY with the title, nothing else.\n\nUser: ${firstUserMsg.content.slice(0, 300)}\nAssistant: ${firstAiMsg.content.slice(0, 300)}`,
            },
          ],
          model: "deepseek-chat",
          stream: false,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const title =
          data.choices?.[0]?.message?.content?.trim() || "新对话";
        chat.setSessionTitle(session.id, title.slice(0, 30));
      }
    } catch {
      // Title generation is non-critical, ignore errors
    }
  }, [chat, settings.apiKey]);

  const stopStreaming = useCallback(() => {
    abort();
    chat.streamComplete();
  }, [abort, chat]);

  return {
    send,
    stopStreaming,
    isStreaming: chat.state.streamingStatus === "streaming",
    error: chat.state.error,
    clearError: chat.clearError,
  };
}
