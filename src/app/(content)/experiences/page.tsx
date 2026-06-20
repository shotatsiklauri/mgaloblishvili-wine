import type { Metadata } from "next";
import { getServerLocale } from "@/lib/locale";
import { getResolvedContent } from "@/data/content";
import { HeaderContent } from "@/components/layout/HeaderContent";
import { ContentFooter } from "@/components/layout/ContentFooter";
import { ExperiencesView } from "@/components/features/ExperiencesView";

export const metadata: Metadata = {
  title: "Experiences",
};

export default async function ExperiencesPage() {
  const locale = await getServerLocale();
  const content = await getResolvedContent(locale);

  return (
    <div className="flex min-h-svh flex-col">
      <HeaderContent activeId="experiences" />
      <main className="flex min-h-0 flex-1 flex-col">
        <ExperiencesView experiences={content.experiences.items} />
      </main>
      <ContentFooter />
    </div>
  );
}
