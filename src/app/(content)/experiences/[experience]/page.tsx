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
import { RegionScrollText } from "@/components/ui/RegionScrollText";
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

  const contact = await getResolvedContact(locale);

  return (
    <EditorialExperiencePage
      experience={experience}
      sections={experience.sections}
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
  const peopleSrc = experience.image2Url ?? "/images/people.jpg";
  const mapSrc = experience.mapImageUrl ?? "/images/Map-mgaloblishvili.jpg";
  const mapHref = experience.mapUrl ?? GOOGLE_MAPS_LOCATION_URL;

  return (
    <div className="flex min-h-[calc(100svh)] flex-col">
      <HeaderContent activeId="experiences" />
      {/* No --frame-max cap here: this page is full-bleed by design, so the
          photo panels, the map and the footer strip run edge to edge. The
          vertical rhythm inside still comes from the fluid unit, and the copy
          keeps its 50px insets, so only the horizontal fills out. */}
      <main className="text-ink desktop:pt-0 flex-1 pt-16 md:pt-24">
        <section className="desktop:flex desktop:pt-[calc(var(--desktop-fluid-unit)*109)] hidden">
          <div className="relative h-[calc(var(--desktop-fluid-unit)*880)] w-[57.5%] overflow-hidden">
            <Image
              src={peopleSrc}
              alt=""
              fill
              priority
              sizes="58vw"
              className="object-cover object-center"
            />
            <ExperienceFrostIntro>
              {firstSection ? (
                <RegionScrollText
                  // max-h, not h: at its natural height the copy is centred in
                  // the frosted band by the justify-center above it, so the gaps
                  // above and below it match. h-full would stretch it to fill
                  // the band and pin the copy to the top. Long copy (ka) still
                  // caps at the band height and scrolls.
                  className="desktop:max-h-full"
                  ariaLabel={firstSection.heading}
                >
                  <ExperienceProse section={firstSection} />
                </RegionScrollText>
              ) : null}
            </ExperienceFrostIntro>
          </div>

          <div className="w-[42.5%]">
            <div className="relative mt-[calc(var(--desktop-fluid-unit)*22)] h-[calc(var(--desktop-fluid-unit)*418)] overflow-hidden">
              <Image
                src={wineSrc}
                alt=""
                fill
                sizes="43vw"
                className="object-cover object-center"
              />
            </div>
            <div className="mt-[calc(var(--desktop-fluid-unit)*52)] pl-[calc(var(--desktop-fluid-unit)*50)]">
              <div className="relative h-[calc(var(--desktop-fluid-unit)*72)] w-[calc(var(--desktop-fluid-unit)*65)]">
                <Image
                  src="/svgs/TheSymbol.svg"
                  alt=""
                  fill
                  unoptimized
                  className="object-contain object-left"
                />
              </div>
              <RegionScrollText
                className="desktop:h-[calc(var(--desktop-fluid-unit)*298)] mt-[calc(var(--desktop-fluid-unit)*18)] w-[calc(var(--desktop-fluid-unit)*512)] max-w-full"
                ariaLabel={experience.title}
              >
                {secondSection ? (
                  <ExperienceProse section={secondSection} />
                ) : null}
              </RegionScrollText>
            </div>
          </div>
        </section>

        <section className="desktop:hidden">
          <div className="relative h-[420px] overflow-hidden md:h-[560px]">
            <Image
              src={peopleSrc}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="px-6 py-10 md:px-12 md:py-12">
            {firstSection ? <ExperienceProse section={firstSection} /> : null}
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

        <section className="desktop:mt-[calc(var(--desktop-fluid-unit)*152)] mt-10">
          <Link
            href={mapHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open location in Google Maps"
            className="relative block cursor-pointer overflow-hidden rounded-[2px]"
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

        <section className="desktop:min-h-[calc(var(--desktop-fluid-unit)*110)] flex items-center justify-center bg-white px-6 py-8">
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
        "desktop:text-[calc(var(--desktop-fluid-unit)*15)] font-serif text-[15px] leading-[1.5] tracking-normal md:text-[16px]",
        className,
      )}
    >
      <h2 className="font-medium">{section.heading}</h2>
      <div className="text-ink/85 desktop:mt-[calc(var(--desktop-fluid-unit)*20.16)] desktop:space-y-[calc(var(--desktop-fluid-unit)*15.84)] mt-5 space-y-4 font-light">
        {section.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
