type FocusRingTone = "dark" | "light";
type FocusRingOffset = 2 | 4;

export function focusRing(
  tone: FocusRingTone = "dark",
  offset: FocusRingOffset = 2,
): string {
  const offsetSurface =
    tone === "dark"
      ? "focus-visible:ring-offset-surface-dark"
      : "focus-visible:ring-offset-surface";
  const offsetSize =
    offset === 4 ? "focus-visible:ring-offset-4" : "focus-visible:ring-offset-2";

  return [
    "rounded-sm",
    "focus-visible:outline-none",
    "focus-visible:ring-accent",
    "focus-visible:ring-2",
    offsetSurface,
    offsetSize,
  ].join(" ");
}
