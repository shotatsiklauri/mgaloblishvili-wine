"use client";

import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import Image from "next/image";
import type { HistoryItem, HistoryItemId } from "@/data/content";
import { useIntroReady } from "@/components/ui/useIntroReady";
import { cn, toMtavruliIfGeorgian } from "@/lib/utils";
import { focusRing } from "@/lib/focus-ring";

type HistoryTabsProps = {
  items: readonly HistoryItem[];
};

const PANEL_PHOTOS: Record<HistoryItemId, string> = {
  encounter: "/images/Family.jpg",
  crossroads: "/images/Crossroads.jpg",
  symbol: "/images/TheSymbol.jpg",
};

export function HistoryTabs({ items: historyItems }: HistoryTabsProps) {
  // Controlled so each panel knows when it becomes active and can (re)play its
  // entrance. Toggling the entrance class on activation is what reliably
  // restarts the CSS animation for the newly-shown section.
  const [active, setActive] = useState<HistoryItemId>("encounter");

  return (
    <Tabs.Root
      value={active}
      onValueChange={(value) => setActive(value as HistoryItemId)}
      orientation="horizontal"
      activationMode="manual"
      className="flex flex-1 flex-col lg:min-h-0"
    >
      <div className="flex flex-1 flex-col lg:min-h-0">
        {historyItems.map((tab) => (
          <HistoryTabPanel key={tab.id} tab={tab} isActive={active === tab.id} />
        ))}
      </div>

      <div className="shrink-0 bg-white">
        {/* Figma tab bar: 120px tall, group centered (~982px @ 1440); words
            Inter 600 / 12px / 0.3em near the top, 3px black underline at the
            bottom that reveals on hover/active, accent text when active. */}
        <Tabs.List
          aria-label="History sections"
          className={cn(
            "grid grid-cols-1 sm:grid-cols-3",
            "lg:mx-auto lg:w-full lg:max-w-[68vw]",
            "lg:h-[clamp(104px,8.333vw,132px)]",
          )}
        >
          {historyItems.map((tab) => (
            <Tabs.Trigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "group relative flex cursor-pointer items-center justify-center py-5",
                "lg:items-start lg:py-0 lg:pt-[clamp(40px,3.611vw,60px)]",
                "text-center font-sans leading-none font-semibold uppercase",
                "text-[clamp(11px,0.833vw,13px)] tracking-[0.3em]",
                "transition-colors duration-300 ease-out motion-reduce:transition-none",
                focusRing("light"),
                "text-ink-muted hover:text-accent focus-visible:text-accent",
                "data-[state=active]:text-accent",
              )}
            >
              {toMtavruliIfGeorgian(tab.title)}
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute right-0 bottom-0 left-0 h-[3px] origin-left bg-black",
                  "scale-x-0 transition-transform duration-[1420ms] ease-out motion-reduce:transition-none",
                  "group-hover:scale-x-100 group-focus-visible:scale-x-100 group-data-[state=active]:scale-x-100",
                )}
              />
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </div>
    </Tabs.Root>
  );
}

type HistoryTabPanelProps = {
  tab: HistoryItem;
  isActive: boolean;
};

function HistoryTabPanel({ tab, isActive }: HistoryTabPanelProps) {
  const photoSrc = tab.imageUrl ?? PANEL_PHOTOS[tab.id];
  const ready = useIntroReady();

  // Play the entrance only when this section is the active one AND the page-load
  // brand-intro has cleared. Toggling pending → enter (which adds the
  // animation-name) is what starts/restarts the fly-in-from-left slide, so it
  // replays cleanly every time a section becomes active — on first load and on
  // every switch — without stale state. Before then we hold the offset/hidden
  // state to prevent a flash of unanimated content.
  const on = ready && isActive;
  const enter = (order: 1 | 2 | 3) =>
    on ? `intro-flyin intro-flyin--${order}` : "intro-flyin--pending";

  return (
    <Tabs.Content
      value={tab.id}
      forceMount
      tabIndex={-1}
      className="outline-none data-[state=inactive]:hidden lg:min-h-0 lg:flex-1"
    >
      {/* Same symbol/title/text typography as /vineyards/[region]; photo differs.
          Figma @1440×900: symbol 87×96 @ (53,225), title 48px @ (50,359), body
          serif-300 16px filling its column. Photo 742×495 @ (666,190) => cols
          split at 666px (46.25%) and the photo has a 32px right margin (it does
          not reach the edge). Section fills the header↔tab-bar band so the photo
          centers vertically with equal gaps. */}
      <section className="grid w-full items-center bg-white lg:min-h-[calc(100svh-clamp(208px,16.667vw,268px))] lg:grid-cols-[46.25%_53.75%] lg:items-start lg:py-0">
        <div className="px-6 pt-6 pb-12 md:px-12 md:pt-8 md:pb-16 lg:pt-[clamp(92px,7.292vw,116px)] lg:pr-[1.667vw] lg:pb-0 lg:pl-[3.472vw]">
          <div
            className={cn(
              "relative aspect-square w-24 overflow-hidden lg:aspect-[87/96] lg:w-[clamp(72px,6.042vw,100px)]",
              enter(1),
            )}
          >
            <Image
              src="/svgs/TheSymbol.svg"
              alt=""
              fill
              unoptimized
              className="object-contain"
            />
          </div>

          <div className="mt-9 max-w-[540px] lg:mt-[clamp(30px,2.639vw,44px)] lg:max-w-none">
            <h1
              className={cn(
                "font-serif text-[44px] leading-none font-normal md:text-[48px] lg:text-[clamp(40px,3.333vw,56px)]",
                enter(2),
              )}
            >
              {tab.title}
            </h1>
            <div
              className={cn(
                "type-body-editorial text-ink/85 mt-8 space-y-0 md:mt-9 lg:text-[clamp(14px,1.111vw,18px)] lg:leading-[1.45] lg:font-light lg:tracking-normal",
                enter(3),
              )}
            >
              {tab.body.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="relative aspect-[851/666] w-full overflow-hidden lg:mr-[2.222vw] lg:aspect-auto lg:h-[clamp(420px,34.375vw,560px)] lg:w-auto lg:self-center">
          {/* Left→right clip reveal, coordinated to start with the symbol and
              finish within the text window (~1s). Same gate as the text so it
              replays on each activation; stays fixed (no slide / no scale). */}
          <div
            className={cn(
              "absolute inset-0",
              on
                ? "horizontal-reveal-enter"
                : "horizontal-reveal-enter--pending",
            )}
            style={on ? { animationDuration: "667ms" } : undefined}
          >
            <Image
              src={photoSrc}
              alt=""
              fill
              priority={tab.id === "encounter"}
              sizes="(min-width: 1024px) 52vw, 100vw"
              className={cn("object-cover", on && "intro-zoom")}
            />
          </div>
        </div>
      </section>
    </Tabs.Content>
  );
}
