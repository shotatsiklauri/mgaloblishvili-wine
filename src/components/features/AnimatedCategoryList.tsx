"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BRAND_INTRO_TOTAL_MS } from "@/components/ui/brandIntroTiming";

const INTRO_FALLBACK_BUFFER_MS = 0;

type AnimatedCategoryListProps = {
  className?: string;
  introFallbackMs?: number;
  children: React.ReactNode;
};

export function AnimatedCategoryList({
  className,
  introFallbackMs = BRAND_INTRO_TOTAL_MS + INTRO_FALLBACK_BUFFER_MS,
  children,
}: AnimatedCategoryListProps) {
  const pathname = usePathname();
  const [readyPathname, setReadyPathname] = useState<string | null>(null);
  const ready = readyPathname === pathname;

  useEffect(() => {
    let started = false;
    let fallbackTimer: number | undefined;
    let animationFrame: number | undefined;
    let observer: MutationObserver | undefined;

    const start = () => {
      if (started) return;
      started = true;

      if (fallbackTimer !== undefined) {
        window.clearTimeout(fallbackTimer);
      }

      observer?.disconnect();

      animationFrame = window.requestAnimationFrame(() =>
        setReadyPathname(pathname),
      );
    };

    const intro = document.querySelector(".brand-intro");

    if (intro) {
      observer = new MutationObserver(() => {
        if (!document.querySelector(".brand-intro")) {
          start();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      fallbackTimer = window.setTimeout(start, introFallbackMs);
    } else {
      start();
    }

    return () => {
      observer?.disconnect();

      if (fallbackTimer !== undefined) {
        window.clearTimeout(fallbackTimer);
      }

      if (animationFrame !== undefined) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [introFallbackMs, pathname]);

  return (
    <ul
      key={`${pathname}-${ready ? "ready" : "pending"}`}
      className={cn(
        "category-enter-list",
        !ready && "category-enter-list--pending",
        className,
      )}
    >
      {children}
    </ul>
  );
}
