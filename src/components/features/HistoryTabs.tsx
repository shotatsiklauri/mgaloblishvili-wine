"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Image from "next/image";
import type { HistoryItem, HistoryItemId } from "@/data/content";
import { Container } from "@/components/ui/Container";
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

      <div className="border-ink/10 shrink-0 border-t bg-white">
        <Container className="pt-4 md:pt-5">
          <Tabs.List
            aria-label="History sections"
            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {historyItems.map((tab) => {
              const isGeorgianTitle = /[ა-ჺ]/.test(tab.title);

              return (
                <Tabs.Trigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    "group relative cursor-pointer pt-3 pb-6",
                    "type-menu nav-word",
                    isGeorgianTitle && "nav-word--mtavruli",
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
                      "pointer-events-none absolute right-0 bottom-0 left-0 h-[3px] origin-left bg-ink",
                      "scale-x-0 transition-transform duration-[1420ms] ease-out motion-reduce:transition-none",
                      "group-hover:scale-x-100 group-focus-visible:scale-x-100 group-data-[state=active]:scale-x-100",
                    )}
                  />
                </Tabs.Trigger>
              );
            })}
          </Tabs.List>
        </Container>
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
