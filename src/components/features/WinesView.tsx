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

  // Same spacing in both states so the words don't shift when the list opens.
  const categoryLinks = (
    <CategoryList className="space-y-[15px] text-center md:text-left lg:space-y-[12.75px]">
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
      <div className="flex flex-1 items-center justify-center px-6 py-10 md:items-start md:justify-start md:pt-[18vh] md:pl-[17.57vw] lg:pt-[15.3vh] lg:pl-[min(14.935vw,215.064px)]">
        {categoryLinks}
      </div>
    );
  }

  // Open state: words stay pinned at their index position (md:items-start — no
  // vertical re-centering), the list sits to their right at Figma left 473
  // (words block 217 + 3px), and is raised so the words sit within it (Figma
  // list top 186 ≈ 128px above the words top).
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-6 md:items-start md:justify-start md:pt-[18vh] md:pl-[17.57vw] lg:pt-[15.3vh] lg:pl-[min(14.935vw,215.064px)]">
      <div
        className={cn(
          "flex w-full flex-col items-center gap-10",
          "md:w-auto md:flex-row md:items-start md:justify-start md:gap-[3px] lg:gap-[2.55px]",
        )}
      >
        <div className="shrink-0 text-center md:w-[15.07vw] md:text-left lg:w-[min(12.81vw,184.464px)]">
          {categoryLinks}
        </div>

        <div className="w-full md:mt-[-5.76vw] md:w-auto lg:mt-[max(-70.502px,-4.896vw)]">
          <WineScrollList wines={wines} categoryId={activeCategoryId} />
        </div>
      </div>
    </div>
  );
}
