import Link from "next/link";
import { getServerLocale } from "@/lib/locale";
import { getContent } from "@/data/content";
import {
  buildMenuColumns,
  buildPrimaryNav,
  type NavRouteId,
} from "@/data/navigation";
import { cn } from "@/lib/utils";
import { focusRing } from "@/lib/focus-ring";
import { NavLink } from "@/components/ui/NavLink";
import { Wordmark } from "@/components/ui/Wordmark";
import { HeaderFadeDown } from "@/components/ui/HeaderFadeDown";
import { MenuOverlay } from "./MenuOverlay";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { HamburgerButton } from "./HamburgerButton";
import { HeaderScrollFrame } from "./HeaderScrollFrame";

type HeaderContentProps = {
  activeId?: NavRouteId;
  className?: string;
};

const NAV_LEFT_POS = [
  "desktop:left-[10.694%]",
  "desktop:left-[24.861%]",
  "desktop:left-[68.056%]",
  "desktop:left-[81.597%]",
] as const;

export async function HeaderContent({
  activeId,
  className,
}: HeaderContentProps) {
  const locale = await getServerLocale();
  const content = getContent(locale);
  const primaryNav = buildPrimaryNav(content);
  const menuColumns = buildMenuColumns(content);

  return (
    <HeaderScrollFrame
      className={cn("site-header--figma desktop:border-b-0", className)}
    >
      <div
        className={cn(
          "relative flex w-full items-center",
          "desktop:overflow-hidden",
          "desktop:h-[calc(var(--desktop-fluid-unit)*120)] h-16 md:h-24",
          "desktop:px-[max(17px,calc(var(--desktop-fluid-unit)*20))] px-5 md:px-6",
        )}
      >
        <HeaderFadeDown className="flex items-center">
          <MenuOverlay
            trigger={
              <HamburgerButton
                tone="light"
                className="desktop:[&>span]:h-[max(49.3px,calc(var(--desktop-fluid-unit)*58))] desktop:[&>span]:w-[max(49.3px,calc(var(--desktop-fluid-unit)*58))]"
              />
            }
            menuColumns={menuColumns}
            currentLocale={locale}
          />
        </HeaderFadeDown>

        {primaryNav.map((item, index) => (
          <HeaderFadeDown
            key={item.id}
            className={cn(
              "desktop:flex absolute inset-y-0 hidden items-center",
              NAV_LEFT_POS[index],
            )}
          >
            <NavLink
              href={item.href}
              active={activeId === item.id}
              edgeUnderline
              wordClassName={cn(
                "desktop:translate-y-[calc(var(--desktop-fluid-unit)*24)]",
                index < 2 &&
                  "desktop:translate-y-[calc(var(--desktop-fluid-unit)*27.5)]",
              )}
              underlineClassName="desktop:right-auto desktop:left-1/2 desktop:h-[2px] desktop:w-[max(117px,calc(var(--desktop-fluid-unit)*165))] desktop:-translate-x-1/2"
              className="h-full px-0"
            >
              {item.label}
            </NavLink>
          </HeaderFadeDown>
        ))}

        <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center">
          <HeaderFadeDown>
            <Link
              href="/"
              aria-label="Mgaloblishvili — Home"
              className={cn("inline-flex invert-0", focusRing("dark"))}
            >
              <Wordmark
                size="header"
                className="desktop:w-[max(180px,calc(var(--desktop-fluid-unit)*253))] desktop:[&_img]:w-full"
              />
            </Link>
          </HeaderFadeDown>
        </div>

        <HeaderFadeDown className="ml-auto flex items-center justify-end">
          <LanguageSwitcher
            current={locale}
            tone="dark"
            className="desktop:h-[max(26px,calc(var(--desktop-fluid-unit)*30))] desktop:w-[max(22px,calc(var(--desktop-fluid-unit)*26))] desktop:justify-between desktop:gap-0"
          />
        </HeaderFadeDown>
      </div>
    </HeaderScrollFrame>
  );
}
