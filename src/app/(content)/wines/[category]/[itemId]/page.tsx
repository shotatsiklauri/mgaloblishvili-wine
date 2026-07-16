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
import { IntroFlyIn } from "@/components/ui/IntroFlyIn";
import { IntroAwareHorizontalReveal } from "@/components/ui/IntroAwareHorizontalReveal";

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
      <HeaderContent activeId="wines" mobileTransparentControls="light" />
      <main className="flex-1">
        {/* Hero photo below the header; wine name centered over it.
            Figma @1440: title Noto Serif 300, 81px (5.625vw), lh 100%, #FFF. */}
        <section className="relative flex h-[240px] max-h-[520px] items-center justify-center overflow-hidden md:h-[300px] lg:h-[clamp(306px,25.5vw,442px)]">
          {/* Hero photo: 3/4 is shown immediately; only the last quarter wipes
              in left→right (revealFrom="25%"). */}
          <IntroAwareHorizontalReveal
            className="absolute inset-0"
            durationMs={800}
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
          <h1 className="text-ink-inverse relative z-10 px-6 text-center font-serif text-[clamp(40px,5.625vw,92px)] leading-none font-light lg:text-[clamp(34px,4.781vw,78.2px)]">
            {wine.name}
          </h1>
        </section>

        {/* Figma @1440: text left @138 (9.58vw) — title 36px Noto Serif 400,
            description 16px Noto Serif 300, grape-origin Inter 500 12px uppercase;
            bottle 308×1114 @ left 880 (61.11%). lg pins the bottle absolutely;
            mobile/tablet stack. */}
        <section className="text-ink relative overflow-hidden lg:min-h-[min(77.35vw,1113.84px)]">
          <div className="relative z-10 mx-auto max-w-[520px] px-6 py-16 md:px-10 md:py-20 lg:mx-0 lg:max-w-[min(30.813vw,443.707px)] lg:px-0 lg:py-0 lg:pt-[min(8.415vw,121.176px)] lg:pl-[min(8.143vw,117.259px)]">
            {/* Figma: back control is just a left arrow — a 60px (4.17vw) 1px
                line with an arrowhead @ (139,729). No text label. */}
            <Link
              href={routes.wineCategory(category)}
              aria-label={categoryLabel}
              className={cn(
                "group text-ink hover:text-accent inline-flex items-center rounded-sm",
                "transition-colors duration-200 motion-reduce:transition-none",
                focusRing("light"),
              )}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 60 10"
                fill="none"
                className="h-auto w-[48px] transition-transform duration-200 group-hover:-translate-x-1 motion-reduce:transition-none lg:w-[clamp(40.8px,3.545vw,61.2px)]"
              >
                <path
                  d="M60 5H1M1 5L6 1M1 5L6 9"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <IntroFlyIn order={1}>
              <h2 className="mt-10 font-serif text-[clamp(28px,2.5vw,44px)] leading-none font-normal lg:mt-[min(2.21vw,31.824px)] lg:text-[clamp(23.8px,2.125vw,37.4px)]">
                {wine.name}
              </h2>
            </IntroFlyIn>

            <IntroFlyIn order={2}>
              <div className="text-ink/80 mt-8 space-y-4 font-serif text-[clamp(14px,1.111vw,18px)] leading-[1.45] font-light tracking-normal lg:mt-[min(2.712vw,39.053px)] lg:text-[clamp(11.9px,0.944vw,15.3px)]">
                {wine.description.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </IntroFlyIn>

            {wine.grapeOrigin ? (
              <IntroFlyIn order={3}>
                <p className="mt-9 font-sans text-[clamp(11px,0.833vw,13px)] leading-none font-medium tracking-normal uppercase lg:mt-[min(3.834vw,55.21px)] lg:text-[clamp(9.35px,0.708vw,11.05px)]">
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

          <div className="flex justify-center pb-16 lg:absolute lg:top-[min(7.914vw,113.962px)] lg:left-[61.11%] lg:block lg:pb-0">
            {/* Left→right clip reveal on the bottle, same 800ms as the other
                detail pages. w-fit so the clip is relative to the bottle itself. */}
            <IntroAwareHorizontalReveal durationMs={800} className="w-fit">
              <Image
                src={wine.bottleImageUrl ?? "/images/wine_bottle.png"}
                alt=""
                width={308}
                height={1114}
                sizes="(min-width: 1024px) 262px, (min-width: 768px) 214px, 70vw"
                className="h-auto max-h-[660px] w-[min(70vw,167px)] max-w-full object-contain md:max-h-[820px] md:w-[min(48vw,214px)] lg:max-h-none lg:w-[min(18.182vw,261.821px)] lg:max-w-none"
              />
            </IntroAwareHorizontalReveal>
          </div>
        </section>
      </main>
      <ContentFooter />
    </div>
  );
}
