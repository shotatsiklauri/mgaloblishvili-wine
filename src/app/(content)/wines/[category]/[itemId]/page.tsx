import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerLocale } from "@/lib/locale";
import { getResolvedContent, findWine, isWineCategoryId } from "@/data/content";
import { routes } from "@/data/routes";
import { cn } from "@/lib/utils";
import { focusRing } from "@/lib/focus-ring";
import { HeaderContent } from "@/components/layout/HeaderContent";
import { ContentFooter } from "@/components/layout/ContentFooter";

type WineDetailParams = {
  params: Promise<{ category: string; itemId: string }>;
};

export async function generateMetadata({
  params,
}: WineDetailParams): Promise<Metadata> {
  const { itemId } = await params;
  const content = await getResolvedContent(await getServerLocale());
  const wine = findWine(content, itemId);
  return { title: wine ? wine.name : "Wines" };
}

export default async function WineDetailPage({ params }: WineDetailParams) {
  const { category, itemId } = await params;
  if (!isWineCategoryId(category)) notFound();

  const locale = await getServerLocale();
  const content = await getResolvedContent(locale);
  const wine = findWine(content, itemId);
  if (!wine) notFound();

  const categoryLabel =
    content.wines.categories.find((c) => c.id === category)?.label ??
    content.nav.wines;

  return (
    <div className="bg-surface-dark flex min-h-svh flex-col">
      <HeaderContent activeId="wines" mobileTransparentControls="light" />
      <main className="flex-1">
        <section className="relative flex h-[240px] max-h-[360px] items-center justify-center overflow-hidden md:h-[300px] lg:h-[min(30vw,360px)]">
          <Image
            src={wine.heroImageUrl ?? "/images/wine_page_header.webp"}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="from-surface-dark/35 via-surface-dark/10 to-surface-dark/35 absolute inset-0 bg-gradient-to-r"
          />
          <h1 className="type-display-hero text-ink-inverse relative z-10 px-6 text-center">
            {wine.name}
          </h1>
        </section>

        <section className="bg-surface/88 text-ink overflow-hidden">
          <div className="mx-auto grid min-h-[720px] w-full max-w-[1280px] grid-cols-1 gap-12 px-6 py-16 md:px-10 md:py-20 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-20 lg:py-24 xl:gap-28">
            <div className="relative z-10 max-w-[520px] lg:pt-16">
              <Link
                href={routes.wineCategory(category)}
                className={cn(
                  "group text-ink-muted hover:text-accent inline-flex items-center gap-3 rounded-sm",
                  "type-menu",
                  "transition-colors duration-200 motion-reduce:transition-none",
                  focusRing("light"),
                )}
              >
                <span
                  aria-hidden="true"
                  className="text-[18px] leading-none transition-transform duration-200 group-hover:-translate-x-1 motion-reduce:transition-none"
                >
                  ←
                </span>
                {categoryLabel}
              </Link>

              <h2 className="type-headline mt-10">
                {wine.name}
              </h2>

              <div className="type-body-editorial text-ink/80 mt-8 space-y-4">
                {wine.description.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {wine.grapeOrigin ? (
                <p className="type-menu mt-9">
                  <span className="text-accent">
                    {content.wines.originLabel}
                  </span>
                  <span aria-hidden="true" className="text-ink-muted mx-2">
                    |
                  </span>
                  <span className="text-ink">{wine.grapeOrigin}</span>
                </p>
              ) : null}
            </div>

            <div className="relative flex min-h-[520px] items-start justify-center lg:min-h-[780px]">
              <Image
                src={wine.bottleImageUrl ?? "/images/wine_bottle.png"}
                alt=""
                width={308}
                height={1114}
                sizes="(min-width: 1024px) 250px, (min-width: 768px) 214px, 70vw"
                className="h-auto max-h-[660px] w-[min(70vw,167px)] max-w-full object-contain md:max-h-[820px] md:w-[min(48vw,214px)] lg:max-h-[900px] lg:w-[250px]"
              />
            </div>
          </div>
        </section>
      </main>
      <ContentFooter tone="dark" />
    </div>
  );
}
