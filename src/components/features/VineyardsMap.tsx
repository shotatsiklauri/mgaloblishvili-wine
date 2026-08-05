import Image from "next/image";
import Link from "next/link";
import type { VineyardRegion, VineyardRegionId } from "@/data/content";
import { routes } from "@/data/routes";
import { SiteFooterMinimal } from "@/components/layout/SiteFooterMinimal";
import { cn } from "@/lib/utils";
import { focusRing } from "@/lib/focus-ring";
import { getServerLocale } from "@/lib/locale";
import { getResolvedContact } from "@/lib/sanity/contact";
import { VineyardRegionsOverlay } from "./VineyardRegionsOverlay";

type VineyardsMapProps = {
  regions: readonly VineyardRegion[];
  activeRegionId?: VineyardRegionId;
  mapImageUrl?: string;
};

export async function VineyardsMap({
  regions,
  activeRegionId,
  mapImageUrl,
}: VineyardsMapProps) {
  const locale = await getServerLocale();
  const contact = await getResolvedContact(locale);

  return (
    <section
      className={cn(
        "bg-surface-dark relative isolate flex min-h-[calc(100svh-4rem)] flex-1 flex-col overflow-hidden",
        // md+: give the section the artwork's own ratio, so covering it crops
        // nothing — the full height of the map is visible. It is still never
        // shorter than the space under the header, and on windows narrower than
        // the artwork's ratio that min-height wins and cover trims the (empty)
        // sides instead. flex-none stops the column stretching it back.
        "md:aspect-[2230/1203] md:min-h-[calc(100svh_-_6rem)] md:flex-none",
        "desktop:min-h-[calc(100svh_-_var(--desktop-fluid-unit)*120)]",
      )}
    >
      {/* Mobile keeps the full-bleed treatment. */}
      <div className="absolute inset-0 overflow-hidden md:hidden">
        <Image
          src="/images/map-mobile.jpeg"
          alt="Map of Georgian vineyard regions"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="from-surface-dark/35 via-surface-dark/8 to-surface-dark/45 absolute inset-0 bg-gradient-to-b"
        />
      </div>

      {/* Desktop: the map is handed to the overlay so the artwork and the
          clickable regions live in one box and stay registered to each other.
          object-cover fills the section edge to edge without stretching — it
          must stay in step with the SVG layers' preserveAspectRatio slice. */}
      <VineyardRegionsOverlay
        regions={regions}
        activeRegionId={activeRegionId}
        map={
          <>
            <Image
              src={mapImageUrl ?? "/images/map.jpg"}
              alt="Map of Georgian vineyard regions"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="from-surface-dark/10 via-surface-dark/10 to-surface-dark/38 absolute inset-0 bg-gradient-to-r"
            />
          </>
        }
      />

      <div className="absolute top-1/2 left-1/2 z-10 w-full max-w-[310px] -translate-x-1/2 -translate-y-1/2 px-6 md:hidden">
        <nav aria-label="Vineyard regions" className="w-full text-center">
          <ul className="space-y-3">
            {regions.map((region) => (
              <li key={region.id}>
                <Link
                  href={routes.vineyardRegion(region.id)}
                  aria-current={
                    activeRegionId === region.id ? "page" : undefined
                  }
                  className={cn(
                    "type-submenu inline-block rounded-sm text-[27px] leading-[1.5]",
                    "text-ink-inverse/62 transition-colors duration-300 ease-out",
                    "hover:text-accent focus-visible:text-accent",
                    "motion-reduce:transition-none",
                    focusRing("dark"),
                  )}
                >
                  {region.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 px-6 md:hidden">
        <SiteFooterMinimal tone="dark" contact={contact} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 hidden px-6 md:bottom-8 md:block">
        <SiteFooterMinimal tone="dark" contact={contact} />
      </div>
    </section>
  );
}
