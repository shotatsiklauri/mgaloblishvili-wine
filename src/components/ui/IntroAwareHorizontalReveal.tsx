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
  /** How much is clipped from the right at the start (e.g. "25%" leaves 75%
   *  already visible and only wipes in the last slice). Default fully hidden. */
  revealFrom?: string;
};

export function IntroAwareHorizontalReveal({
  children,
  className,
  delayMs = 0,
  durationMs,
  revealFrom,
}: IntroAwareHorizontalRevealProps) {
  const pathname = usePathname();
  const ready = useIntroReady();

  let style: CSSProperties | undefined;
  if (revealFrom !== undefined || (ready && (delayMs > 0 || durationMs !== undefined))) {
    style = {};
    if (revealFrom !== undefined) {
      (style as Record<string, string>)["--reveal-from"] = revealFrom;
    }
    if (ready && delayMs > 0) style.animationDelay = `${delayMs}ms`;
    if (ready && durationMs !== undefined) style.animationDuration = `${durationMs}ms`;
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
