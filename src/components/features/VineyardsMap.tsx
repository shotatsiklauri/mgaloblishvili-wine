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
    <section className="bg-surface-dark relative isolate flex min-h-[calc(100svh/0.85-4rem)] flex-1 flex-col overflow-hidden md:min-h-0">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={mapImageUrl ?? "/images/map.jpg"}
          alt="Map of Georgian vineyard regions"
          fill
          priority
          sizes="(min-width: 768px) 100vw, 1px"
          className="hidden scale-[1.1] object-cover object-center md:block"
        />
        <Image
          src="/images/map-mobile.jpg"
          alt="Map of Georgian vineyard regions"
          fill
          priority
          sizes="(max-width: 767px) 100vw, 1px"
          className="object-cover object-center md:hidden"
        />
        <div
          aria-hidden="true"
          className="from-surface-dark/35 via-surface-dark/8 to-surface-dark/45 absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r md:from-surface-dark/10 md:via-surface-dark/10 md:to-surface-dark/38"
        />
      </div>

      <VineyardRegionsOverlay regions={regions} activeRegionId={activeRegionId} />

      <div className="absolute top-1/2 left-1/2 z-10 w-full max-w-[310px] -translate-x-1/2 -translate-y-1/2 px-6 md:hidden">
        <nav
          aria-label="Vineyard regions"
          className="w-full text-center"
        >
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

      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 hidden px-6 md:block md:bottom-8">
        <SiteFooterMinimal tone="dark" contact={contact} />
      </div>
    </section>
  );
}
