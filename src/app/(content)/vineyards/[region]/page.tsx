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
              // 210 = the scaled 105px header + 105px footer.
              "--vr-band":
                "max(calc(100svh - var(--desktop-fluid-unit) * 210), max(680px, calc(var(--desktop-fluid-unit) * 813)))",
              "--vr-photo": "max(440px, calc(var(--desktop-fluid-unit) * 653))",
              "--vr-gap": "calc((var(--vr-band) - var(--vr-photo)) / 2)",
            } as React.CSSProperties
          }
          className="desktop:min-h-[var(--vr-band)] desktop:grid-cols-[41.18%_58.82%] desktop:items-start desktop:py-0 grid w-full items-center"
        >
          <div className="desktop:h-[var(--vr-band)] desktop:pt-[max(92px,calc(var(--desktop-fluid-unit)*105))] desktop:pr-[min(var(--vr-gap),8vw)] desktop:pb-[var(--vr-gap)] desktop:pl-[calc(var(--desktop-fluid-unit)*50)] flex flex-col px-6 pt-28 pb-12 md:px-12 md:pt-36 md:pb-16">
            <IntroFlyIn order={1}>
              <div className="desktop:aspect-[87/96] desktop:w-[max(72px,calc(var(--desktop-fluid-unit)*87))] relative aspect-square w-24 overflow-hidden">
                <Image
                  src="/svgs/TheSymbol.svg"
                  alt=""
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            </IntroFlyIn>

            <div className="desktop:mt-[max(30px,calc(var(--desktop-fluid-unit)*38))] desktop:flex desktop:min-h-0 desktop:max-w-none desktop:flex-1 desktop:flex-col mt-9 max-w-[540px]">
              <IntroFlyIn order={2}>
                <h1 className="desktop:text-[max(40px,calc(var(--desktop-fluid-unit)*48))] font-serif text-[44px] leading-none font-normal md:text-[48px]">
                  {region.title}
                </h1>
              </IntroFlyIn>
              {region.subtitle ? (
                <IntroFlyIn order={3}>
                  <p
                    className={cn(
                      "desktop:mt-[max(14px,calc(var(--desktop-fluid-unit)*19))] desktop:text-[max(14px,calc(var(--desktop-fluid-unit)*16))] desktop:leading-none desktop:font-light mt-3 font-sans text-[13px] leading-[1.35] font-normal",
                      locale === "en" && "uppercase",
                    )}
                  >
                    {region.subtitle}
                  </p>
                </IntroFlyIn>
              ) : null}

              <IntroFlyIn
                order={4}
                className="desktop:mt-[max(30.6px,calc(var(--desktop-fluid-unit)*33.2))] desktop:flex desktop:min-h-0 desktop:flex-1 desktop:flex-col mt-8 md:mt-9"
              >
                <RegionScrollText
                  className="desktop:flex desktop:min-h-0 desktop:flex-1 desktop:flex-col"
                  ariaLabel={`${region.title} description`}
                >
                  <div
                    className={cn(
                      "vineyard-region-body vineyard-region-lead type-body-editorial text-ink/85 desktop:shrink-0 desktop:font-light desktop:tracking-normal space-y-0",
                      (region.id === "kakheti" || region.id === "imereti") &&
                        "desktop:mt-auto",
                    )}
                  >
                    {region.body.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </RegionScrollText>
              </IntroFlyIn>
            </div>
          </div>
          <div className="desktop:aspect-auto desktop:h-[var(--vr-photo)] desktop:self-center relative aspect-[851/666] w-full overflow-hidden">
            <IntroAwareHorizontalReveal
              className="absolute inset-0"
              durationMs={800}
            >
              <Image
                src={region.image1Url ?? "/images/vineyard-kakheti.png"}
                alt=""
                fill
                priority
                sizes="(min-width: 960px) 58vw, 100vw"
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
