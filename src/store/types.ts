/* ========================================
   Shared Type Definitions
   ======================================== */

// --- Theme ---
export type ThemeMode = "light" | "dark" | "system";
export type GlassIntensity = "subtle" | "standard" | "strong";

export interface ThemeState {
  mode: ThemeMode;
  glassIntensity: GlassIntensity;
}

// --- Settings ---
export interface AvatarPreset {
  type: "preset";
  value: string;
  label: string;
}

export interface AvatarCustom {
  type: "url";
  value: string;
  label?: string;
}

export type AvatarConfig = AvatarPreset | AvatarCustom;

export interface BackgroundPreset {
  type: "preset-gradient";
  value: string;
  label: string;
}

export interface BackgroundCustom {
  type: "url";
  value: string;
  label?: string;
}

export type BackgroundConfig = BackgroundPreset | BackgroundCustom;

export type BubbleStyle = "bubbles" | "rounded" | "flat";
export type FontFamily = "system" | "serif" | "mono";

export interface SettingsState {
  apiKey: string;
  userAvatar: AvatarConfig;
  chatBackground: BackgroundConfig;
  bubbleStyle: BubbleStyle;
  fontFamily: FontFamily;
  defaultModel: string;
}

// --- Chat ---
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Session {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  model: string;
  messages: Message[];
}

export type StreamingStatus = "idle" | "streaming" | "error";

export interface ChatState {
  sessions: Session[];
  activeSessionId: string | null;
  streamingStatus: StreamingStatus;
  streamingMessageId: string | null;
  error: string | null;
}

// --- Action Types ---
export type ThemeAction =
  | { type: "SET_MODE"; payload: ThemeMode }
  | { type: "SET_GLASS_INTENSITY"; payload: GlassIntensity };

export type SettingsAction =
  | { type: "SET_API_KEY"; payload: string }
  | { type: "SET_AVATAR"; payload: AvatarConfig }
  | { type: "SET_BACKGROUND"; payload: BackgroundConfig }
  | { type: "SET_BUBBLE_STYLE"; payload: BubbleStyle }
  | { type: "SET_FONT_FAMILY"; payload: FontFamily }
  | { type: "SET_DEFAULT_MODEL"; payload: string }
  | { type: "LOAD_SETTINGS"; payload: Partial<SettingsState> };

export type ChatAction =
  | { type: "NEW_SESSION"; payload: { model: string } }
  | { type: "SWITCH_SESSION"; payload: string }
  | { type: "DELETE_SESSION"; payload: string }
  | { type: "ADD_MESSAGE"; payload: { role: "user" | "assistant"; content: string } }
  | { type: "APPEND_STREAM_CHUNK"; payload: string }
  | { type: "STREAM_COMPLETE" }
  | { type: "STREAM_ERROR"; payload: string }
  | { type: "CLEAR_STREAM_ERROR" }
  | { type: "SET_SESSION_TITLE"; payload: { sessionId: string; title: string } }
  | { type: "LOAD_SESSIONS"; payload: Session[] };
