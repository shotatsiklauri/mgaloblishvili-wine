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
          "absolute inset-x-0 top-0 h-[min(24.851vw,357.85px)] bg-white/30",
          ready ? "exp-frost-band" : "exp-frost-band--pending",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "absolute top-[min(24.851vw,357.85px)] right-0 bottom-0 w-[min(11.05vw,159.12px)] bg-white/30",
          ready ? "exp-frost-strip" : "exp-frost-strip--pending",
        )}
      />
      <div
        className={cn(
          "absolute top-[min(2.066vw,29.75px)] left-[min(2.951vw,42.5px)] flex h-[min(19.066vw,274.55px)] w-[min(40.139vw,578px)] flex-col justify-center",
          ready ? "exp-intro-text" : "exp-intro-text--pending",
        )}
      >
        {children}
      </div>
    </>
  );
}
