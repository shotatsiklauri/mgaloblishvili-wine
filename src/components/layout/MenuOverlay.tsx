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
            "bg-surface-dark text-ink-inverse fixed inset-0 z-50 h-svh overflow-hidden",
            "flex flex-col",
          )}
          aria-label="Site menu"
        >
          <Dialog.Title className="sr-only">Site menu</Dialog.Title>
          <Dialog.Description className="sr-only">
            Browse history, vineyards, wines, and experiences.
          </Dialog.Description>

          <div className="grid h-16 shrink-0 grid-cols-[auto_1fr_auto] items-center px-5 md:h-24 md:px-6 lg:h-28 lg:px-7">
            <div className="justify-self-start">
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
            </div>

            <Link
              href="/"
              onClick={() => handleOpenChange(false)}
              aria-label="Mgaloblishvili — Home"
              className={cn(
                "menu-stagger menu-stagger--logo",
                "inline-flex justify-self-center",
                focusRing("dark"),
              )}
            >
              <Wordmark size="header" />
            </Link>

            <div className="menu-stagger menu-stagger--lang justify-self-end">
              <LanguageSwitcher current={currentLocale} tone="dark" />
            </div>
          </div>

          <nav
            aria-label="Primary"
            className="min-h-0 flex-1 overflow-y-auto px-6 md:px-10"
          >
            <div className="flex min-h-full items-center justify-center py-8 lg:hidden">
              <ul className="mx-auto flex w-full max-w-[320px] flex-col items-center gap-12">
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
                        "group relative inline-flex items-center pb-3",
                        focusRing("dark", 4),
                      )}
                    >
                      <NavWord underlineClassName="top-full bottom-auto mt-4">
                        {column.title}
                      </NavWord>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden min-h-full items-start justify-center py-[clamp(2rem,5vh,4rem)] lg:flex lg:items-center">
              <ul
                className={cn(
                  "mx-auto grid w-full",
                  "max-w-[1180px]",
                  "gap-x-0",
                  "grid-cols-4",
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
                            "pointer-events-none absolute -top-[2vh] -right-0 hidden h-[min(54vh,560px)] w-px lg:block",
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
                        <NavWord underlineClassName="top-full bottom-auto mt-3 md:mt-4">
                          {column.title}
                        </NavWord>
                      </Link>

                      <ul className="mt-8 space-y-3.5 text-center">
                        {column.entries.map((entry) => (
                          <li key={entry.label}>
                            <Link
                              href={entry.href}
                              onClick={() => handleOpenChange(false)}
                              className={cn(
                                "type-submenu",
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
            </div>
          </nav>

          <div className="shrink-0 px-6 md:px-10">
            <div
              aria-hidden="true"
              className="menu-stagger menu-stagger--rule bg-ink-inverse/12 mx-auto h-px w-full max-w-[640px] origin-center"
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
