"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  BRAND_INTRO_EXIT_MS,
  BRAND_INTRO_MINIMUM_MS,
} from "@/components/ui/brandIntroTiming";
import {
  INTRO_MEDIA_READY_EVENT,
  isIntroMediaReady,
  type IntroMediaScope,
} from "@/components/ui/introMediaReadiness";

/**
 * The mark shown while the page loads. Its intrinsic size drives the stack's
 * aspect ratio here and in `.brand-intro__stack` (globals.css) — both have to
 * agree, or the two stacked layers stop lining up and the fill reveal skews.
 */
const INTRO_MARK = {
  src: "/svgs/Product_of_Georgia.svg",
  width: 603,
  height: 152,
} as const;

const INTRO_MARK_RATIO = `${INTRO_MARK.width} / ${INTRO_MARK.height}`;

function getIntroRouteKey(pathname: string) {
  if (pathname === "/wines" || pathname.startsWith("/wines/")) {
    return "/wines";
  }

  return pathname;
}

function getIntroMediaScope(pathname: string): IntroMediaScope | null {
  if (pathname === "/") return "home";
  if (
    pathname === "/history" ||
    pathname === "/vineyards" ||
    pathname.startsWith("/vineyards/") ||
    pathname === "/wines" ||
    pathname.startsWith("/wines/") ||
    pathname === "/experiences" ||
    pathname.startsWith("/experiences/")
  ) {
    return "content";
  }

  return null;
}

export function BrandIntro() {
  const pathname = usePathname();
  const introRouteKey = getIntroRouteKey(pathname);
  const mediaScope = getIntroMediaScope(pathname);
  const [restoreNonce, setRestoreNonce] = useState(0);

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setRestoreNonce((n) => n + 1);
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return (
    <BrandIntroLayer
      key={`${introRouteKey}|${restoreNonce}`}
      mediaScope={mediaScope}
    />
  );
}

function BrandIntroLayer({
  mediaScope,
}: {
  mediaScope: IntroMediaScope | null;
}) {
  const [phase, setPhase] = useState<"visible" | "exiting" | "done">(
    "visible",
  );

  useEffect(() => {
    let minimumElapsed = false;
    let mediaReady = mediaScope === null || isIntroMediaReady(mediaScope);
    let exitTimer: number | undefined;

    const beginExit = () => {
      if (!minimumElapsed || !mediaReady || exitTimer !== undefined) return;
      setPhase("exiting");
      exitTimer = window.setTimeout(
        () => setPhase("done"),
        BRAND_INTRO_EXIT_MS,
      );
    };

    const onMediaReady = (event: Event) => {
      const customEvent = event as CustomEvent<{ scope: IntroMediaScope }>;
      if (customEvent.detail.scope !== mediaScope) return;
      mediaReady = true;
      beginExit();
    };

    const minimumTimer = window.setTimeout(() => {
      minimumElapsed = true;
      if (mediaScope !== null) {
        mediaReady = isIntroMediaReady(mediaScope);
      }
      beginExit();
    }, BRAND_INTRO_MINIMUM_MS);

    window.addEventListener(INTRO_MEDIA_READY_EVENT, onMediaReady);

    return () => {
      window.clearTimeout(minimumTimer);
      if (exitTimer !== undefined) window.clearTimeout(exitTimer);
      window.removeEventListener(INTRO_MEDIA_READY_EVENT, onMediaReady);
    };
  }, [mediaScope]);

  if (phase === "done") return null;

  return (
    <div
      className={`brand-intro${phase === "exiting" ? " brand-intro--exit" : ""}`}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        className="brand-intro__stack"
        style={{
          position: "relative",
          aspectRatio: INTRO_MARK_RATIO,
          flexShrink: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={INTRO_MARK.src}
          alt=""
          width={INTRO_MARK.width}
          height={INTRO_MARK.height}
          className="brand-intro__logo brand-intro__logo--base"
          decoding="async"
          fetchPriority="high"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.2,
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={INTRO_MARK.src}
          alt=""
          width={INTRO_MARK.width}
          height={INTRO_MARK.height}
          className="brand-intro__logo brand-intro__logo--reveal"
          decoding="async"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}
