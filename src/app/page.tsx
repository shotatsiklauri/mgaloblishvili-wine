import Image from "next/image";
import { getServerLocale } from "@/lib/locale";
import { getContent } from "@/data/content";
import { buildPrimaryNav } from "@/data/navigation";
import { HeaderHero } from "@/components/layout/HeaderHero";
import { SiteFooterMinimal } from "@/components/layout/SiteFooterMinimal";
import { NavLink } from "@/components/ui/NavLink";

const POSTER_DATA_URL =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'><rect width='16' height='9' fill='%2305090a'/></svg>";

export default async function HomePage() {
  const locale = await getServerLocale();
  const content = getContent(locale);
  const primaryNav = buildPrimaryNav(content);

  return (
    <main
      aria-label="Mgaloblishvili"
      className="bg-surface-dark text-ink-inverse relative isolate flex min-h-svh flex-col overflow-hidden"
    >
      <video
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        poster={POSTER_DATA_URL}
        className="hero-video-enter absolute inset-0 -z-10 h-full w-full object-cover"
      >
        <source src="/Video_Mgaloblishvili.mp4" type="video/mp4" />
      </video>

      <div
        aria-hidden="true"
        className="from-surface-dark/70 via-surface-dark/45 to-surface-dark/82 pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b md:from-surface-dark/55 md:via-surface-dark/30 md:to-surface-dark/65"
      />

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
              className="h-auto w-[270px] sm:w-[320px] md:w-[338px] lg:w-[400px]"
            />
          </h1>
        </div>
      </div>

      <div className="flex-1" />

      <div className="relative z-10 flex flex-col items-center gap-10 px-6 pb-8 md:gap-16 md:pb-10 lg:gap-20">
        <nav
          aria-label="Sections"
          className="hero-ui-enter hero-ui-enter--nav hidden w-full md:flex md:max-w-none md:flex-wrap md:items-center md:justify-center md:gap-x-16 md:gap-y-3 lg:gap-x-20"
        >
          {primaryNav.map((item) => (
            <NavLink
              key={item.id}
              href={item.href}
              underlineClassName="top-full bottom-auto mt-3 md:mt-4"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hero-ui-enter hero-ui-enter--contact w-full">
          <SiteFooterMinimal
            layout="inline"
            tone="dark"
            className="md:text-ink-muted"
          />
        </div>
      </div>
    </main>
  );
}
