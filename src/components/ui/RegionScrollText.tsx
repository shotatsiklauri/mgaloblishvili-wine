"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { focusRing } from "@/lib/focus-ring";

type RegionScrollTextProps = {
  readonly children: ReactNode;
  /** Layout utilities for the scroll frame (height/flex, e.g. `desktop:flex-1`). */
  readonly className?: string;
  readonly ariaLabel?: string;
};

// A text frame that scrolls its overflow with no visible scrollbar — the native
// bar is hidden and there is no custom track/thumb. Overflow is signalled purely
// by the /wines top/bottom fade masks (`wine-scroll-fade--*`); the frame becomes
// scrollable on hover or keyboard focus. Used on the vineyard-region body so the
// long regions stay bounded (extra copy hides into the scroll) instead of
// pushing the page.
export function RegionScrollText({
  children,
  className,
  ariaLabel = "Region description",
}: RegionScrollTextProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState({ top: false, bottom: false });

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const overflowing = scrollHeight > clientHeight + 1;
    setFade({
      top: overflowing && scrollTop > 1,
      bottom: overflowing && scrollTop < scrollHeight - clientHeight - 1,
    });
  }, []);

  useEffect(() => {
    update();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  return (
    <div
      ref={scrollRef}
      tabIndex={0}
      role="region"
      aria-label={ariaLabel}
      className={cn(
        // Scrolls only in the shared desktop layout; smaller screens keep the
        // natural flowing text.
        "no-scrollbar min-h-0 rounded-sm desktop:overflow-y-auto",
        fade.top && "wine-scroll-fade--top",
        fade.bottom && "wine-scroll-fade--bottom",
        focusRing("light"),
        className,
      )}
    >
      {children}
    </div>
  );
}
