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

  return (
    <div className="bg-surface-dark flex min-h-[calc(100svh/0.85)] flex-col overflow-x-hidden md:h-[calc(100svh/0.85)] md:overflow-hidden">
      <HeaderContent activeId="vineyards" mobileTransparentControls="light" />
      <main className="flex flex-1 flex-col overflow-x-hidden md:min-h-0 md:overflow-hidden">
        <VineyardsMap
          regions={content.vineyards.regions}
          mapImageUrl={content.vineyards.mapImageUrl}
        />
      </main>
    </div>
  );
}
