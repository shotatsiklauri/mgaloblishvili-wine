"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeaderScrollFrameProps = {
  readonly children: ReactNode;
  readonly className?: string;
};

export function HeaderScrollFrame({
  children,
  className,
}: HeaderScrollFrameProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrolled = () => {
      setScrolled(window.scrollY > 8);
    };

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrolled);
    };
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        "group/header text-ink-inverse fixed inset-x-0 top-0 z-30 border-b desktop:sticky",
        // Solid dark bar at all times. It was transparent on mobile until
        // scrolled; now it stays black so it never floats over page/hero content
        // on small screens (desktop was already always dark).
        "bg-surface-dark border-ink-inverse/5 transition-colors duration-300 motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </header>
  );
}
