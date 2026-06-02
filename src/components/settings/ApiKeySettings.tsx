"use client";

import { useState } from "react";
import { useSettings } from "@/store/SettingsContext";
import { GlassInput } from "@/components/ui/GlassInput";

export function ApiKeySettings() {
  const { state, setApiKey } = useSettings();
  const [show, setShow] = useState(false);

  return (
    <div className="glass-subtle rounded-xl p-4 space-y-3">
      <p className="text-xs text-foreground/50">
        输入你的 DeepSeek API Key，Key 仅保存在本地浏览器中。
        <a
          href="https://platform.deepseek.com/api_keys"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:underline ml-1"
        >
          获取 Key →
        </a>
      </p>

      <div className="relative flex gap-2">
        <div className="flex-1">
          <GlassInput
            type={show ? "text" : "password"}
            value={state.apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-xxxxxxxxxxxxxxxx"
            className="pr-10"
          />
        </div>
        <button
          onClick={() => setShow(!show)}
          className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center text-lg hover:bg-white/10 transition-colors shrink-0"
          aria-label={show ? "隐藏" : "显示"}
        >
          {show ? "🙈" : "👁️"}
        </button>
      </div>

      {state.apiKey && (
        <p className="text-xs text-green-400/80">
          ✓ API Key 已配置
          {state.apiKey.startsWith("sk-") ? "" : " (格式可能不正确)"}
        </p>
      )}
    </div>
  );
}
