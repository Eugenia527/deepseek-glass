"use client";

import { useCallback, useRef } from "react";
import { DEEPSEEK_BASE_URL } from "@/lib/constants";

interface StreamCallbacks {
  onChunk: (text: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}

export function useStreamingChat() {
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (
      messages: { role: string; content: string }[],
      model: string,
      apiKey: string,
      callbacks: StreamCallbacks,
    ) => {
      const abort = new AbortController();
      abortRef.current = abort;

      try {
        const response = await fetch(
          `${DEEPSEEK_BASE_URL}/chat/completions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model,
              messages,
              stream: true,
              max_tokens: 8192,
            }),
            signal: abort.signal,
          },
        );

        if (!response.ok) {
          const status = response.status;
          if (status === 401)
            return callbacks.onError("API Key 无效，请在设置中检查");
          if (status === 429)
            return callbacks.onError("请求过于频繁，请稍后再试");
          if (status >= 500)
            return callbacks.onError("DeepSeek 服务暂时不可用，请稍后再试");
          return callbacks.onError(`请求失败 (${status})`);
        }

        const reader = response.body?.getReader();
        if (!reader) return callbacks.onError("无法读取响应流");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;

            const data = trimmed.slice(6);
            if (data === "[DONE]") {
              callbacks.onDone();
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) callbacks.onChunk(content);
            } catch {
              // skip malformed chunks
            }
          }
        }

        // If stream ended without [DONE]
        callbacks.onDone();
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          callbacks.onDone();
          return;
        }
        callbacks.onError(
          err instanceof Error ? err.message : "网络连接失败，请检查网络",
        );
      }
    },
    [],
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  return { sendMessage, abort };
}
