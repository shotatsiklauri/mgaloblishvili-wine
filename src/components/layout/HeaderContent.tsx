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

export async function HeaderContent({
  activeId,
  className,
  mobileTransparentControls = "dark",
}: HeaderContentProps) {
  const locale = await getServerLocale();
  const content = getContent(locale);
  const primaryNav = buildPrimaryNav(content);
  const menuColumns = buildMenuColumns(content);
  const [left, right] = [primaryNav.slice(0, 2), primaryNav.slice(2)];
  const usesLightMobileControls = mobileTransparentControls === "light";

  return (
    <HeaderScrollFrame className={cn("site-header--compact", className)}>
      <div
        className={cn(
          "grid w-full items-center",
          "h-16 md:h-24 lg:h-24",
          "grid-cols-[auto_1fr_auto] lg:grid-cols-[auto_1fr_auto_1fr_auto]",
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

        <nav
          aria-label="Primary (left)"
          className={cn(
            "hidden min-w-0 items-center justify-center self-stretch lg:h-full",
            "gap-x-10 lg:flex lg:gap-x-20 xl:gap-x-28",
          )}
        >
          {left.map((item) => (
            <NavLink
              key={item.id}
              href={item.href}
              active={activeId === item.id}
              edgeUnderline
              underlineClassName="lg:-right-12 lg:-left-12 lg:h-[2px]"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center justify-center">
          <Link
            href="/"
            aria-label="Mgaloblishvili — Home"
            className={cn(
              "inline-flex group-data-[scrolled=true]/header:invert-0 lg:invert-0",
              usesLightMobileControls ? "invert-0" : "invert",
              focusRing("dark"),
            )}
          >
            <Wordmark size="header" />
          </Link>
        </div>

        <nav
          aria-label="Primary (right)"
          className={cn(
            "hidden min-w-0 items-center justify-center self-stretch lg:h-full",
            "gap-x-10 lg:flex lg:gap-x-20 xl:gap-x-28",
          )}
        >
          {right.map((item) => (
            <NavLink
              key={item.id}
              href={item.href}
              active={activeId === item.id}
              edgeUnderline
              underlineClassName="lg:-right-12 lg:-left-12 lg:h-[2px]"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-end">
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
