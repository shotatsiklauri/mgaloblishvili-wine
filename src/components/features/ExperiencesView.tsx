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
    <div className="flex flex-1 items-center justify-center px-6 py-10 md:items-start md:justify-start md:pt-[18vh] md:pl-[17.57vw]">
      <AnimatedCategoryList className="space-y-1 text-center md:text-left">
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
