"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type { ChatState, ChatAction, Message, Session } from "./types";
import { getItem, setItem } from "@/lib/storage";
import { generateId } from "@/lib/utils";

const STORAGE_KEY = "sessions";

function createEmptyState(): ChatState {
  return {
    sessions: [],
    activeSessionId: null,
    streamingStatus: "idle",
    streamingMessageId: null,
    error: null,
  };
}

function reducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "NEW_SESSION": {
      const session: Session = {
        id: generateId(),
        title: "新对话",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        model: action.payload.model,
        messages: [],
      };
      return {
        ...state,
        sessions: [session, ...state.sessions],
        activeSessionId: session.id,
        streamingStatus: "idle",
        error: null,
      };
    }

    case "SWITCH_SESSION":
      return {
        ...state,
        activeSessionId: action.payload,
        streamingStatus: "idle",
        error: null,
      };

    case "DELETE_SESSION": {
      const sessions = state.sessions.filter((s) => s.id !== action.payload);
      const activeSessionId =
        state.activeSessionId === action.payload
          ? sessions[0]?.id ?? null
          : state.activeSessionId;
      return { ...state, sessions, activeSessionId, error: null };
    }

    case "ADD_MESSAGE": {
      const msg: Message = {
        id: generateId(),
        role: action.payload.role,
        content: action.payload.content,
        timestamp: Date.now(),
      };
      // Start streaming for assistant
      if (action.payload.role === "assistant") {
        return {
          ...state,
          sessions: state.sessions.map((s) =>
            s.id === state.activeSessionId
              ? {
                  ...s,
                  messages: [...s.messages, msg],
                  updatedAt: Date.now(),
                }
              : s,
          ),
          streamingMessageId: msg.id,
          streamingStatus: "streaming",
        };
      }
      return {
        ...state,
        sessions: state.sessions.map((s) =>
          s.id === state.activeSessionId
            ? {
                ...s,
                messages: [...s.messages, msg],
                updatedAt: Date.now(),
              }
            : s,
        ),
      };
    }

    case "APPEND_STREAM_CHUNK": {
      return {
        ...state,
        sessions: state.sessions.map((s) =>
          s.id === state.activeSessionId
            ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === state.streamingMessageId
                    ? { ...m, content: m.content + action.payload }
                    : m,
                ),
                updatedAt: Date.now(),
              }
            : s,
        ),
      };
    }

    case "STREAM_COMPLETE":
      return {
        ...state,
        streamingStatus: "idle",
        streamingMessageId: null,
      };

    case "STREAM_ERROR":
      return {
        ...state,
        streamingStatus: "error",
        error: action.payload,
        streamingMessageId: null,
      };

    case "CLEAR_STREAM_ERROR":
      return { ...state, error: null };

    case "SET_SESSION_TITLE": {
      return {
        ...state,
        sessions: state.sessions.map((s) =>
          s.id === action.payload.sessionId
            ? { ...s, title: action.payload.title }
            : s,
        ),
      };
    }

    case "LOAD_SESSIONS":
      return { ...state, sessions: action.payload };

    default:
      return state;
  }
}

interface ChatContextValue {
  state: ChatState;
  activeSession: Session | null;
  newSession: (model: string) => void;
  switchSession: (id: string) => void;
  deleteSession: (id: string) => void;
  addMessage: (role: "user" | "assistant", content: string) => void;
  appendChunk: (chunk: string) => void;
  streamComplete: () => void;
  streamError: (error: string) => void;
  clearError: () => void;
  setSessionTitle: (sessionId: string, title: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const saved = getItem<Session[]>(STORAGE_KEY, []);
  const initial: ChatState = {
    ...createEmptyState(),
    sessions: saved || [],
  };

  const [state, dispatch] = useReducer(reducer, initial);

  // Debounced persist
  useEffect(() => {
    const timer = setTimeout(() => {
      setItem(STORAGE_KEY, state.sessions);
    }, 500);
    return () => clearTimeout(timer);
  }, [state.sessions]);

  // Compute active session
  const activeSession =
    state.sessions.find((s) => s.id === state.activeSessionId) ?? null;

  return (
    <ChatContext.Provider
      value={{
        state,
        activeSession,
        newSession: (model) =>
          dispatch({ type: "NEW_SESSION", payload: { model } }),
        switchSession: (id) =>
          dispatch({ type: "SWITCH_SESSION", payload: id }),
        deleteSession: (id) =>
          dispatch({ type: "DELETE_SESSION", payload: id }),
        addMessage: (role, content) =>
          dispatch({ type: "ADD_MESSAGE", payload: { role, content } }),
        appendChunk: (chunk) =>
          dispatch({ type: "APPEND_STREAM_CHUNK", payload: chunk }),
        streamComplete: () => dispatch({ type: "STREAM_COMPLETE" }),
        streamError: (err) =>
          dispatch({ type: "STREAM_ERROR", payload: err }),
        clearError: () => dispatch({ type: "CLEAR_STREAM_ERROR" }),
        setSessionTitle: (sessionId, title) =>
          dispatch({
            type: "SET_SESSION_TITLE",
            payload: { sessionId, title },
          }),
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
