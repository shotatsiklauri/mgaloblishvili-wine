"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Image from "next/image";
import type { HistoryItem } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { BrandSymbol } from "@/components/ui/BrandSymbol";
import { Reveal } from "@/components/ui/Reveal";
import { cn, toMtavruliIfGeorgian } from "@/lib/utils";
import { focusRing } from "@/lib/focus-ring";

type HistoryTabsProps = {
  items: readonly HistoryItem[];
};

export function HistoryTabs({ items: historyItems }: HistoryTabsProps) {
  return (
    <Tabs.Root
      defaultValue="encounter"
      orientation="horizontal"
      activationMode="manual"
      className="flex flex-1 flex-col lg:min-h-0"
    >
      <div className="px-0 py-8 md:py-10 lg:flex lg:min-h-0 lg:flex-1 lg:items-center">
        <Container className="w-full">
          {historyItems.map((tab) => (
            <HistoryTabPanel key={tab.id} tab={tab} />
          ))}
        </Container>
      </div>

      <div className="bg-surface/88 border-ink/10 shrink-0 border-t">
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
  const textFirst = tab.id !== "encounter";

  return (
    <Tabs.Content
      value={tab.id}
      forceMount
      tabIndex={-1}
      className={cn(
        "outline-none",
        "data-[state=inactive]:hidden",
        "data-[state=active]:block",
        "data-[state=active]:opacity-100",
        "opacity-0 transition-opacity duration-200 motion-reduce:transition-none",
      )}
    >
      <div
        className={cn(
          "grid items-start gap-8 md:gap-16 lg:items-center",
          "grid-cols-1 lg:grid-cols-2",
        )}
      >
        <Reveal
          className={cn(textFirst ? "lg:order-2" : "lg:order-1")}
          amount={0.25}
        >
          <VisualSlot tab={tab} />
        </Reveal>

        <Reveal
          className={cn(textFirst ? "lg:order-1" : "lg:order-2")}
          delay={0.15}
          amount={0.25}
        >
          <h2 className="type-headline">
            {tab.title}
          </h2>
          <div className="type-body-editorial text-ink mt-6 space-y-4">
            {tab.body.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </Tabs.Content>
  );
}

function VisualSlot({ tab }: { tab: HistoryItem }) {
  const slotClasses =
    "relative mx-auto aspect-[4/3] w-full max-w-[440px] rounded-sm";

  if (tab.imageUrl) {
    return (
      <div
        aria-hidden="true"
        className={cn(slotClasses, "overflow-hidden bg-ink-muted/15")}
      >
        <Image
          src={tab.imageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 440px, 100vw"
          className="object-cover object-center"
        />
      </div>
    );
  }

  if (tab.id === "symbol") {
    return (
      <div
        aria-hidden="true"
        className={cn(slotClasses, "bg-surface-cream flex items-center justify-center")}
      >
        <div className="text-ink/85 w-[40%] max-w-[180px]">
          <BrandSymbol
            className="h-auto w-full"
            title="Mgaloblishvili crossroads symbol"
          />
        </div>
      </div>
    );
  }

  if (tab.id === "crossroads") {
    return (
      <div
        aria-hidden="true"
        className={cn(slotClasses, "overflow-hidden bg-ink-muted/15")}
      >
        <Image
          src="/images/Crossroads.jpg"
          alt=""
          fill
          sizes="(min-width: 1024px) 440px, 100vw"
          className="object-cover object-center"
        />
      </div>
    );
  }

  if (tab.id === "encounter") {
    return (
      <div
        aria-hidden="true"
        className={cn(slotClasses, "overflow-hidden bg-ink-muted/15")}
      >
        <Image
          src="/images/Family.jpg"
          alt=""
          fill
          sizes="(min-width: 1024px) 440px, 100vw"
          className="object-cover object-center"
        />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className={cn(slotClasses, "bg-ink-muted/15")} />
  );
}
