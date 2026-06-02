"use client";

import { AvatarCustomizer } from "@/components/customization/AvatarCustomizer";
import { BackgroundCustomizer } from "@/components/customization/BackgroundCustomizer";
import { BubbleStyleCustomizer } from "@/components/customization/BubbleStyleCustomizer";
import { FontCustomizer } from "@/components/customization/FontCustomizer";
import { ModelSelector } from "@/components/customization/ModelSelector";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function AppearanceSettings() {
  return (
    <div className="flex flex-col gap-4">
      <div className="glass-subtle rounded-xl p-4 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground/70">主题模式</span>
          <ThemeToggle />
        </div>

        <AvatarCustomizer mode="user" />
        <AvatarCustomizer mode="robot" />
        <BackgroundCustomizer />
        <BubbleStyleCustomizer />
        <FontCustomizer />
        <ModelSelector />
      </div>
    </div>
  );
}
