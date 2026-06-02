"use client";

import { useRef, useCallback } from "react";

export function useAutoScroll(dependency: unknown) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(true);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    // If user scrolled up more than 60px from bottom, stop auto-scrolling
    shouldScrollRef.current =
      scrollHeight - scrollTop - clientHeight < 60;
  }, []);

  const scrollToBottom = useCallback((force = false) => {
    const el = containerRef.current;
    if (!el) return;
    if (force || shouldScrollRef.current) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      shouldScrollRef.current = true;
    }
  }, []);

  return { containerRef, handleScroll, scrollToBottom };
}
