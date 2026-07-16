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
        <section
          style={
            {
              "--vr-band":
                "max(calc(100svh - 210px), clamp(680px, 56.458vw, 813px))",
              "--vr-photo": "clamp(440px, 45.347vw, 653px)",
              "--vr-gap": "calc((var(--vr-band) - var(--vr-photo)) / 2)",
            } as React.CSSProperties
          }
          className="grid w-full items-center lg:min-h-[var(--vr-band)] lg:grid-cols-[41.18%_58.82%] lg:items-start lg:py-0"
        >
          <div className="flex flex-col px-6 pt-28 pb-12 md:px-12 md:pt-36 md:pb-16 lg:h-[var(--vr-band)] lg:pt-[clamp(92px,7.292vw,105px)] lg:pr-[var(--vr-gap)] lg:pb-[var(--vr-gap)] lg:pl-[min(3.472vw,50px)]">
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
                      "mt-3 font-sans text-[13px] leading-[1.35] font-normal lg:mt-[clamp(14px,1.319vw,19px)] lg:text-[clamp(14px,1.111vw,16px)] lg:leading-none lg:font-light",
                      locale === "en" && "uppercase",
                    )}
                  >
                    {region.subtitle}
                  </p>
                </IntroFlyIn>
              ) : null}

              <IntroFlyIn
                order={4}
                className="mt-8 md:mt-9 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col"
              >
                <RegionScrollText
                  className="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col"
                  ariaLabel={`${region.title} description`}
                >
                  <div
                    className={cn(
                      "vineyard-region-body type-body-editorial text-ink/85 space-y-0 lg:shrink-0 lg:font-light lg:tracking-normal",
                      (region.id === "kakheti" || region.id === "imereti") &&
                        "lg:mt-auto",
                    )}
                  >
                    {region.body.map((paragraph, idx) => (
                      <p
                        key={idx}
                        className={cn(idx === 0 && "first-letter:font-bold")}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </RegionScrollText>
              </IntroFlyIn>
            </div>
          </div>
          <div className="relative aspect-[851/666] w-full overflow-hidden lg:aspect-auto lg:h-[var(--vr-photo)] lg:self-center">
            <IntroAwareHorizontalReveal
              className="absolute inset-0"
              durationMs={800}
            >
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
