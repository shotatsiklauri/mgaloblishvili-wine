"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { VineyardRegion, VineyardRegionId } from "@/data/content";
import { routes } from "@/data/routes";
import { cn } from "@/lib/utils";
import { focusRing } from "@/lib/focus-ring";

const REGION_PATHS: Record<VineyardRegionId, string> = {
  "racha-lechkhumi":
    "M991.8 479.0 L990.4 468.9 L982.1 457.3 L956.5 446.2 L944.0 448.6 L928.5 465.0 L918.4 469.9 L869.5 463.1 L857.9 465.0 L853.1 469.4 L857.5 476.1 L880.7 485.3 L901.0 500.8 L910.1 504.1 L945.9 494.0 L978.8 494.0 L987.9 488.7 Z",
  imereti:
    "M810.1 570.3 L821.2 586.7 L870.5 616.2 L899.0 621.5 L926.5 615.2 L940.1 607.0 L957.5 585.3 L967.6 560.1 L959.9 558.2 L928.5 567.9 L903.4 568.8 L885.0 564.0 L855.0 548.1 L835.2 545.2 L817.8 552.9 Z",
  "guria-samegrelo":
    "M674.7 542.3 L668.9 552.5 L670.4 567.0 L678.1 586.8 L693.1 608.0 L708.5 622.0 L729.3 633.1 L747.7 639.4 L765.1 640.3 L740.4 615.2 L733.7 603.2 L732.2 586.3 L738.0 558.7 L735.1 545.2 L724.0 539.4 L689.7 537.0 Z",
  kartli:
    "M1119.8 728.1 L1126.1 751.3 L1133.8 757.1 L1151.7 761.0 L1190.4 762.9 L1219.4 757.6 L1236.7 745.5 L1254.6 745.0 L1225.1 734.4 L1205.8 735.8 L1190.8 724.3 L1182.2 721.4 L1126.6 721.9 Z",
  kakheti:
    "M1322.0 514.0 C1296.0 533.0 1294.0 561.0 1314.0 587.0 C1334.0 612.0 1360.0 629.0 1374.0 651.0 C1382.0 664.0 1379.0 680.0 1367.0 690.0 C1348.0 706.0 1341.0 725.0 1351.0 746.0 C1360.0 766.0 1379.0 786.0 1396.0 804.0 C1412.0 821.0 1427.0 837.0 1448.0 845.0 C1461.0 850.0 1473.0 845.0 1473.0 832.0 C1473.0 817.0 1465.0 803.0 1458.0 790.0 C1450.0 776.0 1447.0 759.0 1451.0 742.0 C1456.0 722.0 1467.0 707.0 1471.0 688.0 C1475.0 668.0 1470.0 648.0 1458.0 631.0 C1444.0 611.0 1423.0 596.0 1407.0 580.0 C1385.0 557.0 1370.0 529.0 1346.0 510.0 C1339.0 505.0 1329.0 508.0 1322.0 514.0 Z",
};

const REGION_FILL = "rgba(111, 105, 87, 0.55)";
const REGION_FILL_HIGHLIGHT = "rgba(255, 255, 255, 0.32)";

const KAKHETI_TRANSFORM =
  "translate(1385 678) scale(0.7) translate(-1385 -678)";

const REGION_OFFSETS: Partial<
  Record<VineyardRegionId, { x: number; y: number }>
> = {
  kakheti: { x: 50, y: 0 },
  kartli: { x: 0, y: 50 },
};

const REGION_SVG_OVERLAYS: Record<
  VineyardRegionId,
  {
    href: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }
> = {
  "racha-lechkhumi": {
    href: "/svgs/Racha-Lechkhumi.svg",
    x: 853.1,
    y: 446.1,
    width: 138.7,
    height: 58.1,
  },
  imereti: {
    href: "/svgs/Imereti.svg",
    x: 810.1,
    y: 545.1,
    width: 157.5,
    height: 76.5,
  },
  "guria-samegrelo": {
    href: "/svgs/Guria-Samegrelo.svg",
    x: 668.9,
    y: 537.3,
    width: 96.2,
    height: 102.8,
  },
  kartli: {
    href: "/svgs/Kvemo%20Kartli.svg",
    x: 1119.8,
    y: 721.5,
    width: 134.8,
    height: 41.3,
  },
  kakheti: {
    href: "/svgs/Kakheti.svg",
    x: 1325.9,
    y: 582.1,
    width: 120.7,
    height: 190.7,
  },
};

