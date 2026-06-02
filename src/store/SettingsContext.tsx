"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import type {
  SettingsState,
  SettingsAction,
  AvatarConfig,
  BackgroundConfig,
  BubbleStyle,
  FontFamily,
} from "./types";
import { getItem, setItem } from "@/lib/storage";
import { DEFAULT_SETTINGS } from "@/lib/constants";

const STORAGE_KEY = "settings";

function reducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case "SET_API_KEY":
      return { ...state, apiKey: action.payload };
    case "SET_AVATAR":
      return { ...state, userAvatar: action.payload };
    case "SET_BACKGROUND":
      return { ...state, chatBackground: action.payload };
    case "SET_BUBBLE_STYLE":
      return { ...state, bubbleStyle: action.payload };
    case "SET_FONT_FAMILY":
      return { ...state, fontFamily: action.payload };
    case "SET_DEFAULT_MODEL":
      return { ...state, defaultModel: action.payload };
    case "LOAD_SETTINGS":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

interface SettingsContextValue {
  state: SettingsState;
  setApiKey: (key: string) => void;
  setAvatar: (avatar: AvatarConfig) => void;
  setBackground: (bg: BackgroundConfig) => void;
  setBubbleStyle: (style: BubbleStyle) => void;
  setFontFamily: (font: FontFamily) => void;
  setDefaultModel: (model: string) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    reducer,
    DEFAULT_SETTINGS,
    (d) => getItem<SettingsState>(STORAGE_KEY, d),
  );

  useEffect(() => {
    setItem(STORAGE_KEY, state);
  }, [state]);

  // Apply font family to body
  useEffect(() => {
    const body = document.body;
    const fontMap: Record<string, string> = {
      system: "var(--font-sans)",
      serif: "var(--font-serif)",
      mono: "var(--font-mono)",
    };
    body.style.fontFamily = fontMap[state.fontFamily] || fontMap.system;
  }, [state.fontFamily]);

  return (
    <SettingsContext.Provider
      value={{
        state,
        setApiKey: (key) => dispatch({ type: "SET_API_KEY", payload: key }),
        setAvatar: (a) => dispatch({ type: "SET_AVATAR", payload: a }),
        setBackground: (bg) =>
          dispatch({ type: "SET_BACKGROUND", payload: bg }),
        setBubbleStyle: (s) =>
          dispatch({ type: "SET_BUBBLE_STYLE", payload: s }),
        setFontFamily: (f) =>
          dispatch({ type: "SET_FONT_FAMILY", payload: f }),
        setDefaultModel: (m) =>
          dispatch({ type: "SET_DEFAULT_MODEL", payload: m }),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
