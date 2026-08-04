"use client";

import type { ReactNode } from "react";
import { useIntroReady } from "@/components/ui/useIntroReady";
import { cn } from "@/lib/utils";

export function ExperienceFrostIntro({ children }: { children: ReactNode }) {
  const ready = useIntroReady();

  return (
    <>
      <div aria-hidden="true" className="absolute inset-0 opacity-70">
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-[calc(var(--desktop-fluid-unit)*421)] bg-white",
            ready ? "exp-frost-band" : "exp-frost-band--pending",
          )}
        />
        <div
          className={cn(
            "absolute inset-y-0 right-0 w-[11.4%] bg-white",
            ready ? "exp-frost-strip" : "exp-frost-strip--pending",
          )}
        />
      </div>
      <div
        className={cn(
          "absolute top-[calc(var(--desktop-fluid-unit)*35)] left-[calc(var(--desktop-fluid-unit)*50)] flex h-[calc(var(--desktop-fluid-unit)*323)] w-[calc(var(--desktop-fluid-unit)*680)] flex-col justify-center",
          ready ? "exp-intro-text" : "exp-intro-text--pending",
        )}
      >
        {children}
      </div>
    </>
  );
}
