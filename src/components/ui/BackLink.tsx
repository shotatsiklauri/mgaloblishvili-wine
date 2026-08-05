import Link from "next/link";
import { cn, toMtavruliIfGeorgian } from "@/lib/utils";
import { focusRing } from "@/lib/focus-ring";

type BackLinkProps = {
  href: string;
  /** Accessible name — and the visible text when `showLabel` is set. */
  label: string;
  /**
   * Show the label next to the arrow. Without it the control is the bare
   * arrow used on the wine detail page.
   */
  showLabel?: boolean;
  className?: string;
};

/**
 * Steps back up a level (wine detail -> category, vineyard region -> map).
 * The arrow and the label are one link, so there is a single tab stop and a
 * single hover target.
 */
export function BackLink({
  href,
  label,
  showLabel = false,
  className,
}: BackLinkProps) {
  return (
    <Link
      href={href}
      // With visible text the text IS the accessible name; an aria-label would
      // only override it. The arrow-only form has to carry one.
      aria-label={showLabel ? undefined : label}
      className={cn(
        "group relative inline-flex items-center rounded-sm",
        // The arrow is a hairline and the label is small, so the box is only a
        // few px tall. Extend the clickable area with a pseudo-element rather
        // than padding: padding would change this inline box's line box and
        // nudge the content below it, whereas an absolute ::before cannot.
        "before:absolute before:inset-x-0 before:-inset-y-4 before:content-['']",
        "transition-colors duration-200 motion-reduce:transition-none",
        showLabel
          ? "text-ink-muted hover:text-accent focus-visible:text-accent desktop:gap-[max(6px,calc(var(--desktop-fluid-unit)*8))] gap-2"
          : "text-ink hover:text-accent",
        focusRing("light"),
        className,
      )}
    >
      {showLabel ? (
        <>
          <svg
            aria-hidden="true"
            viewBox="0 0 16 10"
            fill="none"
            className="desktop:w-[max(13.6px,calc(var(--desktop-fluid-unit)*16))] h-auto w-[16px] shrink-0 transition-transform duration-200 group-hover:-translate-x-1 motion-reduce:transition-none"
          >
            <path
              d="M15 5H1M1 5L5 1M1 5L5 9"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* Georgian uppercases to Mtavruli by codepoint, the same way the
              nav words do — CSS text-transform alone is not relied on here. */}
          <span className="type-menu">{toMtavruliIfGeorgian(label)}</span>
        </>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 60 10"
          fill="none"
          className="desktop:w-[max(40.8px,calc(var(--desktop-fluid-unit)*51.05))] h-auto w-[48px] transition-transform duration-200 group-hover:-translate-x-1 motion-reduce:transition-none"
        >
          <path
            d="M60 5H1M1 5L6 1M1 5L6 9"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </Link>
  );
}
