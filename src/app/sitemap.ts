import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";
import { getStaticContent } from "@/data/content";
import { routes } from "@/data/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const content = getStaticContent();

  const paths = new Set<string>([
    routes.home,
    routes.history,
    routes.vineyards,
    routes.wines,
    routes.experiences,
  ]);

  for (const region of content.vineyards.regions) {
    paths.add(routes.vineyardRegion(region.id));
  }
  for (const category of content.wines.categories) {
    paths.add(routes.wineCategory(category.id));
  }
  for (const wine of content.wines.items) {
    paths.add(routes.wineItem(wine.categoryId ?? "wines", wine.id));
  }
  for (const experience of content.experiences.items) {
    paths.add(routes.experience(experience.id));
  }

  const lastModified = new Date();

  return Array.from(paths).map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified,
    changeFrequency: "monthly",
    priority: path === routes.home ? 1 : 0.7,
  }));
}