// Region shapes were hand-calibrated against the original 1920x1080 map. The replacement map
// has a larger 2230x1203 canvas, with the country artwork inset rather than uniformly enlarged.
// Keep the visible overlays and their interaction paths in the same remapped coordinate space.
const MAP_VIEWBOX = "0 0 2230 1203";
const SOURCE_TO_MAP_TRANSFORM = "matrix(0.85 0 0 0.8 240 180)";

type VineyardRegionsOverlayProps = {
  regions: readonly VineyardRegion[];
  activeRegionId?: VineyardRegionId;
};

export function VineyardRegionsOverlay({
  regions,
  activeRegionId,
}: VineyardRegionsOverlayProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState<VineyardRegionId | null>(null);

  const isHighlighted = (id: VineyardRegionId) =>
    hovered === id || activeRegionId === id;
  const enter = (id: VineyardRegionId) => () => setHovered(id);
  const leave = () => setHovered(null);
  const go = (id: VineyardRegionId) => router.push(routes.vineyardRegion(id));

  return (
    <>
      <svg
        aria-hidden="true"
        viewBox={MAP_VIEWBOX}
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 z-[5] hidden h-full w-full scale-[1.1] md:block"
      >
        <g transform={SOURCE_TO_MAP_TRANSFORM}>
          {regions.map((region) => {
            const overlay = REGION_SVG_OVERLAYS[region.id];
            if (!overlay) return null;

            const offset = REGION_OFFSETS[region.id] ?? { x: 0, y: 0 };
            const x = overlay.x + offset.x;
            const y = overlay.y + offset.y;
            const maskId = `vineyard-region-mask-${region.id}`;
            return (
              <g key={region.id}>
                <mask
                  id={maskId}
                  maskUnits="userSpaceOnUse"
                  x={x}
                  y={y}
                  width={overlay.width}
                  height={overlay.height}
                >
                  <image
                    href={overlay.href}
                    x={x}
                    y={y}
                    width={overlay.width}
                    height={overlay.height}
                    preserveAspectRatio="none"
                  />
                </mask>
                <rect
                  x={x}
                  y={y}
                  width={overlay.width}
                  height={overlay.height}
                  mask={`url(#${maskId})`}
                  fill={
                    isHighlighted(region.id)
                      ? REGION_FILL_HIGHLIGHT
                      : REGION_FILL
                  }
                  className="[transition:fill_180ms_ease] motion-reduce:transition-none"
                />
              </g>
            );
          })}
        </g>
      </svg>

      <svg
        viewBox={MAP_VIEWBOX}
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 z-[5] hidden h-full w-full scale-[1.1] md:block"
      >
        <g transform={SOURCE_TO_MAP_TRANSFORM}>
          {regions.map((region) => {
            const path = REGION_PATHS[region.id];
            if (!path) return null;

            const offset = REGION_OFFSETS[region.id] ?? { x: 0, y: 0 };
            const offsetTransform = `translate(${offset.x} ${offset.y})`;
            const transform =
              region.id === "kakheti"
                ? `${offsetTransform} ${KAKHETI_TRANSFORM}`
                : offsetTransform;

            return (
              <path
                key={region.id}
                d={path}
                transform={transform}
                role="link"
                aria-label={region.title}
                tabIndex={0}
                onMouseEnter={enter(region.id)}
                onMouseLeave={leave}
                onFocus={enter(region.id)}
                onBlur={leave}
                onClick={() => go(region.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    go(region.id);
                  }
                }}
                fill="transparent"
                className="pointer-events-auto cursor-pointer outline-none"
              />
            );
          })}
        </g>
      </svg>

      <nav
        aria-label="Vineyard regions"
        className={cn(
          "absolute z-10 hidden text-left md:block",
          "md:top-[15%] md:right-8 md:w-[min(64vw,240px)]",
          "lg:top-[17%] lg:right-[7vw] lg:w-[260px] xl:right-[8vw]",
        )}
      >
        <ul className="space-y-2 md:space-y-3">
          {regions.map((region) => (
            <li key={region.id}>
              <Link
                href={routes.vineyardRegion(region.id)}
                aria-current={activeRegionId === region.id ? "page" : undefined}
                onMouseEnter={enter(region.id)}
                onMouseLeave={leave}
                onFocus={enter(region.id)}
                onBlur={leave}
                className={cn(
                  "type-submenu inline-block rounded-sm text-[27px] leading-[1.5]",
                  "transition-colors duration-300 ease-out motion-reduce:transition-none",
                  isHighlighted(region.id)
                    ? "text-ink-inverse"
                    : "text-ink-inverse/35",
                  "hover:text-ink-inverse focus-visible:text-ink-inverse",
                  focusRing("dark"),
                )}
              >
                {region.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
