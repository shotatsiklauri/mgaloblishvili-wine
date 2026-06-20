import type { SiteContent, WineCategoryId } from "@/data/content";
import { routes } from "@/data/routes";

export type NavRouteId = "history" | "vineyards" | "wines" | "experiences";

export type PrimaryNavItem = {
  readonly id: NavRouteId;
  readonly label: string;
  readonly href: string;
};

export type MenuColumnEntry = {
  readonly label: string;
  readonly href: string;
};

export type MenuColumn = {
  readonly id: NavRouteId;
  readonly title: string;
  readonly href: string;
  readonly entries: readonly MenuColumnEntry[];
};

export type WineCategoryNavItem = {
  readonly id: WineCategoryId;
  readonly label: string;
  readonly href: string;
};

export function buildPrimaryNav(
  content: SiteContent,
): readonly PrimaryNavItem[] {
  return [
    { id: "history", label: content.nav.history, href: routes.history },
    { id: "vineyards", label: content.nav.vineyards, href: routes.vineyards },
    { id: "wines", label: content.nav.wines, href: routes.wines },
    {
      id: "experiences",
      label: content.nav.experiences,
      href: routes.experiences,
    },
  ];
}

export function buildMenuColumns(content: SiteContent): readonly MenuColumn[] {
  return [
    {
      id: "history",
      title: content.nav.history,
      href: routes.history,
      entries: content.history.items.map((item) => ({
        label: item.title,
        href: `${routes.history}#${item.id}`,
      })),
    },
    {
      id: "vineyards",
      title: content.nav.vineyards,
      href: routes.vineyards,
      entries: content.vineyards.regions.map((r) => ({
        label: r.title,
        href: routes.vineyardRegion(r.id),
      })),
    },
    {
      id: "wines",
      title: content.nav.wines,
      href: routes.wines,
      entries: content.wines.categories.map((c) => ({
        label: c.label,
        href: routes.wineCategory(c.id),
      })),
    },
    {
      id: "experiences",
      title: content.nav.experiences,
      href: routes.experiences,
      entries: content.experiences.items.map((e) => ({
        label: e.title,
        href: routes.experience(e.id),
      })),
    },
  ];
}

export function buildWineCategories(
  content: SiteContent,
): readonly WineCategoryNavItem[] {
  return content.wines.categories.map((c) => ({
    id: c.id,
    label: c.label,
    href: routes.wineCategory(c.id),
  }));
}
