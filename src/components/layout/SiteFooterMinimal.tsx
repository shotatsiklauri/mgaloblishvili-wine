import { cn } from "@/lib/utils";
import { SITE_CONTACT } from "@/data/site";
import type { ResolvedContact } from "@/lib/sanity/contact";

type SiteFooterMinimalProps = {
  tone?: "light" | "dark";
  layout?: "stacked" | "inline";
  className?: string;
  contact?: ResolvedContact;
};

// Footer text adapts to the footer background: dark text on the transparent
// (light-page) footers, soft white on the solid-black footers.
const TONE_TEXT = {
  light: "text-ink-muted",
  dark: "text-ink-inverse/55",
} as const;

const TONE_DOT = {
  light: "text-ink-muted/60",
  dark: "text-ink-inverse/40",
} as const;

// Figma: Inter (font-sans), 400, 12px @ 1440 before the approved desktop
// density adjustment. Keep that adjusted reference size fluid through 1920.
const FOOTER_TYPE =
  "font-sans font-normal tracking-normal text-[clamp(11px,0.83vw,13px)] leading-none desktop:text-[max(9.35px,calc(var(--desktop-fluid-unit)*10.166))]";

export function SiteFooterMinimal({
  tone = "light",
  layout = "stacked",
  className,
  contact,
}: SiteFooterMinimalProps) {
  const { company, address } = contact ?? SITE_CONTACT;

  if (layout === "inline") {
    return (
      <footer
        className={cn(
          "flex w-full flex-row flex-wrap items-center justify-center gap-x-2 gap-y-0.5",
          FOOTER_TYPE,
          "text-center",
          TONE_TEXT[tone],
          className,
        )}
      >
        <p className="whitespace-nowrap">{company}</p>
        <span aria-hidden="true" className={TONE_DOT[tone]}>
          ·
        </span>
        <address className="whitespace-nowrap not-italic">{address}</address>
      </footer>
    );
  }

  return (
    <footer
      className={cn(
        "flex w-full flex-col items-center gap-1.5",
        FOOTER_TYPE,
        "text-center",
        TONE_TEXT[tone],
        className,
      )}
    >
      <p>{company}</p>
      <address className="not-italic">{address}</address>
    </footer>
  );
}
