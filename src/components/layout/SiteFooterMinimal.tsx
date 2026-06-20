import { cn } from "@/lib/utils";
import { SITE_CONTACT } from "@/data/site";
import type { ResolvedContact } from "@/lib/sanity/contact";

type SiteFooterMinimalProps = {
  tone?: "light" | "dark";
  layout?: "stacked" | "inline";
  className?: string;
  contact?: ResolvedContact;
};

const TONE_TEXT = {
  light: "text-ink-muted",
  dark: "text-ink-inverse/55",
} as const;

const TONE_DOT = {
  light: "text-ink-muted/60",
  dark: "text-ink-inverse/40",
} as const;

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
          "type-meta text-center",
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
        "flex w-full flex-col items-center gap-0.5",
        "type-meta",
        TONE_TEXT[tone],
        className,
      )}
    >
      <p>{company}</p>
      <address className="not-italic">{address}</address>
    </footer>
  );
}
