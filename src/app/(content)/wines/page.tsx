import type { Metadata } from "next";
import { getServerLocale } from "@/lib/locale";
import { getResolvedContent } from "@/data/content";
import { buildWineCategories } from "@/data/navigation";
import { HeaderContent } from "@/components/layout/HeaderContent";
import { ContentFooter } from "@/components/layout/ContentFooter";
import { WinesView } from "@/components/features/WinesView";

export const metadata: Metadata = {
  title: "Wines",
};

export default async function WinesPage() {
  const locale = await getServerLocale();
  const content = await getResolvedContent(locale);
  const categories = buildWineCategories(content);

  return (
    <div className="flex min-h-svh flex-col">
      <HeaderContent activeId="wines" />
      <main className="flex min-h-0 flex-1 flex-col pt-16 md:pt-24 lg:pt-0">
        <WinesView categories={categories} wines={content.wines.items} />
      </main>
      <ContentFooter />
    </div>
  );
}
