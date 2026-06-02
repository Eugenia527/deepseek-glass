"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import type { ThemeState, ThemeAction, ThemeMode, GlassIntensity } from "./types";
import { getItem, setItem } from "@/lib/storage";

const STORAGE_KEY = "theme";

const DEFAULT: ThemeState = {
  mode: "system",
  glassIntensity: "standard",
};

function reducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload };
    case "SET_GLASS_INTENSITY":
      return { ...state, glassIntensity: action.payload };
    default:
      return state;
  }
}

interface ThemeContextValue {
  state: ThemeState;
  setMode: (mode: ThemeMode) => void;
  setGlassIntensity: (intensity: GlassIntensity) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    reducer,
    DEFAULT,
    (d) => getItem<ThemeState>(STORAGE_KEY, d),
  );

  // Sync dark class to <html>
  useEffect(() => {
    const root = document.documentElement;
    const applyDark = () => {
      if (state.mode === "dark") return true;
      if (state.mode === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    };

    const update = () => {
      if (applyDark()) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    update();

    if (state.mode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }
  }, [state.mode]);

  // Persist
  useEffect(() => {
    setItem(STORAGE_KEY, state);
  }, [state]);

  // Compute isDark for convenience
  const isDark =
    state.mode === "dark" ||
    (state.mode === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <ThemeContext.Provider
      value={{
        state,
        setMode: (mode) => dispatch({ type: "SET_MODE", payload: mode }),
        setGlassIntensity: (i) =>
          dispatch({ type: "SET_GLASS_INTENSITY", payload: i }),
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
