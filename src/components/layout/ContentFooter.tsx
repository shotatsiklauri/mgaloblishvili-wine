import { SiteFooterMinimal } from "./SiteFooterMinimal";
import { cn } from "@/lib/utils";
import { getServerLocale } from "@/lib/locale";
import { getResolvedContact } from "@/lib/sanity/contact";

type ContentFooterProps = {
  // Footer background fill. Transparent (default) lets the page show through;
  // "black" is a solid bar used on /wines/*/* and /vineyards/*.
  background?: "transparent" | "black";
  // Text color. Defaults to light on the black bar and dark on transparent
  // footers; override to "light" for transparent footers over dark pages
  // (e.g. /history, whose root is surface-dark behind the footer).
  text?: "dark" | "light";
};

export async function ContentFooter({
  background = "transparent",
  text,
}: ContentFooterProps) {
  const locale = await getServerLocale();
  const contact = await getResolvedContact(locale);
  const isBlack = background === "black";
  const lightText = (text ?? (isBlack ? "light" : "dark")) === "light";

  return (
    <div
      className={cn(
        // Figma footer height = 120px @ 1440 (8.33vw), text centered. Capped at
        // 120 so it matches the reference instead of growing on wide screens.
        "flex shrink-0 items-center justify-center px-6",
        "min-h-[88px] md:min-h-[104px] lg:min-h-[clamp(104px,8.33vw,120px)]",
        isBlack ? "footer-overscroll-fill-dark bg-black" : "bg-transparent",
      )}
    >
      <SiteFooterMinimal
        tone={lightText ? "dark" : "light"}
        contact={contact}
      />
    </div>
  );
}
