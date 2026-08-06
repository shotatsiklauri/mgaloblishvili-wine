export const FEATURE_VIDEO_SRC = "/Mgaloblishvili-AD.mp4";

export type IntroMediaScope = "home" | "content";

export const INTRO_MEDIA_READY_EVENT =
  "mgaloblishvili:intro-media-ready";

const statusAttribute = (scope: IntroMediaScope) =>
  `data-intro-media-${scope}`;

export function markIntroMediaLoading(scope: IntroMediaScope) {
  document.documentElement.setAttribute(statusAttribute(scope), "loading");
}

export function markIntroMediaReady(scope: IntroMediaScope) {
  document.documentElement.setAttribute(statusAttribute(scope), "ready");
  window.dispatchEvent(
    new CustomEvent(INTRO_MEDIA_READY_EVENT, { detail: { scope } }),
  );
}

export function isIntroMediaReady(scope: IntroMediaScope) {
  return (
    document.documentElement.getAttribute(statusAttribute(scope)) === "ready"
  );
}
