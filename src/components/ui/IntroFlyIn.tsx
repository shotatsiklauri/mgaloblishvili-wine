"use client";

import { type ReactNode } from "react";
import { useIntroReady } from "@/components/ui/useIntroReady";

type IntroFlyInProps = {
  order: 1 | 2 | 3 | 4;
  active?: boolean;
  className?: string;
  children: ReactNode;
};

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
