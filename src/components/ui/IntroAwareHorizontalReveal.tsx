"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useIntroReady } from "@/components/ui/useIntroReady";
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
  const ready = useIntroReady();

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
