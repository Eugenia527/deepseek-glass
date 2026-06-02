"use client";

import { useSettings } from "@/store/SettingsContext";
import { MODELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ModelSelector() {
  const { state, setDefaultModel } = useSettings();

  return (
    <div className="space-y-2">
      <span className="text-sm text-foreground/70">默认模型</span>
      <div className="flex gap-2">
        {MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => setDefaultModel(model.id)}
            className={cn(
              "flex-1 py-3 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1",
              state.defaultModel === model.id
                ? "glass glass-dark ring-1 ring-indigo-400/50"
                : "glass-subtle hover:bg-white/10",
            )}
          >
            <span className="text-base">{model.name}</span>
            <span className="text-[10px] text-foreground/40">
              {model.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
