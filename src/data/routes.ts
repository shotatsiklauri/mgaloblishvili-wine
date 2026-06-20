import type {
  ExperienceId,
  VineyardRegionId,
  WineCategoryId,
} from "@/data/content";

export const routes = {
  home: "/",
  history: "/history",
  vineyards: "/vineyards",
  wines: "/wines",
  experiences: "/experiences",
  vineyardRegion: (regionId: VineyardRegionId) => `/vineyards/${regionId}`,
  experience: (experienceId: ExperienceId) => `/experiences/${experienceId}`,
  wineCategory: (categoryId: WineCategoryId) => `/wines/${categoryId}`,
  wineItem: (categoryId: WineCategoryId, itemId: string) =>
    `/wines/${categoryId}/${itemId}`,
} as const;
