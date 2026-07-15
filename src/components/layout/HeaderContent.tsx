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

// Desktop nav word positions as % of the 1440px Figma canvas (left edge of each
// word), so the header matches Figma exactly at 1440 and scales fluidly on either
// side. Order matches buildPrimaryNav: history, vineyards, wines, experiences.
// History 154, Vineyards 358, Wines 980, Experiences 1175 (÷1440).
const NAV_LEFT_POS = [
  "lg:left-[10.694%]",
  "lg:left-[24.861%]",
  "lg:left-[68.056%]",
  "lg:left-[81.597%]",
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
    <HeaderScrollFrame className={cn("site-header--compact", className)}>
      <div
        className={cn(
          // Bar background is full-width (HeaderScrollFrame); the content itself
          // is centered in the 1440 Figma frame so the nav words (positioned by
          // % below) land at their exact Figma x and the header stops spreading
          // on ultra-wide screens.
          "relative mx-auto flex w-full max-w-[1440px] items-center",
          // Figma desktop frame height = 120px @ 1440 (8.333vw), capped at 120
          // so it matches the reference instead of growing past it.
          "h-16 md:h-24 lg:h-[clamp(104px,8.333vw,120px)]",
          "px-5 md:px-6 lg:px-6",
        )}
      >
        <div className="flex items-center">
          <MenuOverlay
            trigger={
              <HamburgerButton
                tone="light"
                className={cn(
                  usesLightMobileControls ? "text-ink-inverse" : "text-ink",
                  "group-data-[scrolled=true]/header:text-ink-inverse lg:text-ink-inverse",
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
              "absolute inset-y-0 hidden items-center lg:flex",
              NAV_LEFT_POS[index],
            )}
          >
            <NavLink
              href={item.href}
              active={activeId === item.id}
              edgeUnderline
              underlineClassName="lg:-right-8 lg:-left-8 lg:h-[2px]"
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
              "inline-flex group-data-[scrolled=true]/header:invert-0 lg:invert-0",
              usesLightMobileControls ? "invert-0" : "invert",
              focusRing("dark"),
            )}
          >
            {/* Figma logo width = 253px @ 1440 (17.57vw), clamped. */}
            <Wordmark
              size="header"
              className="lg:w-[clamp(220px,17.57vw,280px)]"
            />
          </Link>
        </div>

        <div className="ml-auto flex items-center justify-end">
          <LanguageSwitcher
            current={locale}
            tone={usesLightMobileControls ? "dark" : "light"}
            className={cn(
              "group-data-[scrolled=true]/header:[&_button[aria-pressed=true]]:text-ink-inverse",
              "group-data-[scrolled=true]/header:[&_button[aria-pressed=false]]:text-ink-inverse/70",
              "lg:[&_button[aria-pressed=true]]:text-ink-inverse",
              "lg:[&_button[aria-pressed=false]]:text-ink-inverse/70",
            )}
          />
        </div>
      </div>
    </HeaderScrollFrame>
  );
}
