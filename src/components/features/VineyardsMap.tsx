import Image from "next/image";
import Link from "next/link";
import mobileMapImage from "../../../public/images/map-mobile.jpg";
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
    <section className="bg-surface-dark relative isolate flex min-h-[calc(100svh-4rem)] flex-1 flex-col overflow-hidden md:min-h-0">
      {/* Mobile keeps the full-bleed treatment. */}
      <div className="absolute inset-0 overflow-hidden md:hidden">
        <Image
          src={mobileMapImage}
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
          The asset is cropped to ~2:1 (see MAP_CROP in lib/sanity/adapter.ts),
          near the shape of this section, so object-cover fills it edge to edge
          while trimming only empty background — no gaps, no letterboxing, no
          scroll. It must stay in step with the SVG layers' "slice". */}
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

      <div className="absolute top-1/2 right-6 left-[75px] z-10 -translate-y-1/2 md:hidden">
        <nav aria-label="Vineyard regions" className="w-full text-left">
          <ul className="space-y-3">
            {regions.map((region) => (
              <li key={region.id}>
                <Link
                  href={routes.vineyardRegion(region.id)}
                  aria-current={
                    activeRegionId === region.id ? "page" : undefined
                  }
                  className={cn(
                    "type-submenu inline-block rounded-sm text-[21.6px] leading-[1.5]",
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
