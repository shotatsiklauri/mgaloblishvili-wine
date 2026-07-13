"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Image from "next/image";
import type { HistoryItem, HistoryItemId } from "@/data/content";
import { IntroAwareHorizontalReveal } from "@/components/ui/IntroAwareHorizontalReveal";
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
  return (
    <Tabs.Root
      defaultValue="encounter"
      orientation="horizontal"
      activationMode="manual"
      className="flex flex-1 flex-col lg:min-h-0"
    >
      <div className="flex flex-1 flex-col lg:min-h-0">
        {historyItems.map((tab) => (
          <HistoryTabPanel key={tab.id} tab={tab} />
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
                "text-center font-sans font-semibold uppercase leading-none",
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
};

function HistoryTabPanel({ tab }: HistoryTabPanelProps) {
  const photoSrc = tab.imageUrl ?? PANEL_PHOTOS[tab.id];

  return (
    <Tabs.Content
      value={tab.id}
      forceMount
      tabIndex={-1}
      className="outline-none data-[state=inactive]:hidden lg:min-h-0 lg:flex-1"
    >
      <section className="grid w-full items-center bg-white lg:h-full lg:min-h-0 lg:grid-cols-[42%_58%] lg:py-12 lg:pr-[3.5vw]">
        <div className="px-6 pt-6 pb-12 md:px-12 md:pt-8 md:pb-16 lg:px-[3.5vw] lg:py-0">
          <div className="relative aspect-square w-24 overflow-hidden lg:w-28">
            <Image
              src="/images/TheSymbol.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 112px, 96px"
              className="scale-110 object-cover [filter:grayscale(1)_contrast(8)_brightness(1.5)]"
            />
          </div>

          <div className="mt-9 max-w-[540px] lg:mt-10 lg:max-w-[640px]">
            <h1 className="font-serif text-[44px] leading-none font-normal md:text-[48px] lg:text-[56px]">
              {tab.title}
            </h1>
            <div className="type-body-editorial text-ink/85 mt-8 space-y-0 md:mt-9 lg:text-[16px]">
              {tab.body.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="relative aspect-[851/666] w-full overflow-hidden lg:aspect-auto lg:h-full lg:max-h-[666px]">
          <IntroAwareHorizontalReveal className="absolute inset-0">
            <Image
              src={photoSrc}
              alt=""
              fill
              priority={tab.id === "encounter"}
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
          </IntroAwareHorizontalReveal>
        </div>
      </section>
    </Tabs.Content>
  );
}
