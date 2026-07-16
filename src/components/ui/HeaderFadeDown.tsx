"use client";

import { type ReactNode } from "react";
import { useIntroReady } from "@/components/ui/useIntroReady";
import { cn } from "@/lib/utils";

type HeaderFadeDownProps = {
  /** Layout utilities for the element being animated. */
  readonly className?: string;
  readonly children: ReactNode;
};

/**
 * Fades a header element in from above (top → bottom) once the page-load
 * brand-intro overlay has cleared, so the bar reads as empty and then fills in.
 * The gate is keyed on the pathname (see `useIntroReady`), so it replays on
 * route change. Reduced motion falls back to an opacity-only fade.
 *
 * The rendered element carries the animation's `transform`, so never give it a
 * transform of its own — wrap it, or apply the transform to a child.
 */
export function HeaderFadeDown({ className, children }: HeaderFadeDownProps) {
  const ready = useIntroReady();

  return (
    <div
      className={cn(
        ready ? "header-fade-down" : "header-fade-down--pending",
        className,
      )}
    >
      {children}
    </div>
  );
}
