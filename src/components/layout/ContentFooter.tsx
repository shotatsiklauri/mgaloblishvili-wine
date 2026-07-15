import { SiteFooterMinimal } from "./SiteFooterMinimal";
import { cn } from "@/lib/utils";
import { getServerLocale } from "@/lib/locale";
import { getResolvedContact } from "@/lib/sanity/contact";

type ContentFooterProps = {
  // Page footers are white by default. The home and /vineyards landing pages
  // render SiteFooterMinimal directly over their media, so they stay transparent.
  background?: "white" | "transparent";
  // Text color defaults to dark on white/transparent light-page footers.
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
        // Figma source height = 120px; the desktop target is 85% = 102px.
        "flex shrink-0 items-center justify-center px-6",
        "min-h-[88px] md:min-h-[104px] lg:min-h-[clamp(88.4px,7.081vw,102px)]",
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
