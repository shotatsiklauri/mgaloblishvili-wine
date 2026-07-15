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
import { RegionScrollText } from "@/components/ui/RegionScrollText";
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
    <div className="flex min-h-[calc(100svh)] flex-col">
      <HeaderContent activeId="vineyards" />
      <main className="text-ink flex-1">
        {/* Figma @1440×1053: symbol 87×96 @ (53,225), title 48px @ (50,359),
            subtitle Inter-300 16px @ (53,426), body serif-300 16px @ (52,477),
            photo 847×653 @ (593,200). Cols split at 593px = 41.18%. lg pins content
            from the top; mobile/tablet keep the responsive flow. */}
        {/* `--vr-band` fills the viewport when space allows but never collapses
            below the 813px Figma content band at 1440. Shorter desktop viewports
            therefore scroll the document naturally instead of compressing the
            composition. `--vr-photo` follows the same capped-at-1440 rule. */}
        <section
          style={
            {
              "--vr-band":
                "max(calc(100svh - clamp(208px, 16.667vw, 240px)), clamp(680px, 56.458vw, 813px))",
              "--vr-photo": "clamp(440px, 45.347vw, 653px)",
            } as React.CSSProperties
          }
          className="grid w-full items-center lg:grid-cols-[41.18%_58.82%] lg:items-start lg:py-0 lg:min-h-[var(--vr-band)]"
        >
          {/* Text column is exactly the band tall and lays out as a flex column:
              symbol/title/subtitle pinned at the top, the body frame flexes to
              fill the rest, and the bottom padding equals the photo's bottom gap
              — (band − photo) / 2 — so the frame and the photo end level, the
              same distance above the footer. */}
          <div className="flex flex-col px-6 pt-28 pb-12 md:px-12 md:pt-36 md:pb-16 lg:h-[var(--vr-band)] lg:pt-[clamp(92px,7.292vw,105px)] lg:pr-[min(1.667vw,24px)] lg:pb-[calc((var(--vr-band)_-_var(--vr-photo))/2)] lg:pl-[min(3.472vw,50px)]">
            <IntroFlyIn order={1}>
              <div className="relative aspect-square w-24 overflow-hidden lg:aspect-[87/96] lg:w-[clamp(72px,6.042vw,87px)]">
                <Image
                  src="/svgs/TheSymbol.svg"
                  alt=""
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            </IntroFlyIn>

            <div className="mt-9 max-w-[540px] lg:mt-[clamp(30px,2.639vw,38px)] lg:flex lg:min-h-0 lg:max-w-none lg:flex-1 lg:flex-col">
              <IntroFlyIn order={2}>
                <h1 className="font-serif text-[44px] leading-none font-normal md:text-[48px] lg:text-[clamp(40px,3.333vw,48px)]">
                  {region.title}
                </h1>
              </IntroFlyIn>
              {region.subtitle ? (
                <IntroFlyIn order={3}>
                  <p
                    className={cn(
                      "mt-3 font-sans text-[13px] leading-[1.35] font-normal lg:mt-[clamp(14px,1.319vw,19px)] lg:text-[clamp(14px,1.111vw,16px)] lg:font-light lg:leading-none",
                      locale === "en" && "uppercase",
                    )}
                  >
                    {region.subtitle}
                  </p>
                </IntroFlyIn>
              ) : null}

              <IntroFlyIn order={4} className="mt-8 md:mt-9 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
                {/* Body frame flexes to fill the column down to its bottom
                    padding, so its bottom sits level with the photo. Overflow
                    hides into the scroll (no visible bar) with only the fade
                    masks + hover-scroll — long regions stay bounded. */}
                <RegionScrollText
                  className="lg:min-h-0 lg:flex-1"
                  ariaLabel={`${region.title} description`}
                >
                  <div className="type-body-editorial text-ink/85 space-y-0 lg:text-[clamp(14px,1.111vw,16px)] lg:font-light lg:leading-[1.45] lg:tracking-normal">
                    {region.body.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </RegionScrollText>
              </IntroFlyIn>
            </div>
          </div>

          {/* Photo is vertically centered in the header↔footer band (equal gap
              above and below); the text frame is padded to end at the same
              bottom line. */}
          <div className="relative aspect-[851/666] w-full overflow-hidden lg:aspect-auto lg:h-[var(--vr-photo)] lg:self-center">
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
      <ContentFooter />
    </div>
  );
}
