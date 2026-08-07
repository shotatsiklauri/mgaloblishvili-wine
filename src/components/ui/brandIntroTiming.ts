/**
 * How long the loading mark stays up before it may start fading. The overlay
 * exits only once BOTH this has elapsed AND the route's media has finished
 * loading (the hero video on `/`, photos elsewhere), so this is a floor: a
 * video that loads instantly still leaves the mark on screen for the full 2s.
 */
export const BRAND_INTRO_MINIMUM_MS = 2000;

/** Must stay in sync with `.brand-intro--exit` in globals.css. */
export const BRAND_INTRO_EXIT_MS = 400;

export const BRAND_INTRO_TOTAL_MS =
  BRAND_INTRO_MINIMUM_MS + BRAND_INTRO_EXIT_MS;
