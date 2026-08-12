import Link from "next/link";
import type { ExperienceId } from "@/data/content";
import { routes } from "@/data/routes";
import { cn } from "@/lib/utils";
import { focusRing } from "@/lib/focus-ring";
import { AnimatedCategoryList } from "./AnimatedCategoryList";

type ExperienceLink = {
  readonly id: ExperienceId;
  readonly title: string;
};

type ExperiencesViewProps = {
  readonly experiences: readonly ExperienceLink[];
};

export function ExperiencesView({ experiences }: ExperiencesViewProps) {
  return (
    <div className="desktop:items-center desktop:py-0 desktop:pl-[calc(var(--desktop-fluid-unit)*215.064)] flex flex-1 items-start justify-start pt-56 pr-6 pb-6 pl-[75px] md:items-start md:justify-start md:pt-[18vh] md:pl-[17.57vw]">
      {/* -50% of the block's own height lifts it so the last word sits on the
          vertical centre of the band between header and footer, matching the
          wines index. See WinesView for the same treatment. */}
      <AnimatedCategoryList className="desktop:-translate-y-1/2 space-y-[15px] text-left leading-none md:space-y-1">
        {experiences.map((experience) => (
          <li key={experience.id}>
            <Link
              href={routes.experience(experience.id)}
              className={cn(
                "type-category-large category-index-word inline-block rounded-sm",
                "transition-colors duration-300 ease-out motion-reduce:transition-none",
                "text-ink hover:text-accent focus-visible:text-accent",
                focusRing("light"),
              )}
            >
              {experience.title}
            </Link>
          </li>
        ))}
      </AnimatedCategoryList>
    </div>
  );
}
