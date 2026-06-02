"use client";

import { useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { SessionList } from "./SessionList";
import { SettingsSheet } from "@/components/settings/SettingsSheet";
import { GlassSheet } from "@/components/ui/GlassSheet";
import { useChatActions } from "@/hooks/useChat";
import { useSettings } from "@/store/SettingsContext";

export function ChatContainer() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { send, stopStreaming, isStreaming } = useChatActions();
  const { state: settings } = useSettings();

  const handlePromptClick = (prompt: string) => {
    send(prompt);
  };

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-white/5">
        <SessionList />
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <GlassSheet open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <SessionList onClose={() => setSidebarOpen(false)} />
      </GlassSheet>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <ChatHeader
          onMenuClick={() => setSidebarOpen(true)}
          onSettingsClick={() => setSettingsOpen(true)}
        />

        <ChatMessages onPromptClick={handlePromptClick} />

        <ChatInput
          onSend={send}
          onStop={stopStreaming}
          isStreaming={isStreaming}
          disabled={!settings.apiKey}
        />
      </main>

      {/* Settings Sheet */}
      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
