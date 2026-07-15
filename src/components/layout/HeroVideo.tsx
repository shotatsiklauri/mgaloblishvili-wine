"use client";

import { useEffect, useRef, useState } from "react";
import { focusRing } from "@/lib/focus-ring";
import { cn } from "@/lib/utils";

const POSTER_DATA_URL =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'><rect width='16' height='9' fill='%2305090a'/></svg>";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Reliable muted autoplay. React's `muted` JSX prop does not dependably set the
  // DOM element's `.muted` property, so autoplay can be treated as non-muted, get
  // blocked, and show the browser's native play button. Force muted via the ref,
  // then start playback — retrying once the media is ready and, as a last resort,
  // on the first user interaction. A single early play() attempt can lose the race
  // with media loading (notably in Safari) and leave the video paused on load.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const tryPlay = () => {
      const played = video.play();
      // Ignore rejections here; the event/interaction listeners retry.
      if (played) played.catch(() => {});
    };

    tryPlay();

    // First play() can reject before there's enough data; retry when ready.
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);

    // Last resort: if autoplay stayed blocked, start on the first interaction.
    const onFirstInteract = () => {
      tryPlay();
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
    };
    window.addEventListener("pointerdown", onFirstInteract);
    window.addEventListener("keydown", onFirstInteract);

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
    };
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted) {
      void video.play().catch(() => {
        video.muted = true;
        setIsMuted(true);
      });
    }
  };

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

      <button
        type="button"
        aria-label={isMuted ? "Unmute background video" : "Mute background video"}
        aria-pressed={!isMuted}
        onClick={toggleSound}
        className={cn(
          "absolute right-5 bottom-5 z-20 inline-flex size-10 items-center justify-center border border-ink-inverse/45 bg-surface-dark/35 text-ink-inverse transition-colors hover:bg-surface-dark/65 sm:right-6 sm:bottom-6",
          focusRing("dark"),
        )}
      >
        {isMuted ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="M11 5 6.5 9H3v6h3.5l4.5 4z" />
            <path d="m16 9 5 6" />
            <path d="m21 9-5 6" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="M11 5 6.5 9H3v6h3.5l4.5 4z" />
            <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5" />
            <path d="M18 7a7 7 0 0 1 0 10" />
          </svg>
        )}
        <span className="sr-only">
          {isMuted ? "Sound is muted" : "Sound is on"}
        </span>
      </button>
    </>
  );
}
