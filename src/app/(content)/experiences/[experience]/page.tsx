import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerLocale } from "@/lib/locale";
import type { Experience, ExperienceSection } from "@/data/content";
import { findExperience, getContent, getResolvedContent } from "@/data/content";
import { cn } from "@/lib/utils";
import { HeaderContent } from "@/components/layout/HeaderContent";
import { SiteFooterMinimal } from "@/components/layout/SiteFooterMinimal";
import { InViewReveal } from "@/components/ui/InViewReveal";
import { ExperienceFrostIntro } from "@/components/ui/ExperienceFrostIntro";
import { getResolvedContact, type ResolvedContact } from "@/lib/sanity/contact";

const GOOGLE_MAPS_LOCATION_URL =
  "https://www.google.com/maps/place/%E1%83%9B%E1%83%90%E1%83%9A%E1%83%94---+%E1%83%A3%E1%83%9B%E1%83%90%E1%83%92%E1%83%A0%E1%83%94%E1%83%A1%E1%83%98+%E1%83%A0%E1%83%94%E1%83%A1%E1%83%A2%E1%83%9D%E1%83%A0%E1%83%90%E1%83%9C%E1%83%98/@41.6899566,45.0183496,301m/data=!3m1!1e3!4m6!3m5!1s0x404411007127eb37:0x83706136acaed0f3!8m2!3d41.6897867!4d45.019217!16s%2Fg%2F11msh1q7k7?entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D";

type ExperiencePageParams = {
  params: Promise<{ experience: string }>;
};

export async function generateMetadata({
  params,
}: ExperiencePageParams): Promise<Metadata> {
  const { experience: experienceId } = await params;
  const content = await getResolvedContent(await getServerLocale());
  const experience = findExperience(content, experienceId);
  return { title: experience ? experience.title : content.experiences.title };
}

export function generateStaticParams() {
  return getContent().experiences.items.map((experience) => ({
    experience: experience.id,
  }));
}

export default async function ExperiencePage({ params }: ExperiencePageParams) {
  const { experience: experienceId } = await params;
  const locale = await getServerLocale();
  const content = await getResolvedContent(locale);
  const experience = findExperience(content, experienceId);
  if (!experience) notFound();

  const gastronomyExperience = findExperience(content, "gastronomy");
  const textExperience =
    experience.id === "winery" &&
    !experience.hasCmsSections &&
    gastronomyExperience
      ? gastronomyExperience
      : experience;

  const contact = await getResolvedContact(locale);

  return (
    <EditorialExperiencePage
      experience={experience}
      sections={textExperience.sections}
      contact={contact}
    />
  );
}

