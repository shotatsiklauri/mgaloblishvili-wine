"use client";

import type { ReactNode } from "react";
import { useIntroReady } from "@/components/ui/useIntroReady";
import { cn } from "@/lib/utils";

/**
 * The /experiences left-column frost + intro copy, animated once the brand
 * intro clears: the top band wipes bottom→top and the right strip wipes
 * left→right (two elements so each has its own direction), then the copy fades
 * up on top once the frost has settled.
 *
 * The two rects are OPAQUE white and the 70% opacity lives on their shared
 * wrapper, so they composite to a single flattened layer — no seam where the
 * band meets the strip (two translucent rects can't tile: a subpixel gap bleeds
 * the photo through, an overlap doubles the opacity). The strip runs the full
 * height and overlaps the band in the top-right corner; opaque overlap is
 * invisible once flattened, so the frost reads as one continuous L. 70% (was
 * 30%) keeps the dark intro copy legible over the photo beneath.
 *
 * Geometry is the desktop 85% rendering of the static Figma L: the source band
 * is 421px tall and the source strip is 187px wide over the 828×880 photo. The
 * copy box follows the same scale and remains vertically centered.
 */
export function ExperienceFrostIntro({ children }: { children: ReactNode }) {
  const ready = useIntroReady();

  return (
    <>
      {/* Opacity on the wrapper flattens both opaque rects to one 70% layer. */}
      <div aria-hidden="true" className="absolute inset-0 opacity-70">
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-[calc(var(--desktop-fluid-unit)*357.85)] bg-white",
            ready ? "exp-frost-band" : "exp-frost-band--pending",
          )}
        />
        {/* Right arm of the L, full height so it overlaps the band's bottom edge
            in the corner (no internal line). Width is a PERCENTAGE of the photo,
            not a fluid-unit length: the column's width is itself a percentage, so
            a unit-based width would drift (19.2% of the photo at 1440, only ~8.7%
            at 1920). At 11.4% the strip clears the man on the right of the shot —
            it used to start at 80.8%, landing straight on his back. */}
        <div
          className={cn(
            "absolute inset-y-0 right-0 w-[11.4%] bg-white",
            ready ? "exp-frost-strip" : "exp-frost-strip--pending",
          )}
        />
      </div>
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
