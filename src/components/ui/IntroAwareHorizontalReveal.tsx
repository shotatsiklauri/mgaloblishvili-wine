"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BRAND_INTRO_TOTAL_MS } from "@/components/ui/brandIntroTiming";
import { cn } from "@/lib/utils";

type IntroAwareHorizontalRevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

export function IntroAwareHorizontalReveal({
  children,
  className,
  delayMs = 0,
}: IntroAwareHorizontalRevealProps) {
  const pathname = usePathname();
  const [readyPathname, setReadyPathname] = useState<string | null>(null);
  const ready = readyPathname === pathname;

  useEffect(() => {
    let started = false;
    let animationFrame: number | undefined;
    let fallbackTimer: number | undefined;
    let observer: MutationObserver | undefined;

    const start = () => {
      if (started) return;
      started = true;
      observer?.disconnect();

      if (fallbackTimer !== undefined) {
        window.clearTimeout(fallbackTimer);
      }

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

  return (
    <div
      key={`${pathname}-${ready ? "ready" : "pending"}`}
      className={cn(
        ready ? "horizontal-reveal-enter" : "horizontal-reveal-enter--pending",
        className,
      )}
      style={
        ready && delayMs > 0 ? { animationDelay: `${delayMs}ms` } : undefined
      }
    >
      {children}
    </div>
  );
}