function EditorialExperiencePage({
  experience,
  sections,
  contact,
}: {
  readonly experience: Experience;
  readonly sections: readonly ExperienceSection[];
  readonly contact: ResolvedContact;
}) {
  const [firstSection, secondSection] = sections;
  const wineSrc = experience.image1Url ?? "/images/wine_glass.png";
  // The left column is ONE photo (people.jpg by default) with the 70% frost
  // wrapping its top + right — not a separate hero image over it.
  const peopleSrc = experience.image2Url ?? "/images/people.jpg";
  const mapSrc = experience.mapImageUrl ?? "/images/Map-mgaloblishvili.jpg";
  const mapHref = experience.mapUrl ?? GOOGLE_MAPS_LOCATION_URL;

  return (
    <div className="flex min-h-[calc(100svh)] flex-col">
      <HeaderContent activeId="experiences" />
      <main className="text-ink desktop:pt-0 flex-1 pt-16 md:pt-24">
        {/* ===================== FIRST PART — desktop (lg+) =====================
            Pixel-mapped to the Figma proportions and rendered at 85% from lg.
            Left column 57.5%, right 42.5%; explicit lengths are capped at their
            scaled 1440 values. */}
        <section className="desktop:flex desktop:pt-[calc(var(--desktop-fluid-unit)*92.65)] hidden">
          {/* LEFT COLUMN — one tasting photo (people.jpg), source 828×880 (Figma).
              The 30% white frost wraps its top + right into an L and the intro copy
              sits over the frosted top band; both animate in on load (top band
              bottom→top, right strip left→right, copy fades up after). */}
          <div className="relative h-[calc(var(--desktop-fluid-unit)*748)] w-[57.5%] overflow-hidden">
            <Image
              src={peopleSrc}
              alt=""
              fill
              priority
              sizes="58vw"
              className="object-cover object-center"
            />
            <ExperienceFrostIntro>
              {firstSection ? <ExperienceProse section={firstSection} /> : null}
            </ExperienceFrostIntro>
          </div>

          {/* RIGHT COLUMN — wine photo, then the symbol + welcome copy. */}
          <div className="w-[42.5%]">
            {/* Source starts 22px lower than the left column and is 418px tall. */}
            <div className="relative mt-[calc(var(--desktop-fluid-unit)*18.7)] h-[calc(var(--desktop-fluid-unit)*355.3)] overflow-hidden">
              <Image
                src={wineSrc}
                alt=""
                fill
                sizes="43vw"
                className="object-cover object-center"
              />
            </div>
            {/* Source inset 50px; source wine→symbol gap 52px. */}
            <div className="mt-[calc(var(--desktop-fluid-unit)*44.2)] pl-[calc(var(--desktop-fluid-unit)*42.5)]">
              <div className="relative h-[calc(var(--desktop-fluid-unit)*61.2)] w-[calc(var(--desktop-fluid-unit)*55.25)]">
                <Image
                  src="/svgs/TheSymbol.svg"
                  alt=""
                  fill
                  unoptimized
                  className="object-contain object-left"
                />
              </div>
              <div className="mt-[calc(var(--desktop-fluid-unit)*15.3)] w-[calc(var(--desktop-fluid-unit)*435.2)] max-w-full">
                {secondSection ? (
                  <ExperienceProse section={secondSection} />
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* ===================== FIRST PART — mobile / tablet ===================== */}
        <section className="desktop:hidden">
          {/* One tasting photo with the frost capping its top (holding the intro
              copy); the people stay visible below it. */}
          <div className="relative min-h-[520px] overflow-hidden md:min-h-[600px]">
            <Image
              src={peopleSrc}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[58%] bg-white/70 backdrop-blur-sm"
            />
            <div className="absolute inset-x-0 top-0 px-6 py-10 md:px-12 md:py-12">
              {firstSection ? <ExperienceProse section={firstSection} /> : null}
            </div>
          </div>
          <div className="relative h-[272px] overflow-hidden md:h-[380px]">
            <Image
              src={wineSrc}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="px-6 py-10 md:px-12 md:py-12">
            <div className="relative mb-6 h-[72px] w-[65px]">
              <Image
                src="/svgs/TheSymbol.svg"
                alt=""
                fill
                unoptimized
                className="object-contain object-left"
              />
            </div>
            {secondSection ? <ExperienceProse section={secondSection} /> : null}
          </div>
        </section>

        {/* ===================== MAP =====================
            Source gap before the map: 152px. Full-bleed, 2px radius,
            with a 30% white haze over the top ~90% (Figma overlay 537 of 598).
            Reveals top→bottom (+ slow zoom) the first time it scrolls into view,
            mirroring the vineyards photo but on the vertical axis. */}
        <section className="desktop:mt-[calc(var(--desktop-fluid-unit)*129.2)] mt-10">
          <Link
            href={mapHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open location in Google Maps"
            className="desktop:rounded-[1.7px] relative block cursor-pointer overflow-hidden rounded-[2px]"
          >
            <InViewReveal durationMs={800} zoom>
              <Image
                src={mapSrc}
                alt=""
                width={1440}
                height={598}
                sizes="100vw"
                className="h-auto w-full"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[89.8%] bg-white/30"
              />
            </InViewReveal>
          </Link>
        </section>

        {/* ===================== FOOTER ADDRESS ===================== */}
        <section className="desktop:min-h-[calc(var(--desktop-fluid-unit)*93.5)] flex items-center justify-center bg-white px-6 py-8">
          <SiteFooterMinimal tone="light" contact={contact} />
        </section>
      </main>
    </div>
  );
}

function ExperienceProse({
  section,
  className,
}: {
  readonly section: ExperienceSection;
  readonly className?: string;
}) {
  return (
    <div
      className={cn(
        "desktop:text-[max(11.9px,calc(var(--desktop-fluid-unit)*13.6))] font-serif text-[15px] leading-[1.5] md:text-[16px]",
        className,
      )}
    >
      {/* Figma: the first line is bold (700); the rest is Medium (500), same size. */}
      <h2 className="font-bold">{section.heading}</h2>
      <div className="text-ink/85 desktop:mt-[calc(var(--desktop-fluid-unit)*17.136)] desktop:space-y-[calc(var(--desktop-fluid-unit)*13.464)] mt-5 space-y-4 font-medium">
        {section.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
