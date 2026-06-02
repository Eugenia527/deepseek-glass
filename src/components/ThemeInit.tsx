"use client";

import { useEffect } from "react";

/**
 * Applies the saved theme before page hydration to prevent FOUC.
 * Must be the first component rendered inside <body>.
 */
export function ThemeInit() {
  useEffect(() => {
    try {
      const raw = localStorage.getItem("deepseek-glass:theme");
      if (raw) {
        const theme = JSON.parse(raw);
        if (theme.mode === "dark") {
          document.documentElement.classList.add("dark");
        } else if (theme.mode === "light") {
          document.documentElement.classList.remove("dark");
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  return null;
}
