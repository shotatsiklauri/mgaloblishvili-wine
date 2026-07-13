import Image from "next/image";
import { getServerLocale } from "@/lib/locale";
import { getContent } from "@/data/content";
import { buildPrimaryNav } from "@/data/navigation";
import { HeaderHero } from "@/components/layout/HeaderHero";
import { HeroVideo } from "@/components/layout/HeroVideo";
import { SiteFooterMinimal } from "@/components/layout/SiteFooterMinimal";
import { NavLink } from "@/components/ui/NavLink";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const locale = await getServerLocale();
  const content = getContent(locale);
  const primaryNav = buildPrimaryNav(content);

  return (
    <main
      aria-label="Mgaloblishvili"
      className="bg-surface-dark text-ink-inverse relative isolate flex h-svh flex-col overflow-hidden"
    >
      <HeroVideo />

      <HeaderHero className="hero-ui-enter hero-ui-enter--header" />

      {/* Product-of-Georgia logo — centered on the frame (Figma: 523px @ 1440,
          vertical center 450 = 900 / 2). */}
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
              className="h-auto w-[270px] sm:w-[320px] md:w-[400px] lg:w-[clamp(440px,36.3vw,620px)]"
            />
          </h1>
        </div>
      </div>

      {/* Section nav — below the logo (Figma word-top 672 ≈ 74.7% of 900). Each
          word carries a decorative slash and reveals a 165px white underline on
          hover/focus. */}
      <nav
        aria-label="Sections"
        className={cn(
          "hero-ui-enter hero-ui-enter--nav",
          "absolute top-[74.7%] left-1/2 z-10 -translate-x-1/2",
          "hidden md:flex md:items-start md:justify-center md:gap-x-16 lg:gap-x-20",
        )}
      >
        {primaryNav.map((item) => (
          <NavLink
            key={item.id}
            href={item.href}
            underlineClassName="top-full bottom-auto mt-10 left-1/2 right-auto w-[165px] -translate-x-1/2 origin-center"
          >
            {item.label}
          </NavLink>
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
