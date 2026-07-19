import { cn } from "@/lib/utils";
import { getServerLocale } from "@/lib/locale";
import { getContent } from "@/data/content";
import { buildMenuColumns } from "@/data/navigation";
import { MenuOverlay } from "./MenuOverlay";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { HamburgerButton } from "./HamburgerButton";

type HeaderHeroProps = {
  className?: string;
};

export async function HeaderHero({ className }: HeaderHeroProps) {
  const locale = await getServerLocale();
  const content = getContent(locale);
  const menuColumns = buildMenuColumns(content);

  return (
    <header
      className={cn(
        "absolute inset-x-0 top-0 z-30 flex items-start justify-between",
        "desktop:px-[calc(var(--desktop-fluid-unit)*20)] desktop:pt-[calc(var(--desktop-fluid-unit)*49)] px-5 pt-[45px] pb-5",
        "text-ink-inverse",
        className,
      )}
    >
      <MenuOverlay
        trigger={<HamburgerButton tone="light" />}
        menuColumns={menuColumns}
        currentLocale={locale}
      />
      <LanguageSwitcher current={locale} tone="dark" />
    </header>
  );
}
