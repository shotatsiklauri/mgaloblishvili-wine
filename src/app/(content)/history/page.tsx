import type { Metadata } from "next";
import { getServerLocale } from "@/lib/locale";
import { getResolvedContent } from "@/data/content";
import { HeaderContent } from "@/components/layout/HeaderContent";
import { ContentFooter } from "@/components/layout/ContentFooter";
import { HistoryTabs } from "@/components/features/HistoryTabs";

export const metadata: Metadata = {
  title: "History",
};

export default async function HistoryPage() {
  const locale = await getServerLocale();
  const content = await getResolvedContent(locale);

  return (
    <div className="bg-surface-dark flex min-h-svh flex-col lg:h-svh lg:overflow-hidden">
      <HeaderContent activeId="history" />
      <main className="flex flex-1 flex-col bg-white pt-16 md:pt-24 lg:min-h-0 lg:overflow-hidden lg:pt-0">
        <HistoryTabs items={content.history.items} />
      </main>
      <ContentFooter text="light" />
    </div>
  );
}
