import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerLocale } from "@/lib/locale";
import type { Experience, ExperienceSection } from "@/data/content";
import { findExperience, getContent, getResolvedContent } from "@/data/content";
import { HeaderContent } from "@/components/layout/HeaderContent";
import { EditorialTextCell } from "@/components/layout/EditorialTextCell";
import { SiteFooterMinimal } from "@/components/layout/SiteFooterMinimal";
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

  return (
    <div className="flex min-h-svh flex-col">
      <HeaderContent activeId="experiences" />
      <main className="text-ink flex-1 bg-white pt-16 md:pt-24 lg:pt-0">
        {/* Row 1 — first text block over a frosted image, wine glass alongside */}
        <section className="grid w-full grid-cols-1 items-start lg:grid-cols-2">
          <div className="relative flex min-h-[380px] overflow-hidden md:min-h-[440px] lg:min-h-[476px]">
            <Image
              src={experience.heroImageUrl ?? "/images/gastronomy.jpg"}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-white/70 backdrop-blur-md"
            />
            {firstSection ? (
              <ExperienceTextBlock
                section={firstSection}
                className="relative z-10"
              />
            ) : null}
          </div>

          <div className="relative h-[272px] overflow-hidden md:h-[357px] lg:h-[476px]">
            <Image
              src={experience.image1Url ?? "/images/wine_glass.png"}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </section>

        {/* Row 2 — people, then the crossroads symbol + second text block */}
        <section className="grid w-full grid-cols-1 items-start lg:grid-cols-2">
          <div className="relative h-[272px] overflow-hidden md:h-[357px] lg:h-[476px]">
            <Image
              src={experience.image2Url ?? "/images/people.png"}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center"
            />
          </div>

          {secondSection ? (
            <ExperienceTextBlock section={secondSection} symbol />
          ) : (
            <div />
          )}
        </section>

        <section>
          <Link
            href={experience.mapUrl ?? GOOGLE_MAPS_LOCATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open location in Google Maps"
            className="block cursor-pointer"
          >
            <Image
              src={experience.mapImageUrl ?? "/images/Map-mgaloblishvili.jpg"}
              alt=""
              width={1400}
              height={583}
              sizes="100vw"
              className="h-auto w-full"
            />
          </Link>
        </section>

        <section className="footer-overscroll-fill-dark bg-surface-dark px-6 py-5 md:py-6">
          <SiteFooterMinimal tone="dark" contact={contact} />
        </section>
      </main>
    </div>
  );
}

function ExperienceTextBlock({
  section,
  className,
  symbol = false,
}: {
  readonly section: ExperienceSection;
  readonly className?: string;
  readonly symbol?: boolean;
}) {
  return (
    <EditorialTextCell className={className}>
      {symbol ? (
        <div className="relative mb-8 aspect-square w-16 overflow-hidden lg:w-20">
          <Image
            src="/images/TheSymbol.jpg"
            alt=""
            fill
            sizes="80px"
            className="scale-110 object-cover [filter:grayscale(1)_contrast(8)_brightness(1.5)]"
          />
        </div>
      ) : null}
      <h2 className="type-headline lg:text-[22px] xl:text-[24px]">
        {section.heading}
      </h2>
      <div className="type-body-editorial text-ink/80 mt-5 space-y-4 lg:text-[16px]">
        {section.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </EditorialTextCell>
  );
}
