"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Wine, WineCategoryId } from "@/data/content";
import { routes } from "@/data/routes";
import { cn } from "@/lib/utils";
import { focusRing } from "@/lib/focus-ring";

type WineScrollListProps = {
  wines: readonly Wine[];
  categoryId: WineCategoryId;
};

type ScrollState = {
  height: number;
  top: number;
  visible: boolean;
  canScrollUp: boolean;
  canScrollDown: boolean;
};

const MIN_THUMB = 28;

export function WineScrollList({ wines, categoryId }: WineScrollListProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [scrollState, setScrollState] = useState<ScrollState>({
    height: 0,
    top: 0,
    visible: false,
    canScrollUp: false,
    canScrollDown: false,
  });

  const update = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight <= clientHeight + 1) {
      setScrollState((prev) =>
        prev.visible || prev.canScrollUp || prev.canScrollDown
          ? {
              height: 0,
              top: 0,
              visible: false,
              canScrollUp: false,
              canScrollDown: false,
            }
          : prev,
      );
      return;
    }
    const proportional = (clientHeight / scrollHeight) * clientHeight;
    const height = Math.min(
      Math.max(proportional, MIN_THUMB),
      clientHeight * 0.33,
    );
    const maxScroll = scrollHeight - clientHeight;
    const top =
      maxScroll > 0 ? (scrollTop / maxScroll) * (clientHeight - height) : 0;
    setScrollState({
      height,
      top,
      visible: true,
      canScrollUp: scrollTop > 1,
      canScrollDown: scrollTop < maxScroll - 1,
    });
  }, []);

  useEffect(() => {
    update();
    const el = listRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  return (
    <div
      key={categoryId}
      className="wine-list-enter flex w-full items-stretch justify-center gap-8 md:w-auto md:gap-[2.5vw] lg:gap-[min(2.125vw,30.6px)]"
    >
      <div className="wine-scroll-area flex w-full items-start justify-center md:w-auto">
        <ul
          ref={listRef}
          aria-label="Wine list"
          className={cn(
            "wine-scroll-fade no-scrollbar w-full space-y-4 text-center",
            // Fixed viewport height so the list scrolls (shows the scrollbar) and
            // stays bounded regardless of item count; keeps thumb ~120px (0.33 cap).
            "max-h-full md:h-[360px] md:overflow-y-auto md:pr-2 md:text-left md:whitespace-nowrap lg:h-[306px]",
            scrollState.canScrollUp && "wine-scroll-fade--top",
            scrollState.canScrollDown && "wine-scroll-fade--bottom",
          )}
        >
          {wines.map((wine) => (
            <li key={wine.id}>
              <Link
                href={routes.wineItem(categoryId, wine.id)}
                className={cn(
                  "type-submenu wine-list-word text-ink/85 hover:text-accent inline-block rounded-sm",
                  "transition-colors duration-200 motion-reduce:transition-none",
                  focusRing("light"),
                )}
              >
                {wine.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div
        aria-hidden="true"
        className="bg-ink/15 wine-scroll-track relative hidden w-px shrink-0 md:block"
      >
        {scrollState.visible ? (
          <span
            className="bg-ink absolute left-1/2 w-[3px] -translate-x-1/2 rounded-full lg:w-[2.55px]"
            style={{ height: scrollState.height, top: scrollState.top }}
          />
        ) : null}
      </div>
    </div>
  );
}
