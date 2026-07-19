import Image from "next/image";
import { getServerLocale } from "@/lib/locale";
import { getContent } from "@/data/content";
import { buildPrimaryNav } from "@/data/navigation";
import { HeaderHero } from "@/components/layout/HeaderHero";
import { HeroVideo } from "@/components/layout/HeroVideo";
import { SiteFooterMinimal } from "@/components/layout/SiteFooterMinimal";
import { NavLink } from "@/components/ui/NavLink";
import { cn } from "@/lib/utils";

const HOME_NAV_CENTER = [
  "desktop:left-[27.6%]",
  "desktop:left-[42.22%]",
  "desktop:left-[55.72%]",
  "desktop:left-[70.42%]",
] as const;

export default async function HomePage() {
  const locale = await getServerLocale();
  const content = getContent(locale);
  const primaryNav = buildPrimaryNav(content);

  return (
    <main
      aria-label="Mgaloblishvili"
      className="bg-surface-dark text-ink-inverse relative isolate flex h-[calc(100svh)] flex-col overflow-hidden"
    >
      <HeroVideo />

      <HeaderHero className="hero-ui-enter hero-ui-enter--header" />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6">
        <div className="hero-ui-enter hero-ui-enter--logo pointer-events-auto text-center">
          <h1 className="inline-block leading-none select-none">
            <span className="sr-only">Product of Georgia</span>
            <Image
              src="/svgs/Product_of_Georgia.svg"
              alt=""
              width={603}
              height={152}
              priority
              className="desktop:w-[calc(var(--desktop-fluid-unit)*523)] h-auto w-[270px] sm:w-[320px] md:w-[400px]"
            />
          </h1>
        </div>
      </div>

      {/* Section nav — below the logo (Figma word-top 672 = 74.667% of 900). Each
          word carries a decorative slash and reveals a 165px white underline on
          hover/focus. Tablet keeps a centered row; desktop pins each word at its
          exact Figma x inside the centered design frame (so it scales as one block
          with the rest). Word-box CENTERS as % of the 1440 frame (Figma left +
          width/2): History 355+84.85/2=397.4 → 27.6%, Vineyards 559+98/2=608 →
          42.22%, Wines 760+84.85/2=802.4 → 55.72%, Experiences 955+118/2=1014 →
          70.42%. */}
      <nav
        aria-label="Sections"
        className={cn(
          "hero-ui-enter hero-ui-enter--nav",
          "absolute top-[74.667%] left-1/2 z-10 -translate-x-1/2",
          "hidden md:flex md:items-start md:justify-center md:gap-x-16",
          "desktop:block desktop:w-full desktop:max-w-[var(--frame-max)]",
        )}
      >
        {primaryNav.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "desktop:absolute desktop:top-0 desktop:-translate-x-1/2",
              HOME_NAV_CENTER[index],
            )}
          >
            <NavLink
              href={item.href}
              wordClassName="primary-nav-word--header-size"
              underlineClassName="top-full bottom-auto mt-10 left-1/2 right-auto w-[165px] -translate-x-1/2 origin-center desktop:w-[calc(var(--desktop-fluid-unit)*165)] desktop:h-[calc(var(--desktop-fluid-unit)*3)]"
            >
              {item.label}
            </NavLink>
          </div>
        ))}
      </nav>

      <div className="hero-ui-enter hero-ui-enter--contact absolute inset-x-0 bottom-0 z-10 px-6 pb-8">
        <SiteFooterMinimal
          layout="inline"
          tone="dark"
          className="md:text-ink-muted"
        />
      </div>
    </main>
  );
}
