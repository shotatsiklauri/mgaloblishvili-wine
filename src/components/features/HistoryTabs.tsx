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
        <Tabs.List
          aria-label="History sections"
          className={cn(
            "grid grid-cols-1 sm:grid-cols-3",
            "desktop:mx-auto desktop:h-[calc(var(--desktop-fluid-unit)*102)] desktop:w-full desktop:max-w-[calc(var(--desktop-fluid-unit)*832.32)]",
          )}
        >
          {historyItems.map((tab) => (
            <Tabs.Trigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "group relative flex cursor-pointer items-center justify-center py-5",
                "desktop:items-start desktop:py-0 desktop:pt-[calc(var(--desktop-fluid-unit)*44.2)]",
                "text-center font-sans leading-none font-semibold uppercase",
                "desktop:text-[calc(var(--desktop-fluid-unit)*10.2)] text-[clamp(11px,0.833vw,13px)] tracking-[0.3em]",
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
                  "desktop:h-[calc(var(--desktop-fluid-unit)*2.55)] pointer-events-none absolute right-0 bottom-0 left-0 h-[3px] origin-left bg-black",
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

  const introActive = ready && (isActive || isExiting);
  const introPending = !ready && isActive;
  const enter = (order: 1 | 2 | 3) =>
    introActive
      ? `intro-flyin intro-flyin--${order}`
      : introPending
        ? "intro-flyin--pending"
        : "";

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
      <section
        style={
          {
            "--history-band":
              "calc(100svh - var(--desktop-fluid-unit) * 120 - var(--history-tabs))",
            "--history-tabs":
              "calc(var(--desktop-fluid-unit) * 102)",
            "--history-photo":
              "calc(var(--desktop-fluid-unit) * 500)",
            "--history-gap":
              "calc((var(--history-band) - var(--history-photo)) / 2)",
            // The symbol tab's photo is taller (495 + a 70 top offset) than the
            // band can hold on short windows, where it used to run under the
            // tab strip and get clipped. Cap it at whatever the band leaves.
            "--history-symbol-photo":
              "min(calc(var(--desktop-fluid-unit) * 495), calc(var(--history-band) - var(--desktop-fluid-unit) * 70))",
          } as CSSProperties
        }
        className="desktop:min-h-[var(--history-band)] desktop:mx-auto desktop:max-w-[var(--frame-max)] desktop:grid-cols-[46.25%_53.75%] desktop:items-start desktop:py-0 grid w-full items-center"
      >
        <div
          className={cn(
            "desktop:pr-[min(var(--history-gap),12vw)] desktop:pb-0 desktop:pl-[calc(var(--desktop-fluid-unit)*42.5)] px-6 pt-6 pb-12 md:px-12 md:pt-8 md:pb-16",
            tab.id === "symbol"
              ? // This tab drops the small mark and runs a taller photo, so a
                // top-aligned column left the copy floating high beside it.
                // Mirror the photo's vertical box (same top offset, same
                // height) and centre the copy inside it, so title and text sit
                // on the photo's centre line.
                "desktop:mt-[calc(var(--desktop-fluid-unit)*70)] desktop:flex desktop:h-[var(--history-symbol-photo)] desktop:flex-col desktop:justify-center desktop:pt-0"
              : "desktop:pt-[calc(var(--desktop-fluid-unit)*89.25)]",
          )}
        >
          {/* The Symbol tab is itself about this mark and shows it full size in
              the photo beside the copy, so the small mark is dropped there. */}
          {tab.id !== "symbol" ? (
            <div
              className={cn(
                // Mobile/tablet is reduced by 30% from 57.12px to 39.984px.
                // Desktop remains 62.9 Figma pixels with its existing floor.
                "desktop:aspect-[87/96] desktop:w-[calc(var(--desktop-fluid-unit)*62.9)] relative aspect-square w-[39.984px] overflow-hidden",
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
          ) : null}

          <div
            className={cn(
              "desktop:max-w-none mt-9 max-w-[540px]",
              // That top margin clears the small mark. The symbol tab has no
              // mark, so on desktop it would just be dead space at the top of
              // the centred column, pushing the copy below the photo's centre.
              tab.id === "symbol"
                ? "desktop:mt-0"
                : "desktop:mt-[calc(var(--desktop-fluid-unit)*32.3)]",
            )}
          >
            <h1
              className={cn(
                "desktop:text-[calc(var(--desktop-fluid-unit)*48)] font-serif text-[44px] leading-none font-normal md:text-[48px]",
                enter(2),
              )}
            >
              {tab.title}
            </h1>
            <div
              className={cn(
                "vineyard-region-body vineyard-region-lead history-region-lead type-body-editorial text-ink/85 desktop:mt-[calc(var(--desktop-fluid-unit)*27.2)] desktop:space-y-0 desktop:font-light desktop:tracking-normal mt-8 space-y-6 md:mt-9",
                enter(3),
              )}
            >
              {tab.body.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "desktop:aspect-auto relative aspect-[851/666] w-full overflow-hidden",
            tab.id === "symbol"
              ? "desktop:mt-[calc(var(--desktop-fluid-unit)*70)] desktop:h-[var(--history-symbol-photo)] desktop:w-[calc(var(--desktop-fluid-unit)*742)] desktop:self-start"
              : "desktop:mr-[calc(var(--desktop-fluid-unit)*27.2)] desktop:h-[var(--history-photo)] desktop:w-auto desktop:self-center",
          )}
        >
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
