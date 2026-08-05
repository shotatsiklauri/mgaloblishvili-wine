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
          // The copy sits inside the frosted band with the SAME gap on all four
          // sides: 50 (Figma 1440x900) px from left, right and top, and a height
          // of 321 = the 421 band above minus that same 50 inset top and bottom.
          // Left/right are set as insets rather than a width so the two gaps
          // cannot drift apart.
          "absolute top-[calc(var(--desktop-fluid-unit)*50)] right-[calc(var(--desktop-fluid-unit)*50)] left-[calc(var(--desktop-fluid-unit)*50)]",
          "flex h-[calc(var(--desktop-fluid-unit)*321)] flex-col justify-center",
          ready ? "exp-intro-text" : "exp-intro-text--pending",
        )}
      >
        {children}
      </div>
    </>
  );
}
