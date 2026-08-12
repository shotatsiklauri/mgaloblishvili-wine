import Link from "next/link";
import type { Wine, WineCategoryId } from "@/data/content";
import type { WineCategoryNavItem } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { focusRing } from "@/lib/focus-ring";
import { AnimatedCategoryList } from "./AnimatedCategoryList";
import { WineScrollList } from "./WineScrollList";

type WinesViewProps = {
  categories: readonly WineCategoryNavItem[];
  wines: readonly Wine[];
  activeCategoryId?: WineCategoryId;
};

export function WinesView({
  categories,
  wines,
  activeCategoryId,
}: WinesViewProps) {
  const isIndex = activeCategoryId === undefined;

  const CategoryList = isIndex ? AnimatedCategoryList : "ul";

  const categoryLinks = (
    <CategoryList
      className={cn(
        // leading-none so the row height comes from the word, not from the
        // font's integer-rounded metrics, which do not scale linearly.
        "desktop:-translate-y-1/2 desktop:space-y-[calc(var(--desktop-fluid-unit)*12.75)] space-y-[15px] text-left leading-none",
      )}
    >
      {categories.map((category) => {
        const active = category.id === activeCategoryId;
        return (
          <li key={category.id}>
            <Link
              href={category.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "type-category-large category-index-word inline-block rounded-sm",
                "transition-colors duration-300 ease-out motion-reduce:transition-none",
                active ? "text-accent" : "text-ink hover:text-accent",
                focusRing("light"),
              )}
            >
              {category.label}
            </Link>
          </li>
        );
      })}
    </CategoryList>
  );

  if (activeCategoryId === undefined) {
    return (
      <div className="desktop:items-center desktop:py-0 desktop:pl-[calc(var(--desktop-fluid-unit)*215.064)] flex flex-1 items-start justify-start pt-14 pr-6 pb-6 pl-[75px] md:items-start md:justify-start md:pt-[18vh] md:pl-[17.57vw]">
        {categoryLinks}
      </div>
    );
  }

  return (
    <div className="desktop:items-center desktop:py-0 desktop:pl-[calc(var(--desktop-fluid-unit)*215.064)] flex flex-1 items-start justify-start pt-14 pr-4 pb-6 pl-[75px] md:items-start md:justify-start md:pt-[18vh] md:pl-[17.57vw]">
      <div
        className={cn(
          "flex w-full min-w-0 flex-row items-start gap-3",
          "desktop:gap-[calc(var(--desktop-fluid-unit)*2.55)] md:w-auto md:flex-row md:items-start md:justify-start md:gap-[3px]",
        )}
      >
        <div className="desktop:w-[calc(var(--desktop-fluid-unit)*184.464)] w-[118px] shrink-0 text-left md:w-[15.07vw]">
          {categoryLinks}
        </div>

        <div className="desktop:mt-[calc(var(--desktop-fluid-unit)*-70.502)] desktop:h-0 min-w-0 flex-1 md:mt-[-5.76vw] md:w-auto md:flex-none">
          <WineScrollList wines={wines} categoryId={activeCategoryId} />
        </div>
      </div>
    </div>
  );
}
