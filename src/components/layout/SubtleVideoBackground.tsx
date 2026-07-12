"use client";

import { useEffect, useState } from "react";

export function SubtleVideoBackground() {
  const [shouldPlay, setShouldPlay] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setShouldPlay(!mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className="bg-surface pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {shouldPlay ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.27] [filter:grayscale(1)_contrast(0.75)_brightness(1.15)]"
        >
          <source src="/Video_Mgaloblishvili.mp4" type="video/mp4" />
        </video>
      ) : null}
      <div className="bg-surface/80 absolute inset-0" />
    </div>
  );
}
