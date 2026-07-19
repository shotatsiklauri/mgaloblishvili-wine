"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { focusRing } from "@/lib/focus-ring";

type RegionScrollTextProps = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly ariaLabel?: string;
};

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
        "no-scrollbar desktop:overflow-y-auto min-h-0 rounded-sm",
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
