import type { Metadata } from "next";
import { getServerLocale } from "@/lib/locale";
import { getResolvedContent } from "@/data/content";
import { HeaderContent } from "@/components/layout/HeaderContent";
import { VineyardsMap } from "@/components/features/VineyardsMap";

export const metadata: Metadata = {
  title: "Vineyards",
};

export default async function VineyardsPage() {
  const locale = await getServerLocale();
  const content = await getResolvedContent(locale);

  // Locked to one screen: the map is fitted inside the section rather than
  // sized by its own ratio, so it never needs more room than there is.
  return (
    <div className="bg-surface-dark flex min-h-[calc(100svh)] flex-col overflow-x-hidden md:h-[calc(100svh)] md:overflow-hidden">
      <HeaderContent
        activeId="vineyards"
        className="desktop:bg-surface-dark border-transparent bg-transparent"
      />
      <main className="flex flex-1 flex-col overflow-x-hidden md:min-h-0 md:overflow-hidden">
        <VineyardsMap
          regions={content.vineyards.regions}
          mapImageUrl={content.vineyards.mapImageUrl}
          mapMobileImageUrl={content.vineyards.mapMobileImageUrl}
        />
      </main>
    </div>
  );
}
