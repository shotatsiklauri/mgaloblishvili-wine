"use client";

import { type ReactNode } from "react";
import { useIntroReady } from "@/components/ui/useIntroReady";
import { cn } from "@/lib/utils";

type HeaderFadeDownProps = {
  readonly className?: string;
  readonly children: ReactNode;
};

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
