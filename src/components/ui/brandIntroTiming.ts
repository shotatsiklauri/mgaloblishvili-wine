/**
 * How long the loading mark stays up before it may start fading. The overlay
 * exits only once BOTH this has elapsed AND the route's media has finished
 * loading (the hero video on `/`, photos elsewhere), so this is a floor: a
 * video that loads instantly still leaves the mark on screen for 2.1s before
 * the 400ms exit, making the complete minimum loading cycle 2.5s.
 */
export const BRAND_INTRO_MINIMUM_MS = 2100;

/** Must stay in sync with `.brand-intro--exit` in globals.css. */
export const BRAND_INTRO_EXIT_MS = 400;

export const BRAND_INTRO_TOTAL_MS =
  BRAND_INTRO_MINIMUM_MS + BRAND_INTRO_EXIT_MS;
