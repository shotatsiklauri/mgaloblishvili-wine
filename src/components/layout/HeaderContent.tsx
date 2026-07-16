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
import { MenuOverlay } from "./MenuOverlay";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { HamburgerButton } from "./HamburgerButton";
import { HeaderScrollFrame } from "./HeaderScrollFrame";

type HeaderContentProps = {
  activeId?: NavRouteId;
  className?: string;
  mobileTransparentControls?: "dark" | "light";
};

// Desktop nav word positions as percentages derived from the 1440px Figma
// canvas (left edge of each word), applied to the live full-width header frame.
// Order matches buildPrimaryNav: history, vineyards, wines, experiences.
// History 154, Vineyards 358, Wines 980, Experiences 1175 (÷1440).
const NAV_LEFT_POS = [
  "desktop:left-[10.694%]",
  "desktop:left-[24.861%]",
  "desktop:left-[68.056%]",
  "desktop:left-[81.597%]",
] as const;

export async function HeaderContent({
  activeId,
  className,
  mobileTransparentControls = "dark",
}: HeaderContentProps) {
  const locale = await getServerLocale();
  const content = getContent(locale);
  const primaryNav = buildPrimaryNav(content);
  const menuColumns = buildMenuColumns(content);
  const usesLightMobileControls = mobileTransparentControls === "light";

  return (
    <HeaderScrollFrame
      className={cn("site-header--figma desktop:border-b-0", className)}
    >
      <div
        className={cn(
          // Bar background and coordinate frame are full-width. Percentage-
          // positioned nav words therefore keep their source relationships
          // instead of jumping into a centered 1440px box on wide screens.
          "relative mx-auto flex w-full items-center",
          // Mobile/tablet retain their existing sizes; desktop uses the approved
          // shared 105px header/footer height, scaled by the fluid unit.
          "desktop:h-[calc(var(--desktop-fluid-unit)*105)] h-16 md:h-24",
          "desktop:px-[max(17px,calc(var(--desktop-fluid-unit)*20))] px-5 md:px-6",
        )}
      >
        <div className="flex items-center">
          <MenuOverlay
            trigger={
              <HamburgerButton
                tone="light"
                className={cn(
                  "desktop:[&>span]:h-[max(49.3px,calc(var(--desktop-fluid-unit)*58))] desktop:[&>span]:w-[max(49.3px,calc(var(--desktop-fluid-unit)*58))]",
                  usesLightMobileControls ? "text-ink-inverse" : "text-ink",
                  "group-data-[scrolled=true]/header:text-ink-inverse desktop:text-ink-inverse",
                )}
              />
            }
            menuColumns={menuColumns}
            currentLocale={locale}
          />
        </div>

        {/* Desktop nav words — absolutely positioned at their exact Figma x. */}
        {primaryNav.map((item, index) => (
          <div
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
                index < 2 &&
                  "desktop:translate-y-[max(2.5px,calc(var(--desktop-fluid-unit)*3.5))]",
              )}
              underlineClassName="desktop:right-auto desktop:left-1/2 desktop:h-[2px] desktop:w-[max(117px,calc(var(--desktop-fluid-unit)*165))] desktop:-translate-x-1/2"
              className="h-full px-0"
            >
              {item.label}
            </NavLink>
          </div>
        ))}

        {/* Logo — centered on the frame (Figma center 720 = 1440 / 2). */}
        <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center">
          <Link
            href="/"
            aria-label="Mgaloblishvili — Home"
            className={cn(
              "desktop:invert-0 inline-flex group-data-[scrolled=true]/header:invert-0",
              usesLightMobileControls ? "invert-0" : "invert",
              focusRing("dark"),
            )}
          >
            {/* Figma logo width = 253px @ 1440 (17.57vw), clamped. */}
            <Wordmark
              size="header"
              className="desktop:w-[max(180px,calc(var(--desktop-fluid-unit)*253))] desktop:[&_img]:w-full"
            />
          </Link>
        </div>

        <div className="ml-auto flex items-center justify-end">
          <LanguageSwitcher
            current={locale}
            tone={usesLightMobileControls ? "dark" : "light"}
            className={cn(
              "desktop:h-[max(26px,calc(var(--desktop-fluid-unit)*30))] desktop:w-[max(22px,calc(var(--desktop-fluid-unit)*26))] desktop:justify-between desktop:gap-0",
              "group-data-[scrolled=true]/header:[&_button[aria-pressed=true]]:text-ink-inverse",
              "group-data-[scrolled=true]/header:[&_button[aria-pressed=false]]:text-ink-inverse/70",
              "desktop:[&_button[aria-pressed=true]]:text-ink-inverse",
              "desktop:[&_button[aria-pressed=false]]:text-ink-inverse/70",
            )}
          />
        </div>
      </div>
    </HeaderScrollFrame>
  );
}
