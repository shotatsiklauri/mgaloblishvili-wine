"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type InViewRevealProps = {
  readonly children: ReactNode;
  readonly className?: string;
  /** Reveal duration in ms. Defaults to 800 to match the detail-page reveals. */
  readonly durationMs?: number;
  /** Adds the slow Ken-Burns zoom (starts as the reveal finishes), like the vineyards photo. */
  readonly zoom?: boolean;
  /**
   * IntersectionObserver rootMargin. The negative bottom fires the reveal once
   * the element is meaningfully inside the viewport rather than the instant its
   * top edge appears.
   */
  readonly rootMargin?: string;
};

/**
 * Plays a top→bottom clip reveal (and optional zoom) the first time the element
 * scrolls into view. Unlike IntroAwareHorizontalReveal — which fires on page
 * load once the brand intro clears — this waits for the viewport, which is what
 * the /experiences map needs since it sits far below the fold.
 *
 * The observed node is the outer wrapper, NOT the clipped layer: while pending,
 * the clip shrinks the reveal layer to zero visible area, and observing that
 * would make it never report "intersecting" (a deadlock).
 */
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
      // No observer support (very old browsers): reveal on the next frame so the
      // map is never left clipped. Deferred so it isn't a synchronous setState.
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
