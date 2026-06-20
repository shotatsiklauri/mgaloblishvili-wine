import { SiteFooterMinimal } from "./SiteFooterMinimal";
import { cn } from "@/lib/utils";
import { getServerLocale } from "@/lib/locale";
import { getResolvedContact } from "@/lib/sanity/contact";

type ContentFooterProps = {
  tone?: "light" | "dark";
};

export async function ContentFooter({ tone = "dark" }: ContentFooterProps) {
  const locale = await getServerLocale();
  const contact = await getResolvedContact(locale);

  return (
    <div
      className={cn(
        "shrink-0 px-6 py-4 md:py-5",
        tone === "dark" && "footer-overscroll-fill-dark bg-surface-dark",
      )}
    >
      <SiteFooterMinimal tone={tone} contact={contact} />
    </div>
  );
}
