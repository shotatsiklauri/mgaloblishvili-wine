"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type InViewRevealProps = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly durationMs?: number;
  readonly zoom?: boolean;
  readonly rootMargin?: string;
};

export function InViewReveal({
  children,
  className,
  durationMs = 800,
  zoom = false,
  rootMargin = "0px 0px -15% 0px",
}: InViewRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return;

    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setRevealed(true));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [revealed, rootMargin]);

  return (
    <div ref={ref} className={className}>
      <div
        className={
          revealed ? "vertical-reveal-enter" : "vertical-reveal-enter--pending"
        }
        style={revealed ? { animationDuration: `${durationMs}ms` } : undefined}
      >
        <div className={cn("relative", zoom && revealed && "intro-zoom")}>
          {children}
        </div>
      </div>
    </div>
  );
}
