import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getServerLocale } from "@/lib/locale";
import { getContent, getResolvedContent, findVineyardRegion } from "@/data/content";
import { HeaderContent } from "@/components/layout/HeaderContent";
import { ContentFooter } from "@/components/layout/ContentFooter";
import { EditorialTextCell } from "@/components/layout/EditorialTextCell";

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

  const splitIndex = Math.ceil(region.body.length / 2);
  const firstParagraphs = region.body.slice(0, splitIndex);
  const remainingParagraphs = region.body.slice(splitIndex);

  return (
    <div className="bg-surface-dark flex min-h-svh flex-col">
      <HeaderContent activeId="vineyards" />
      <main className="text-ink flex-1 bg-white">
        <section className="flex h-[272px] items-center justify-center bg-white md:h-[374px] lg:h-[442px]">
          <div className="px-6 text-center">
            <h1 className="type-display-hero text-ink font-light">
              {region.title}
            </h1>
            {region.subtitle ? (
              <p className="type-submenu text-ink/70 mt-5">
                {region.subtitle}
              </p>
            ) : null}
          </div>
        </section>

        <section className="grid w-full grid-cols-1 items-start lg:grid-cols-2">
          <div className="relative order-1 h-[272px] w-full self-start justify-self-start overflow-hidden md:h-[357px] lg:h-[476px] lg:order-none">
            <Image
              src={region.image1Url ?? "/images/vazi.webp"}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-left-top"
            />
          </div>

          <EditorialTextCell className="order-2 lg:order-none">
            <div className="type-body-editorial text-ink/80 space-y-5">
              {firstParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </EditorialTextCell>

          <EditorialTextCell className="order-4 lg:order-none">
            <div className="type-body-editorial text-ink/80 space-y-5">
              {remainingParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </EditorialTextCell>

          <div className="relative order-3 h-[272px] w-full self-start justify-self-end overflow-hidden md:h-[357px] lg:h-[476px] lg:order-none">
            <Image
              src={region.image2Url ?? "/images/bucket.webp"}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-right-top"
            />
          </div>
        </section>
      </main>
      <ContentFooter tone="dark" />
    </div>
  );
}
