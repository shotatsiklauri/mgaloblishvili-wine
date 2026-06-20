import type {
  Locale,
  Experience,
  SiteContent,
  VineyardRegion,
  Wine,
  WineCategoryId,
} from "./types";
import { enContent } from "./en";
import { kaContent } from "./ka";

export const defaultLocale: Locale = "en";

export const content: Readonly<Record<Locale, SiteContent>> = {
  en: enContent,
  ka: kaContent,
};

export function getStaticContent(locale: Locale = defaultLocale): SiteContent {
  return content[locale];
}

export function getContent(locale: Locale = defaultLocale): SiteContent {
  return getStaticContent(locale);
}

export async function getCmsContent(
  locale: Locale = defaultLocale,
): Promise<SiteContent | null> {
  try {
    const [{ safeFetch }, { allContentQuery }, { adaptCmsToContent }] =
      await Promise.all([
        import("@/lib/sanity/client"),
        import("@/lib/sanity/queries"),
        import("@/lib/sanity/adapter"),
      ]);

    const raw = await safeFetch(allContentQuery);
    if (!raw) return null;

    const staticFallback = getStaticContent(locale);
    return adaptCmsToContent(
      raw as Parameters<typeof adaptCmsToContent>[0],
      locale,
      staticFallback,
    );
  } catch {
    return null;
  }
}

export async function getResolvedContent(
  locale: Locale = defaultLocale,
): Promise<SiteContent> {
  const cms = await getCmsContent(locale);
  return cms ?? getStaticContent(locale);
}

export function findWine(content: SiteContent, id: string): Wine | undefined {
  return content.wines.items.find((wine) => wine.id === id);
}

export function getWinesByCategory(
  content: SiteContent,
  categoryId: WineCategoryId,
): readonly Wine[] {
  return content.wines.items.filter(
    (wine) => (wine.categoryId ?? "wines") === categoryId,
  );
}

export function findVineyardRegion(
  content: SiteContent,
  id: string,
): VineyardRegion | undefined {
  return content.vineyards.regions.find((region) => region.id === id);
}

export function findExperience(
  content: SiteContent,
  id: string,
): Experience | undefined {
  return content.experiences.items.find((experience) => experience.id === id);
}

export { WINE_CATEGORY_IDS, isWineCategoryId } from "./types";

export type {
  Locale,
  Paragraphs,
  SiteContent,
  HistoryItem,
  HistoryItemId,
  VineyardRegion,
  VineyardRegionId,
  Wine,
  WineCategory,
  WineCategoryId,
  Experience,
  ExperienceSection,
  ExperienceId,
} from "./types";
