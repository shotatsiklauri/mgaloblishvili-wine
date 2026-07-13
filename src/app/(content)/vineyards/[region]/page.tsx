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
    <div className="bg-surface-dark flex min-h-svh flex-col lg:h-svh lg:overflow-hidden">
      <HeaderContent activeId="vineyards" />
      <main className="text-ink flex-1 bg-white lg:min-h-0 lg:overflow-hidden">
        <section className="grid w-full items-center bg-white lg:h-full lg:min-h-0 lg:grid-cols-[42%_58%] lg:py-12">
          <div className="px-6 pt-28 pb-12 md:px-12 md:pt-36 md:pb-16 lg:px-[3.5vw] lg:py-0">
            <div className="relative aspect-square w-24 overflow-hidden lg:w-28">
              <Image
                src="/images/TheSymbol.jpg"
                alt=""
                fill
                sizes="(min-width: 1024px) 112px, 96px"
                className="scale-110 object-cover [filter:grayscale(1)_contrast(8)_brightness(1.5)]"
              />
            </div>

            <div className="mt-9 max-w-[540px] lg:mt-10 lg:max-w-[640px]">
              <h1 className="font-serif text-[44px] leading-none font-normal md:text-[48px] lg:text-[56px]">
                {region.title}
              </h1>
              {region.subtitle ? (
                <p
                  className={cn(
                    "mt-3 font-sans text-[13px] leading-[1.35] font-normal lg:text-[15px]",
                    locale === "en" && "uppercase",
                  )}
                >
                  {region.subtitle}
                </p>
              ) : null}

              <div className="type-body-editorial text-ink/85 mt-8 space-y-0 md:mt-9 lg:text-[16px]">
                {region.body.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="relative aspect-[851/666] w-full overflow-hidden lg:aspect-auto lg:h-full lg:max-h-[666px]">
            <IntroAwareHorizontalReveal className="absolute inset-0">
              <Image
                src="/images/vineyard-kakheti.png"
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </IntroAwareHorizontalReveal>

            <IntroAwareHorizontalReveal
              delayMs={500}
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
