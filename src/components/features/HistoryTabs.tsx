"use client";

import { useState, type AnimationEvent, type CSSProperties } from "react";
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

type Direction = "fwd" | "back";

export function HistoryTabs({ items: historyItems }: HistoryTabsProps) {
  // Controlled so each panel knows when it becomes active (and replays its
  // entrance). `exiting` is the section currently animating out, plus the swap
  // direction — forward (to a later tab) slides out-left/in-right, backward
  // slides out-right/in-left. It's cleared when the exit animation finishes.
  const [active, setActive] = useState<HistoryItemId>("encounter");
  const [exiting, setExiting] = useState<{
    id: HistoryItemId;
    dir: Direction;
  } | null>(null);

  const indexOf = (id: HistoryItemId) =>
    historyItems.findIndex((i) => i.id === id);

  const handleChange = (value: string) => {
    const next = value as HistoryItemId;
    if (next === active) return;
    const dir: Direction = indexOf(next) > indexOf(active) ? "fwd" : "back";
    setExiting({ id: active, dir });
    setActive(next);
  };

  return (
    <Tabs.Root
      value={active}
      onValueChange={handleChange}
      orientation="horizontal"
      activationMode="manual"
      className="desktop:min-h-0 flex flex-1 flex-col"
    >
      {/* Panels overlap during a swap: the incoming one is in flow (defines the
          height, no layout shift) and the outgoing one is absolutely overlaid.
          overflow-x-clip contains the horizontal slide without clipping the
          vertical/scroll on mobile. */}
      <div className="desktop:min-h-0 relative flex flex-1 flex-col overflow-x-clip">
        {historyItems.map((tab) => {
          const isActive = active === tab.id;
          const isExiting = exiting?.id === tab.id;
          const slideClass =
            isActive && exiting
              ? exiting.dir === "fwd"
                ? "history-panel-enter-fwd"
                : "history-panel-enter-back"
              : isExiting
                ? exiting.dir === "fwd"
                  ? "history-panel-exit-fwd"
                  : "history-panel-exit-back"
                : null;
          return (
            <HistoryTabPanel
              key={tab.id}
              tab={tab}
              isActive={isActive}
              isExiting={!!isExiting}
              slideClass={slideClass}
              onExitEnd={() => setExiting((e) => (e?.id === tab.id ? null : e))}
            />
          );
        })}
      </div>

      <div className="shrink-0 bg-white">
        {/* Figma tab bar: full-width white band, 120px tall (@1440), group
            centered (~982px @ 1440); words
            Inter 600 / 12px / 0.3em near the top, 3px black underline at the
            bottom that reveals on hover/active, accent text when active. */}
        <Tabs.List
          aria-label="History sections"
          className={cn(
            "grid grid-cols-1 sm:grid-cols-3",
            "desktop:mx-auto desktop:h-[max(88.4px,calc(var(--desktop-fluid-unit)*102))] desktop:w-full desktop:max-w-[max(624px,calc(var(--desktop-fluid-unit)*832.32))]",
          )}
        >
          {historyItems.map((tab) => (
            <Tabs.Trigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "group relative flex cursor-pointer items-center justify-center py-5",
                "desktop:items-start desktop:py-0 desktop:pt-[max(34px,calc(var(--desktop-fluid-unit)*44.2))]",
                "text-center font-sans leading-none font-semibold uppercase",
                "desktop:text-[max(9.35px,calc(var(--desktop-fluid-unit)*10.2))] text-[clamp(11px,0.833vw,13px)] tracking-[0.3em]",
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
                  "desktop:h-[2.55px] pointer-events-none absolute right-0 bottom-0 left-0 h-[3px] origin-left bg-black",
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
  isExiting: boolean;
  slideClass: string | null;
  onExitEnd: () => void;
};

function HistoryTabPanel({
  tab,
  isActive,
  isExiting,
  slideClass,
  onExitEnd,
}: HistoryTabPanelProps) {
  const photoSrc = tab.imageUrl ?? PANEL_PHOTOS[tab.id];
  const ready = useIntroReady();

  // The inner symbol/title/text/image entrances replay every time this section
  // becomes active — so each switched-to tab gets the same fly-in + left→right
  // reveal + zoom as Encounter on first load. While a section is exiting we keep
  // its inner content settled (isExiting) so it stays fully visible as it flies
  // away rather than snapping back to the hidden start.
  const introActive = ready && (isActive || isExiting);
  const introPending = !ready && isActive;
  const enter = (order: 1 | 2 | 3) =>
    introActive
      ? `intro-flyin intro-flyin--${order}`
      : introPending
        ? "intro-flyin--pending"
        : "";

  // Active = in flow (defines height). Exiting = overlaid (block overrides
  // Radix's `hidden` on the now-inactive panel). Otherwise hidden.
  const layout = isExiting
    ? "absolute inset-0 block"
    : isActive
      ? "desktop:min-h-0 desktop:flex-1"
      : "hidden";

  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (isExiting && event.animationName.startsWith("history-panel-out")) {
      onExitEnd();
    }
  };

  return (
    <Tabs.Content
      value={tab.id}
      forceMount
      tabIndex={-1}
      onAnimationEnd={handleAnimationEnd}
      className={cn("outline-none", layout, slideClass)}
    >
      {/* Same symbol/title/text typography as /vineyards/[region]; photo differs.
          Figma @1440×900: symbol 87×96 @ (53,225), title 48px @ (50,359), body
          serif-300 16px filling its column. Photo 742×495 @ (666,190) => cols
          split at 666px (46.25%) and the photo has a 32px right margin (it does
          not reach the edge). Section fills the header↔tab-bar band so the photo
          centers vertically with equal gaps. */}
      <section
        style={
          {
            // 105 = the scaled content-header height.
            "--history-band":
              "calc(100svh - var(--desktop-fluid-unit) * 105 - var(--history-tabs))",
            "--history-tabs":
              "max(88.4px, calc(var(--desktop-fluid-unit) * 102))",
            "--history-photo":
              "max(424px, calc(var(--desktop-fluid-unit) * 500))",
            "--history-gap":
              "calc((var(--history-band) - var(--history-photo)) / 2)",
          } as CSSProperties
        }
        className="desktop:min-h-[var(--history-band)] desktop:grid-cols-[46.25%_53.75%] desktop:items-start desktop:py-0 grid w-full items-center"
      >
        <div className="desktop:pt-[max(78.2px,calc(var(--desktop-fluid-unit)*89.25))] desktop:pr-[min(var(--history-gap),12vw)] desktop:pb-0 desktop:pl-[calc(var(--desktop-fluid-unit)*42.5)] px-6 pt-6 pb-12 md:px-12 md:pt-8 md:pb-16">
          <div
            className={cn(
              "desktop:aspect-[87/96] desktop:w-[max(61.2px,calc(var(--desktop-fluid-unit)*74))] relative aspect-square w-24 overflow-hidden",
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

          <div className="desktop:mt-[max(25.5px,calc(var(--desktop-fluid-unit)*32.3))] desktop:max-w-none mt-9 max-w-[540px]">
            <h1
              className={cn(
                "desktop:text-[max(40px,calc(var(--desktop-fluid-unit)*48))] font-serif text-[44px] leading-none font-normal md:text-[48px]",
                enter(2),
              )}
            >
              {tab.title}
            </h1>
            <div
              className={cn(
                "vineyard-region-body vineyard-region-lead type-body-editorial text-ink/85 desktop:mt-[calc(var(--desktop-fluid-unit)*27.2)] desktop:font-light desktop:tracking-normal mt-8 space-y-0 md:mt-9",
                enter(3),
              )}
            >
              {tab.body.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="desktop:mr-[calc(var(--desktop-fluid-unit)*27.2)] desktop:aspect-auto desktop:h-[var(--history-photo)] desktop:w-auto desktop:self-center relative aspect-[851/666] w-full overflow-hidden">
          {/* Left→right clip reveal, coordinated to start with the symbol and
              finish within the text window (~1s), on first load only. On a
              switch the image arrives settled and rides the whole-panel fly. */}
          <div
            className={cn(
              "absolute inset-0",
              introActive
                ? "horizontal-reveal-enter"
                : introPending
                  ? "horizontal-reveal-enter--pending"
                  : "",
            )}
            style={introActive ? { animationDuration: "800ms" } : undefined}
          >
            <Image
              src={photoSrc}
              alt=""
              fill
              priority={tab.id === "encounter"}
              sizes="(min-width: 960px) 52vw, 100vw"
              className={cn("object-cover", introActive && "intro-zoom")}
            />
          </div>
        </div>
      </section>
    </Tabs.Content>
  );
}
