"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BRAND_INTRO_TOTAL_MS } from "@/components/ui/brandIntroTiming";

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
          width: "min(32vw, 280px)",
          aspectRatio: "245 / 50",
          flexShrink: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/Mgaloblishvili-Logo.svg"
          alt=""
          width={245}
          height={50}
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
          src="/images/Mgaloblishvili-Logo.svg"
          alt=""
          width={245}
          height={50}
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
