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
    <CategoryList className={cn(isIndex ? "space-y-[15px] text-center md:text-left" : "space-y-1")}>
      {categories.map((category) => {
        const active = category.id === activeCategoryId;
        return (
          <li key={category.id}>
            <Link
              href={category.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "type-category-large inline-block rounded-sm",
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
      <div className="flex flex-1 items-center justify-center px-6 py-10 md:items-start md:justify-start md:pt-[18vh] md:pl-[13vw]">
        {categoryLinks}
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-6 md:items-start md:justify-start md:pt-[18vh] md:pl-[13vw]">
      <div
        className={cn(
          "flex w-full max-w-[820px] flex-col items-center gap-10",
          "md:flex-row md:items-center md:justify-start md:gap-16 lg:gap-24",
        )}
      >
        <div className="shrink-0 text-center md:w-[260px] md:text-left">
          {categoryLinks}
        </div>

        <WineScrollList wines={wines} categoryId={activeCategoryId} />
      </div>
    </div>
  );
}
