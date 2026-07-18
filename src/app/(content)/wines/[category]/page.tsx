import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerLocale } from "@/lib/locale";
import {
  getResolvedContent,
  getWinesByCategory,
  isWineCategoryId,
} from "@/data/content";
import { buildWineCategories } from "@/data/navigation";
import { HeaderContent } from "@/components/layout/HeaderContent";
import { ContentFooter } from "@/components/layout/ContentFooter";
import { WinesView } from "@/components/features/WinesView";

export const metadata: Metadata = {
  title: "Wines",
};

export default async function WineCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isWineCategoryId(category)) notFound();

  const locale = await getServerLocale();
  const content = await getResolvedContent(locale);
  const categories = buildWineCategories(content);

  return (
    <div className="flex min-h-[calc(100svh)] flex-col md:h-[calc(100svh)] md:overflow-hidden">
      <HeaderContent activeId="wines" />
      <main className="flex min-h-0 flex-1 flex-col pt-16 md:pt-24 desktop:mx-auto desktop:w-full desktop:max-w-[var(--frame-max)] desktop:pt-0">
        <WinesView
          categories={categories}
          wines={getWinesByCategory(content, category)}
          activeCategoryId={category}
        />
      </main>
      <ContentFooter />
    </div>
  );
}
