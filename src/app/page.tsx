"use client";

import { useRouter } from "next/navigation";
import { useSettings } from "@/store/SettingsContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useEffect, useState } from "react";
import { GlassInput } from "@/components/ui/GlassInput";

export default function Home() {
  const router = useRouter();
  const { state, setApiKey } = useSettings();
  const [mounted, setMounted] = useState(false);
  const [keyInput, setKeyInput] = useState(state.apiKey || "");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSaveKey = () => {
    if (keyInput.trim()) {
      setApiKey(keyInput.trim());
    }
  };

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-4 gap-6 relative overflow-hidden">
      {/* Ambient background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-500/10 blur-[120px]" />
      </div>

      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Hero Card */}
      <GlassCard
        variant="strong"
        edgeHighlight
        className="w-full max-w-md p-8 flex flex-col items-center gap-5 animate-scale-in z-10"
      >
        {/* Logo */}
        <div className="w-20 h-20 rounded-[28px] glass flex items-center justify-center text-4xl shadow-glass-lg">
          🤖
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground/90 mb-1">
            DeepSeek Glass
          </h1>
          <p className="text-sm text-foreground/50 leading-relaxed">
            iOS 26 液态玻璃效果 · DeepSeek AI 驱动
            <br />
            聊天 · 自定义 · 优雅
          </p>
        </div>

        {/* Feature icons */}
        <div className="flex gap-4 text-sm text-foreground/40">
          <span className="flex items-center gap-1">💬 对话</span>
          <span className="flex items-center gap-1">🎨 定制</span>
          <span className="flex items-center gap-1">📱 PWA</span>
        </div>
      </GlassCard>

      {/* API Key Setup Card */}
      <GlassCard
        variant="default"
        className="w-full max-w-md p-5 space-y-3 animate-slide-up z-10"
        style={{ animationDelay: "0.1s", animationFillMode: "both" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🔑</span>
          <h2 className="text-sm font-semibold text-foreground/70">
            配置 API Key
          </h2>
        </div>

        <p className="text-xs text-foreground/40">
          输入 DeepSeek API Key 开始聊天。Key 仅保存在你的浏览器中。
          <a
            href="https://platform.deepseek.com/api_keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:underline ml-1"
          >
            获取 Key →
          </a>
        </p>

        <div className="flex gap-2">
          <div className="flex-1">
            <GlassInput
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="sk-xxxxxxxxxxxxxxxx"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveKey();
                  if (keyInput.trim()) router.push("/chat");
                }
              }}
            />
          </div>
          <GlassButton
            variant="accent"
            size="md"
            onClick={() => {
              handleSaveKey();
              if (keyInput.trim()) router.push("/chat");
            }}
          >
            保存
          </GlassButton>
        </div>

        {mounted && state.apiKey && (
          <p className="text-xs text-green-400/70">✓ 已配置 · 可直接开始</p>
        )}
      </GlassCard>

      {/* Enter button */}
      <GlassButton
        variant="accent"
        size="lg"
        onClick={() => router.push("/chat")}
        className="animate-slide-up z-10"
        style={{ animationDelay: "0.2s", animationFillMode: "both" }}
      >
        {mounted && state.apiKey ? "🚀 开始聊天" : "⚙️ 跳过设置，先看看"}
      </GlassButton>

      {/* Footer */}
      <p className="text-[10px] text-foreground/20 z-10">
        Powered by DeepSeek · Open Source on GitHub
      </p>
    </main>
  );
}
