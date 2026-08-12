"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { useIntroReady } from "@/components/ui/useIntroReady";
import { cn } from "@/lib/utils";

type IntroAwareHorizontalRevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  durationMs?: number;
  revealFrom?: string;
  zoom?: boolean;
};

export function IntroAwareHorizontalReveal({
  children,
  className,
  delayMs = 0,
  durationMs,
  revealFrom,
  zoom = false,
}: IntroAwareHorizontalRevealProps) {
  const pathname = usePathname();
  const ready = useIntroReady();
  const ref = useRef<HTMLDivElement>(null);
  const [visiblePathname, setVisiblePathname] = useState<string | null>(null);
  const inView = visiblePathname === pathname;
  const started = ready && inView;

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const desktopQuery = window.matchMedia("(min-width: 960px)");
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (
      desktopQuery.matches ||
      reducedMotionQuery.matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      const animationFrame = window.requestAnimationFrame(() =>
        setVisiblePathname(pathname),
      );
      return () => window.cancelAnimationFrame(animationFrame);
    }

    const revealAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setVisiblePathname(pathname);
    };
    desktopQuery.addEventListener("change", revealAtDesktop);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisiblePathname(pathname);
          observer.disconnect();
        }
      },
      { threshold: 0.01 },
    );

    observer.observe(el);
    return () => {
      desktopQuery.removeEventListener("change", revealAtDesktop);
      observer.disconnect();
    };
  }, [inView, pathname]);

  let style: CSSProperties | undefined;
  if (
    revealFrom !== undefined ||
    (started && (delayMs > 0 || durationMs !== undefined))
  ) {
    style = {};
    if (revealFrom !== undefined) {
      (style as Record<string, string>)["--reveal-from"] = revealFrom;
    }
    if (started && delayMs > 0) style.animationDelay = `${delayMs}ms`;
    if (started && durationMs !== undefined)
      style.animationDuration = `${durationMs}ms`;
  }

  return (
    <div ref={ref} className={className}>
      <div
        key={`${pathname}-${started ? "ready" : "pending"}`}
        className={cn(
          "h-full w-full",
          started
            ? "horizontal-reveal-enter"
            : "horizontal-reveal-enter--pending",
        )}
        style={style}
      >
        {zoom ? (
          <div
            className={cn("relative h-full w-full", started && "intro-zoom")}
          >
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
