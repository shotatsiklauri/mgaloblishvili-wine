"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type InViewRevealProps = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly direction?: "horizontal" | "vertical";
  readonly durationMs?: number;
  readonly waitForImages?: boolean;
  readonly waitForScroll?: boolean;
  readonly zoom?: boolean;
  readonly rootMargin?: string;
};

export function InViewReveal({
  children,
  className,
  direction = "vertical",
  durationMs = 800,
  waitForImages = false,
  waitForScroll = false,
  zoom = false,
  rootMargin = "0px 0px -15% 0px",
}: InViewRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [imagesReady, setImagesReady] = useState(!waitForImages);
  const [scrollStarted, setScrollStarted] = useState(!waitForScroll);

  useEffect(() => {
    const el = ref.current;
    if (!el || !waitForImages || imagesReady) return;

    const images = Array.from(el.querySelectorAll("img"));
    if (images.length === 0 || images.every((image) => image.complete)) {
      const raf = requestAnimationFrame(() => setImagesReady(true));
      return () => cancelAnimationFrame(raf);
    }

    const handleSettled = () => {
      if (images.every((image) => image.complete)) setImagesReady(true);
    };
    images.forEach((image) => {
      image.addEventListener("load", handleSettled);
      image.addEventListener("error", handleSettled);
    });
    return () => {
      images.forEach((image) => {
        image.removeEventListener("load", handleSettled);
        image.removeEventListener("error", handleSettled);
      });
    };
  }, [imagesReady, waitForImages]);

  useEffect(() => {
    if (!waitForScroll || scrollStarted) return;

    if (window.scrollY > 0) {
      const raf = requestAnimationFrame(() => setScrollStarted(true));
      return () => cancelAnimationFrame(raf);
    }

    const handleScroll = () => setScrollStarted(true);
    window.addEventListener("scroll", handleScroll, {
      once: true,
      passive: true,
    });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollStarted, waitForScroll]);

  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = requestAnimationFrame(() => setRevealed(true));
      return () => cancelAnimationFrame(raf);
    }

    if (!imagesReady || !scrollStarted) return;

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
  }, [imagesReady, revealed, rootMargin, scrollStarted]);

  const pendingClass =
    direction === "horizontal"
      ? "horizontal-reveal-enter--pending"
      : "vertical-reveal-enter--pending";
  const revealedClass =
    direction === "horizontal"
      ? "horizontal-reveal-enter"
      : "vertical-reveal-enter";

  return (
    <div ref={ref} className={className}>
      <div
        className={cn("h-full w-full", revealed ? revealedClass : pendingClass)}
        style={revealed ? { animationDuration: `${durationMs}ms` } : undefined}
      >
        <div
          className={cn(
            "relative h-full w-full",
            zoom && revealed && "intro-zoom",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
