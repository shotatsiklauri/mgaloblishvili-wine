import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getServerLocale } from "@/lib/locale";
import {
  getContent,
  getResolvedContent,
  findVineyardRegion,
} from "@/data/content";
import { HeaderContent } from "@/components/layout/HeaderContent";
import { ContentFooter } from "@/components/layout/ContentFooter";
import { IntroAwareHorizontalReveal } from "@/components/ui/IntroAwareHorizontalReveal";
import { IntroFlyIn } from "@/components/ui/IntroFlyIn";
import { cn } from "@/lib/utils";

type VineyardRegionParams = {
  params: Promise<{ region: string }>;
};

export async function generateMetadata({
  params,
}: VineyardRegionParams): Promise<Metadata> {
  const { region: regionId } = await params;
  const content = await getResolvedContent(await getServerLocale());
  const region = findVineyardRegion(content, regionId);
  return { title: region ? region.title : content.vineyards.title };
}

export function generateStaticParams() {
  return getContent().vineyards.regions.map((region) => ({
    region: region.id,
  }));
}

export default async function VineyardRegionPage({
  params,
}: VineyardRegionParams) {
  const { region: regionId } = await params;
  const locale = await getServerLocale();
  const content = await getResolvedContent(locale);
  const region = findVineyardRegion(content, regionId);
  if (!region) notFound();

  return (
    <div className="bg-surface-dark flex min-h-[calc(100svh/0.85)] flex-col">
      <HeaderContent activeId="vineyards" />
      <main className="text-ink flex-1 bg-white">
        {/* Figma @1440×900: symbol 87×96 @ (53,225), title 48px @ (50,359),
            subtitle Inter-300 16px @ (53,426), body serif-300 16px @ (52,477),
            photo 847×653 @ (593,200). Cols split at 593px = 41.18%. lg pins content
            from the top; mobile/tablet keep the responsive flow. Not hard-locked to
            900: the photo bottom sits at 853 and the longest region (Imereti) runs
            past it, so the page scrolls when content exceeds the viewport rather
            than clipping — short regions still render at exactly 900. */}
        {/* Section is at least the header↔footer band tall (100svh minus the
            fluid header + footer heights) so the photo can center within it with
            equal top/bottom gaps. Grows past the band for long regions. */}
        <section className="grid w-full items-center bg-white lg:grid-cols-[41.18%_58.82%] lg:items-start lg:py-0 lg:min-h-[calc(100svh/0.85-clamp(208px,16.667vw,268px))]">
          <div className="px-6 pt-28 pb-12 md:px-12 md:pt-36 md:pb-16 lg:pt-[clamp(92px,7.292vw,116px)] lg:pr-[1.667vw] lg:pb-0 lg:pl-[3.472vw]">
            <IntroFlyIn order={1}>
              <div className="relative aspect-square w-24 overflow-hidden lg:aspect-[87/96] lg:w-[clamp(72px,6.042vw,100px)]">
                <Image
                  src="/svgs/TheSymbol.svg"
                  alt=""
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            </IntroFlyIn>

            <div className="mt-9 max-w-[540px] lg:mt-[clamp(30px,2.639vw,44px)] lg:max-w-none">
              <IntroFlyIn order={2}>
                <h1 className="font-serif text-[44px] leading-none font-normal md:text-[48px] lg:text-[clamp(40px,3.333vw,56px)]">
                  {region.title}
                </h1>
              </IntroFlyIn>
              {region.subtitle ? (
                <IntroFlyIn order={3}>
                  <p
                    className={cn(
                      "mt-3 font-sans text-[13px] leading-[1.35] font-normal lg:mt-[clamp(14px,1.319vw,24px)] lg:text-[clamp(14px,1.111vw,18px)] lg:font-light lg:leading-none",
                      locale === "en" && "uppercase",
                    )}
                  >
                    {region.subtitle}
                  </p>
                </IntroFlyIn>
              ) : null}

              <IntroFlyIn order={4}>
                <div className="type-body-editorial text-ink/85 mt-8 space-y-0 md:mt-9 lg:text-[clamp(14px,1.111vw,18px)] lg:font-light lg:leading-[1.45] lg:tracking-normal">
                  {region.body.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </IntroFlyIn>
            </div>
          </div>

          {/* Photo is vertically centered in the header↔footer band (equal gap
              above and below), while the text column stays top-pinned. */}
          <div className="relative aspect-[851/666] w-full overflow-hidden lg:aspect-auto lg:h-[clamp(560px,45.35vw,720px)] lg:self-center">
            <IntroAwareHorizontalReveal className="absolute inset-0" durationMs={800}>
              <Image
                src={region.image1Url ?? "/images/vineyard-kakheti.png"}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="intro-zoom object-cover"
              />
            </IntroAwareHorizontalReveal>

            <IntroAwareHorizontalReveal
              delayMs={500}
              durationMs={800}
              className="absolute inset-y-0 left-0 z-10 w-[15%]"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-white/70 backdrop-blur-md"
              />
            </IntroAwareHorizontalReveal>
          </div>
        </section>
      </main>
      <ContentFooter background="black" />
    </div>
  );
}
