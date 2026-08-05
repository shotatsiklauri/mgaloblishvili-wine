"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BRAND_INTRO_TOTAL_MS } from "@/components/ui/brandIntroTiming";

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

export function BrandIntro() {
  const pathname = usePathname();
  const introRouteKey = getIntroRouteKey(pathname);
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

  return <BrandIntroLayer key={`${introRouteKey}|${restoreNonce}`} />;
}

function BrandIntroLayer() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setDone(true), BRAND_INTRO_TOTAL_MS);
    return () => window.clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <div
      className="brand-intro"
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
