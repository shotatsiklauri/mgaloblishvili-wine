"use client";

import { useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import type { MenuColumn } from "@/data/navigation";
import type { Locale } from "@/data/content";
import { cn } from "@/lib/utils";
import { focusRing } from "@/lib/focus-ring";
import { NavWord } from "@/components/ui/NavWord";
import { Wordmark } from "@/components/ui/Wordmark";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SiteFooterMinimal } from "./SiteFooterMinimal";

type MenuOverlayProps = {
  trigger: React.ReactNode;
  menuColumns: readonly MenuColumn[];
  currentLocale: Locale;
};

const COLUMN_STAGGER = [
  "menu-stagger--col-1",
  "menu-stagger--col-2",
  "menu-stagger--col-3",
  "menu-stagger--col-4",
] as const;

const DIVIDER_STAGGER = [
  "menu-divider-v--1",
  "menu-divider-v--2",
  "menu-divider-v--3",
] as const;

export function MenuOverlay({
  trigger,
  menuColumns,
  currentLocale,
}: MenuOverlayProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-40",
            "bg-surface-dark/85 backdrop-blur-sm",
            "menu-backdrop",
          )}
        />
        <Dialog.Content
          className={cn(
            "bg-surface-dark text-ink-inverse fixed inset-0 z-50 h-[calc(100svh)] overflow-hidden",
            "flex flex-col",
          )}
          aria-label="Site menu"
        >
          <Dialog.Title className="sr-only">Site menu</Dialog.Title>
          <Dialog.Description className="sr-only">
            Browse history, vineyards, wines, and experiences.
          </Dialog.Description>

          <div className="desktop:h-[calc(var(--desktop-fluid-unit)*120)] desktop:px-[calc(var(--desktop-fluid-unit)*23.8)] relative flex h-16 shrink-0 items-center justify-between px-5 md:h-24 md:px-6">
            <Dialog.Close
              className={cn(
                "menu-stagger menu-stagger--close",
                "inline-flex h-9 w-9 items-center justify-center",
                "text-ink-inverse/85 hover:text-accent cursor-pointer transition-colors duration-200",
                focusRing("dark"),
              )}
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="36"
                height="36"
                className="desktop:h-[calc(var(--desktop-fluid-unit)*36)] desktop:w-[calc(var(--desktop-fluid-unit)*36)]"
                aria-hidden="true"
                focusable="false"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeLinecap="round"
              >
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
            </Dialog.Close>

            <Link
              href="/"
              onClick={() => handleOpenChange(false)}
              aria-label="Mgaloblishvili — Home"
              className={cn(
                "menu-stagger menu-stagger--logo",
                "absolute top-1/2 left-1/2 inline-flex -translate-x-1/2 -translate-y-1/2",
                // Mobile/tablet: centred in the top bar. Desktop: centred in the
                // band between the top of the screen and the top of the menu
                // block, so the space above the wordmark matches the space
                // below it. `top` is the wordmark's centre (-translate-y-1/2)
                // and the bar starts at y=0, so this needs to be half of the
                // menu block's top edge.
                //
                // That edge is set by the columns' `my-auto` centring, which
                // works out to `50svh - unit * 112.8`: half the viewport, less
                // a share of the chrome and the columns' own height, both of
                // which now scale with the unit. Half of that is the offset
                // below. Fitted against measured tops 176 @500, 229 @649,
                // 286 @811 and 337 @900 -- within 0.2px at every one, in both
                // the height-limited and width-limited regimes.
                //
                // Both terms are viewport-relative, so this holds at any browser
                // zoom level. The previous form carried a fixed `- 71.5px`,
                // which moved the wordmark 14px when zooming. The max() only
                // guards absurdly short windows, keeping the wordmark clear of
                // the top edge.
                "desktop:top-[max(calc(var(--desktop-fluid-unit)*26),calc(25svh_-_var(--desktop-fluid-unit)*56.4))]",
                focusRing("dark"),
              )}
            >
              <Wordmark size="header" />
            </Link>

            <div className="menu-stagger menu-stagger--lang">
              <LanguageSwitcher current={currentLocale} tone="dark" />
            </div>
          </div>

          <div className="menu-overlay-scroll-region flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-8 md:px-10">
            <nav aria-label="Primary" className="my-auto w-full">
              <ul className="menu-mobile-columns desktop:hidden mx-auto flex w-full max-w-[280px] flex-col items-center gap-[clamp(32px,9svh,64px)]">
                {menuColumns.map((column, idx) => (
                  <li
                    key={column.id}
                    className={cn(
                      "menu-stagger flex w-full flex-col items-center",
                      COLUMN_STAGGER[idx],
                    )}
                  >
                    <Link
                      href={column.href}
                      onClick={() => handleOpenChange(false)}
                      className={cn(
                        "group relative inline-flex items-center pb-2",
                        focusRing("dark", 4),
                      )}
                    >
                      <NavWord
                        className="menu-mobile-nav-word primary-nav-word--header-size"
                        underlineClassName="top-full bottom-auto mt-7 left-1/2 right-auto w-[120px] -translate-x-1/2 origin-center desktop:mt-[calc(var(--desktop-fluid-unit)*34)] desktop:w-[calc(var(--desktop-fluid-unit)*140.25)]"
                      >
                        {column.title}
                      </NavWord>
                    </Link>
                  </li>
                ))}
              </ul>

              <ul
                className={cn(
                  "mx-auto hidden w-full",
                  "desktop:max-w-[calc(var(--desktop-fluid-unit)*1003)] max-w-[1180px]",
                  "grid-cols-4 gap-x-0",
                  "desktop:grid",
                )}
              >
                {menuColumns.map((column, idx) => {
                  const isLast = idx === menuColumns.length - 1;
                  return (
                    <li
                      key={column.id}
                      className={cn(
                        "relative flex flex-col items-center",
                        "menu-stagger",
                        COLUMN_STAGGER[idx],
                      )}
                    >
                      {!isLast ? (
                        <span
                          aria-hidden="true"
                          className={cn(
                            "menu-divider-v",
                            DIVIDER_STAGGER[idx],
                            "desktop:-top-[5.95vh] desktop:block desktop:h-[min(45.9vh,calc(var(--desktop-fluid-unit)*391))] pointer-events-none absolute -top-[7vh] -right-0 hidden h-[min(54vh,460px)] w-px",
                          )}
                        />
                      ) : null}

                      <Link
                        href={column.href}
                        onClick={() => handleOpenChange(false)}
                        className={cn(
                          "group relative inline-flex items-center pb-3",
                          focusRing("dark", 4),
                        )}
                      >
                        <NavWord
                          className="primary-nav-word--header-size"
                          underlineClassName="top-full bottom-auto mt-10 left-1/2 right-auto w-[165px] -translate-x-1/2 origin-center desktop:w-[calc(var(--desktop-fluid-unit)*140.25)]"
                        >
                          {column.title}
                        </NavWord>
                      </Link>

                      <ul className="mt-16 space-y-6 text-center">
                        {column.entries.map((entry) => (
                          <li key={entry.label}>
                            <Link
                              href={entry.href}
                              onClick={() => handleOpenChange(false)}
                              className={cn(
                                "font-serif text-[calc(var(--desktop-fluid-unit)*16)] leading-none font-light tracking-normal",
                                "text-center",
                                "text-ink-inverse/55 hover:text-ink-inverse",
                                "transition-colors duration-200 motion-reduce:transition-none",
                                focusRing("dark"),
                              )}
                            >
                              {entry.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="shrink-0 px-6 md:px-10">
            <div
              aria-hidden="true"
              className="menu-stagger menu-stagger--rule bg-ink-inverse/12 desktop:max-w-[calc(var(--desktop-fluid-unit)*544)] mx-auto h-px w-full max-w-[640px] origin-center"
            />
          </div>

          <div className="menu-stagger menu-stagger--contact shrink-0 px-6 py-6 md:py-8">
            <SiteFooterMinimal layout="stacked" tone="dark" />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
