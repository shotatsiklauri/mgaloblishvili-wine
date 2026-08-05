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

  // Not locked to the viewport any more: the map section is as tall as the
  // artwork needs, so on windows wider than the map's 2230x1203 ratio (16:9 and
  // wider) the page scrolls a little rather than cropping the map.
  return (
    <div className="bg-surface-dark flex min-h-[calc(100svh)] flex-col overflow-x-hidden">
      <HeaderContent activeId="vineyards" />
      <main className="flex flex-1 flex-col overflow-x-hidden">
        <VineyardsMap
          regions={content.vineyards.regions}
          mapImageUrl={content.vineyards.mapImageUrl}
        />
      </main>
    </div>
  );
}
