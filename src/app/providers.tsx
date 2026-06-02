"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/store/ThemeContext";
import { SettingsProvider } from "@/store/SettingsContext";
import { ChatProvider } from "@/store/ChatContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <ChatProvider>{children}</ChatProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
