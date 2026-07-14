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
 * Geometry matches the static Figma L: band 421px (29.236vw) tall, strip 187px
 * (13vw) wide, over the 828×880 photo. The copy box is the Figma 680×323 @ (50,
 * 264), vertically centered.
 */
export function ExperienceFrostIntro({ children }: { children: ReactNode }) {
  const ready = useIntroReady();

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 h-[29.236vw] bg-white/30",
          ready ? "exp-frost-band" : "exp-frost-band--pending",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "absolute top-[29.236vw] right-0 bottom-0 w-[13vw] bg-white/30",
          ready ? "exp-frost-strip" : "exp-frost-strip--pending",
        )}
      />
      <div
        className={cn(
          "absolute top-[2.431vw] left-[3.472vw] flex h-[22.431vw] w-[47.222vw] flex-col justify-center",
          ready ? "exp-intro-text" : "exp-intro-text--pending",
        )}
      >
        {children}
      </div>
    </>
  );
}
