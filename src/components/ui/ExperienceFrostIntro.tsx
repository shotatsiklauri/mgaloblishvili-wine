"use client";

import type { ReactNode } from "react";
import { useIntroReady } from "@/components/ui/useIntroReady";
import { cn } from "@/lib/utils";

/**
 * The /experiences left-column frost + intro copy, animated once the brand
 * intro clears: the top band wipes bottom→top and the right strip wipes
 * left→right (two elements so each has its own direction), then the copy fades
 * up on top once the frost has settled. The two frost rects are plain 30% white
 * (no blur) so they sit perfectly flush — no seam where top meets right.
 *
 * Geometry is the desktop 85% rendering of the static Figma L: the source band
 * is 421px tall and the source strip is 187px wide over the 828×880 photo. The
 * copy box follows the same scale and remains vertically centered.
 */
export function ExperienceFrostIntro({ children }: { children: ReactNode }) {
  const ready = useIntroReady();

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 h-[calc(var(--desktop-fluid-unit)*357.85)] bg-white/30",
          ready ? "exp-frost-band" : "exp-frost-band--pending",
        )}
      />
      {/* Right arm of the L. Width is a PERCENTAGE of the photo, not a fluid-unit
          length: the column's width is itself a percentage, so a unit-based width
          would drift (19.2% of the photo at 1440, only ~8.7% at 1920). At 11.4%
          the strip clears the man on the right of the shot — it used to start at
          80.8%, landing straight on his back. */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute top-[calc(var(--desktop-fluid-unit)*357.85)] right-0 bottom-0 w-[11.4%] bg-white/30",
          ready ? "exp-frost-strip" : "exp-frost-strip--pending",
        )}
      />
      <div
        className={cn(
          "absolute top-[calc(var(--desktop-fluid-unit)*29.75)] left-[calc(var(--desktop-fluid-unit)*42.5)] flex h-[calc(var(--desktop-fluid-unit)*274.55)] w-[calc(var(--desktop-fluid-unit)*578)] flex-col justify-center",
          ready ? "exp-intro-text" : "exp-intro-text--pending",
        )}
      >
        {children}
      </div>
    </>
  );
}
