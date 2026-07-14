"use client";

import { type ReactNode } from "react";
import { useIntroReady } from "@/components/ui/useIntroReady";

type IntroFlyInProps = {
  /** Stagger position — 1 first, then 2/3/4 at +33ms each. */
  order: 1 | 2 | 3 | 4;
  /** When false, hold the pre-animation state (used for inactive tab panels). */
  active?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Wraps content in the shared left-to-right fly-in entrance (`intro-flyin`, see
 * globals.css). The slide plays once the page-load brand-intro has cleared, and
 * re-plays on route change (the gate is keyed on the pathname). Reduced motion
 * falls back to an opacity-only fade. The wrapper is a transform/opacity-only
 * layer, so it doesn't affect layout or the resting position of its child.
 */
export function IntroFlyIn({
  order,
  active = true,
  className,
  children,
}: IntroFlyInProps) {
  const ready = useIntroReady();
  const on = ready && active;
  const entrance = on
    ? `intro-flyin intro-flyin--${order}`
    : "intro-flyin--pending";

  return (
    <div className={className ? `${className} ${entrance}` : entrance}>
      {children}
    </div>
  );
}
