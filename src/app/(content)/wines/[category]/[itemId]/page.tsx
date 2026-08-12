import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getServerLocale } from "@/lib/locale";
import { getResolvedContent, findWine, isWineCategoryId } from "@/data/content";
import { routes } from "@/data/routes";
import { HeaderContent } from "@/components/layout/HeaderContent";
import { ContentFooter } from "@/components/layout/ContentFooter";
import { IntroFlyIn } from "@/components/ui/IntroFlyIn";
import { IntroAwareHorizontalReveal } from "@/components/ui/IntroAwareHorizontalReveal";
import { BackLink } from "@/components/ui/BackLink";

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
    <div className="flex min-h-[calc(100svh)] flex-col">
      <HeaderContent activeId="wines" />
      <main className="flex-1">
        <section className="desktop:h-[calc(var(--desktop-fluid-unit)*367.2)] desktop:max-h-none relative flex h-[240px] max-h-[520px] items-center justify-center overflow-hidden md:h-[300px]">
          <IntroAwareHorizontalReveal
            className="absolute inset-0"
            durationMs={1040}
            revealFrom="25%"
          >
            <Image
              src={wine.heroImageUrl ?? "/images/wine_page_header.webp"}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </IntroAwareHorizontalReveal>
          <div
            aria-hidden="true"
            className="from-surface-dark/35 via-surface-dark/10 to-surface-dark/35 absolute inset-0 bg-gradient-to-r"
          />
          <h1 className="text-ink-inverse desktop:translate-y-0 desktop:text-[calc(var(--desktop-fluid-unit)*68.85)] relative z-10 translate-y-[55px] px-6 text-center font-serif text-[clamp(40px,5.625vw,92px)] leading-none font-light">
            {wine.name}
          </h1>
        </section>

        <section className="text-ink desktop:mx-auto desktop:min-h-[calc(var(--desktop-fluid-unit)*1113.84)] desktop:max-w-[var(--frame-max)] relative overflow-hidden">
          <div className="desktop:mx-0 desktop:max-w-[calc(var(--desktop-fluid-unit)*443.707)] desktop:px-0 desktop:py-0 desktop:pt-[calc(var(--desktop-fluid-unit)*121.176)] desktop:pl-[calc(var(--desktop-fluid-unit)*117.259)] relative z-10 mx-auto max-w-[520px] px-6 py-16 md:px-10 md:py-20">
            <BackLink
              href={routes.wineCategory(category)}
              label={categoryLabel}
            />

            <IntroFlyIn order={1}>
              <h2 className="desktop:mt-[calc(var(--desktop-fluid-unit)*31.824)] desktop:text-[calc(var(--desktop-fluid-unit)*30.6)] mt-10 font-serif text-[clamp(28px,2.5vw,44px)] leading-none font-normal">
                {wine.name}
              </h2>
            </IntroFlyIn>

            <IntroFlyIn order={2}>
              <div className="text-ink/80 desktop:mt-[calc(var(--desktop-fluid-unit)*39.053)] desktop:text-[calc(var(--desktop-fluid-unit)*13.6)] mt-8 space-y-4 font-serif text-[clamp(14px,1.111vw,18px)] leading-[1.45] font-light tracking-normal">
                {wine.description.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </IntroFlyIn>

            {wine.grapeOrigin ? (
              <IntroFlyIn order={3}>
                <p className="desktop:mt-[calc(var(--desktop-fluid-unit)*55.21)] desktop:text-[calc(var(--desktop-fluid-unit)*10.2)] mt-9 font-sans text-[clamp(11px,0.833vw,13px)] leading-none font-medium tracking-normal uppercase">
                  <span className="text-accent">
                    {content.wines.originLabel}
                  </span>
                  <span aria-hidden="true" className="text-ink-muted mx-2">
                    |
                  </span>
                  <span className="text-ink">{wine.grapeOrigin}</span>
                </p>
              </IntroFlyIn>
            ) : null}
          </div>

          <div className="desktop:absolute desktop:top-[calc(var(--desktop-fluid-unit)*113.962)] desktop:left-[61.11%] desktop:block desktop:pb-0 flex justify-center pb-16">
            <IntroAwareHorizontalReveal durationMs={1040} className="w-fit">
              <Image
                src={wine.bottleImageUrl ?? "/images/wine_bottle.png"}
                alt=""
                width={308}
                height={1114}
                sizes="(min-width: 960px) 22vw, (min-width: 768px) 214px, 70vw"
                className="desktop:max-h-none desktop:w-[calc(var(--desktop-fluid-unit)*261.821)] desktop:max-w-none h-auto max-h-[660px] w-[min(70vw,167px)] max-w-full object-contain md:max-h-[820px] md:w-[min(48vw,214px)]"
              />
            </IntroAwareHorizontalReveal>
          </div>
        </section>
      </main>
      <ContentFooter />
    </div>
  );
}
