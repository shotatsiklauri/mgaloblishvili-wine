"use client";

import { useEffect, useRef } from "react";

const POSTER_DATA_URL =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'><rect width='16' height='9' fill='%2305090a'/></svg>";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reliable muted autoplay. React's `muted` JSX prop does not dependably set the
  // DOM element's `.muted` property, so autoplay can be treated as non-muted, get
  // blocked, and show the browser's native play button. Force muted via the ref,
  // then start playback.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {
      // Autoplay can be rejected momentarily during hydration; safe to ignore.
    });
  }, []);

  // Unmute on the first user gesture anywhere — the earliest sound is allowed
  // without a play button. Never unmute on load (gesture-less sound is blocked and
  // is what caused the play-button bug). Only flip `.muted`; never restart playback.
  useEffect(() => {
    // Only "user activation" events may unmute audio; pointermove/wheel/touchstart
    // do not qualify (Chrome ignores the unmute or pauses playback). These three
    // cover mouse (pointerdown), touch/pen (pointerup), and keyboard (keydown).
    const events = ["pointerdown", "pointerup", "keydown"] as const;

    const unmute = () => {
      try {
        if (videoRef.current) videoRef.current.muted = false;
      } catch {
        // ignore — unmuting outside a valid gesture may be rejected
      }
      for (const event of events) {
        window.removeEventListener(event, unmute);
      }
    };

    for (const event of events) {
      window.addEventListener(event, unmute, { once: true });
    }

    return () => {
      for (const event of events) {
        window.removeEventListener(event, unmute);
      }
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        poster={POSTER_DATA_URL}
        className="hero-video-enter absolute inset-0 -z-10 h-full w-full object-cover"
      >
        <source src="/Video_Mgaloblishvili.mp4" type="video/mp4" />
      </video>

      <div
        aria-hidden="true"
        className="from-surface-dark/70 via-surface-dark/45 to-surface-dark/82 md:from-surface-dark/55 md:via-surface-dark/30 md:to-surface-dark/65 pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b"
      />
    </>
  );
}
