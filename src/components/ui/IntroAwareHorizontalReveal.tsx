"use client";

import { type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useIntroReady } from "@/components/ui/useIntroReady";
import { cn } from "@/lib/utils";

type IntroAwareHorizontalRevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  durationMs?: number;
};

export function IntroAwareHorizontalReveal({
  children,
  className,
  delayMs = 0,
  durationMs,
}: IntroAwareHorizontalRevealProps) {
  const pathname = usePathname();
  const ready = useIntroReady();

  let style: CSSProperties | undefined;
  if (ready && (delayMs > 0 || durationMs !== undefined)) {
    style = {};
    if (delayMs > 0) style.animationDelay = `${delayMs}ms`;
    if (durationMs !== undefined) style.animationDuration = `${durationMs}ms`;
  }

  return (
    <div
      key={`${pathname}-${ready ? "ready" : "pending"}`}
      className={cn(
        ready ? "horizontal-reveal-enter" : "horizontal-reveal-enter--pending",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
