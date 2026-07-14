"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BRAND_INTRO_TOTAL_MS } from "@/components/ui/brandIntroTiming";

/**
 * Returns `true` once the page-load brand-intro overlay has cleared for the
 * current route, so intro-coordinated entrance animations all start together
 * (and never play behind the overlay). On routes without a brand-intro it
 * resolves on the next frame. The timer is only a safety fallback in case the
 * overlay's removal is missed — not an animation delay.
 */
export function useIntroReady(): boolean {
  const pathname = usePathname();
  const [readyPathname, setReadyPathname] = useState<string | null>(null);

  useEffect(() => {
    let started = false;
    let animationFrame: number | undefined;
    let fallbackTimer: number | undefined;
    let observer: MutationObserver | undefined;

    const start = () => {
      if (started) return;
      started = true;
      observer?.disconnect();
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      animationFrame = window.requestAnimationFrame(() => {
        setReadyPathname(pathname);
      });
    };

    if (document.querySelector(".brand-intro")) {
      observer = new MutationObserver(() => {
        if (!document.querySelector(".brand-intro")) start();
      });
      observer.observe(document.body, { childList: true, subtree: true });
      fallbackTimer = window.setTimeout(start, BRAND_INTRO_TOTAL_MS);
    } else {
      start();
    }

    return () => {
      observer?.disconnect();
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      if (animationFrame !== undefined) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [pathname]);

  return readyPathname === pathname;
}
