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
    <CategoryList className="desktop:space-y-[calc(var(--desktop-fluid-unit)*12.75)] space-y-[15px] text-center md:text-left">
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
      <div className="desktop:pt-[15.3vh] desktop:pl-[calc(var(--desktop-fluid-unit)*215.064)] flex flex-1 items-center justify-center px-6 py-10 md:items-start md:justify-start md:pt-[18vh] md:pl-[17.57vw]">
        {categoryLinks}
      </div>
    );
  }

  return (
    <div className="desktop:pt-[15.3vh] desktop:pl-[calc(var(--desktop-fluid-unit)*215.064)] flex flex-1 items-center justify-center px-6 py-6 md:items-start md:justify-start md:pt-[18vh] md:pl-[17.57vw]">
      <div
        className={cn(
          "flex w-full flex-col items-center gap-10",
          "desktop:gap-[2.55px] md:w-auto md:flex-row md:items-start md:justify-start md:gap-[3px]",
        )}
      >
        <div className="desktop:w-[calc(var(--desktop-fluid-unit)*184.464)] shrink-0 text-center md:w-[15.07vw] md:text-left">
          {categoryLinks}
        </div>

        <div className="desktop:mt-[calc(var(--desktop-fluid-unit)*-70.502)] w-full md:mt-[-5.76vw] md:w-auto">
          <WineScrollList wines={wines} categoryId={activeCategoryId} />
        </div>
      </div>
    </div>
  );
}
