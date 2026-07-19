import { SiteFooterMinimal } from "./SiteFooterMinimal";
import { cn } from "@/lib/utils";
import { getServerLocale } from "@/lib/locale";
import { getResolvedContact } from "@/lib/sanity/contact";

type ContentFooterProps = {
  background?: "white" | "transparent";
  text?: "dark" | "light";
};

export async function ContentFooter({
  background = "white",
  text,
}: ContentFooterProps) {
  const locale = await getServerLocale();
  const contact = await getResolvedContact(locale);
  const lightText = (text ?? "dark") === "light";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center px-6",
        "desktop:min-h-[calc(var(--desktop-fluid-unit)*105)] min-h-[88px] md:min-h-[104px]",
        background === "white" ? "bg-white" : "bg-transparent",
      )}
    >
      <SiteFooterMinimal
        tone={lightText ? "dark" : "light"}
        contact={contact}
      />
    </div>
  );
}
