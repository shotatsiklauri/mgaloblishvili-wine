import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { createClient, type SanityClient } from "next-sanity";

import { enContent } from "../src/data/content/en";
import { kaContent } from "../src/data/content/ka";
import { SITE_CONTACT } from "../src/data/site";
import type {
  Experience,
  ExperienceId,
  HistoryItem,
  HistoryItemId,
  VineyardRegion,
  VineyardRegionId,
  Wine,
  WineCategory,
  WineCategoryId,
} from "../src/data/content/types";

function loadEnvFile(filename: string) {
  const filePath = resolve(process.cwd(), filename);
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    const quoted =
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"));
    if (quoted) value = value.slice(1, -1);
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const EXECUTE = process.argv.includes("--execute");

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-06-18";
const WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN;

function fail(message: string): never {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

if (!PROJECT_ID) {
  fail(
    "NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Add it to .env.local before running this script.",
  );
}
if (!DATASET) {
  fail(
    "NEXT_PUBLIC_SANITY_DATASET is not set. Add it to .env.local before running this script.",
  );
}
if (EXECUTE && !WRITE_TOKEN) {
  fail(
    "SANITY_API_WRITE_TOKEN is not set. A write token (Editor permission) is required for a " +
      "real seed run. Add it to .env.local — never prefix it with NEXT_PUBLIC_ and never commit it.",
  );
}

const client: SanityClient | null = EXECUTE
  ? createClient({
      projectId: PROJECT_ID,
      dataset: DATASET,
      apiVersion: API_VERSION,
      token: WRITE_TOKEN,
      useCdn: false,
    })
  : null;

const IMAGES_DIR = resolve(process.cwd(), "public/images");
const assetRefCache = new Map<
  string,
  { _type: "reference"; _ref: string } | undefined
>();

async function resolveImageAssetRef(
  filename: string,
): Promise<{ _type: "reference"; _ref: string } | undefined> {
  if (assetRefCache.has(filename)) {
    const cached = assetRefCache.get(filename);
    if (cached) console.log(`    (reusing already-uploaded ${filename})`);
    return cached;
  }

  const filePath = resolve(IMAGES_DIR, filename);
  if (!existsSync(filePath)) {
    console.warn(`    ⚠ image not found, skipping: public/images/${filename}`);
    assetRefCache.set(filename, undefined);
    return undefined;
  }

  if (!client) {
    console.log(`    [dry-run] would upload public/images/${filename}`);
    assetRefCache.set(filename, undefined);
    return undefined;
  }

  console.log(`    ⇧ uploading public/images/${filename} ...`);
  const buffer = readFileSync(filePath);
  const asset = await client.assets.upload("image", buffer, { filename });
  const ref = { _type: "reference" as const, _ref: asset._id };
  assetRefCache.set(filename, ref);
  return ref;
}

async function imageField(filename: string) {
  const asset = await resolveImageAssetRef(filename);
  if (!asset) return undefined;
  return { _type: "image" as const, asset };
}

function bilingual(en: string, ka: string) {
  return { en, ka };
}

function paragraphs(en: readonly string[], ka: readonly string[]) {
  const length = Math.max(en.length, ka.length);
  return Array.from({ length }, (_, i) => ({
    _type: "paragraph" as const,
    _key: randomUUID(),
    en: en[i] ?? "",
    ka: ka[i] ?? "",
  }));
}

function slugField(current: string) {
  return { _type: "slug" as const, current };
}

function byId<T extends { id: string }>(items: readonly T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}

type DocPlan = {
  id: string;
  type: string;
  label: string;
  build: () => Promise<Record<string, unknown>>;
};

const plans: DocPlan[] = [];

plans.push({
  id: "globalSettings",
  type: "globalSettings",
  label: "Global Settings",
  build: async () => ({
    contact: {
      address: bilingual(SITE_CONTACT.address, SITE_CONTACT.address),
    },
  }),
});

const HISTORY_IMAGES: Record<HistoryItemId, string | undefined> = {
  encounter: "Family.jpg",
  crossroads: "Crossroads.jpg",
  symbol: "TheSymbol.jpg",
};

plans.push({
  id: "history",
  type: "history",
  label: "History",
  build: async () => {
    const kaById = byId(kaContent.history.items);
    const items = await Promise.all(
      enContent.history.items.map(async (item: HistoryItem, index: number) => {
        const kaItem = kaById.get(item.id);
        const imageFile = HISTORY_IMAGES[item.id];
        const image = imageFile ? await imageField(imageFile) : undefined;
        return {
          _key: randomUUID(),
          sortOrder: index + 1,
          tabLabel: bilingual(item.title, kaItem?.title ?? item.title),
          heading: bilingual(item.title, kaItem?.title ?? item.title),
          body: paragraphs(item.body, kaItem?.body ?? []),
          ...(image ? { image } : {}),
        };
      }),
    );
    return { items };
  },
});

plans.push({
  id: "vineyards",
  type: "vineyards",
  label: "Vineyards",
  build: async () => {
    const desktopMapImage = await imageField("map.jpg");
    const mobileMapImage = await imageField("map-mobile.jpg");
    return {
      introHeading: bilingual(
        enContent.vineyards.introHeading ?? "",
        kaContent.vineyards.introHeading ?? "",
      ),
      intro: paragraphs(enContent.vineyards.intro, kaContent.vineyards.intro),
      ...(desktopMapImage ? { desktopMapImage } : {}),
      ...(mobileMapImage ? { mobileMapImage } : {}),
    };
  },
});

const kaRegionsById = byId(kaContent.vineyards.regions);

enContent.vineyards.regions.forEach((region: VineyardRegion, index: number) => {
  const id: VineyardRegionId = region.id;
  plans.push({
    id: `vineyardRegion-${id}`,
    type: "vineyardRegion",
    label: `Vineyard Region — ${region.title}`,
    build: async () => {
      const kaRegion = kaRegionsById.get(id);
      const image1 = await imageField("vazi.webp");
      const image2 = await imageField("bucket.webp");
      const images = [image1, image2].filter(
        (
          img,
        ): img is {
          _type: "image";
          asset: { _type: "reference"; _ref: string };
        } => !!img,
      );
      return {
        slug: slugField(id),
        sortOrder: index + 1,
        title: bilingual(region.title, kaRegion?.title ?? region.title),
        ...(region.subtitle
          ? {
              subtitle: bilingual(
                region.subtitle,
                kaRegion?.subtitle ?? region.subtitle,
              ),
            }
          : {}),
        bodyBlocks: paragraphs(region.body, kaRegion?.body ?? []),
        images: images.map((img) => ({
          ...img,
          _type: "regionImage",
          _key: randomUUID(),
        })),
      };
    },
  });
});

const kaCategoriesById = byId(kaContent.wines.categories);

enContent.wines.categories.forEach((category: WineCategory, index: number) => {
  const id: WineCategoryId = category.id;
  plans.push({
    id: `wineCategory-${id}`,
    type: "wineCategory",
    label: `Wine Category — ${category.label}`,
    build: async () => {
      const kaCategory = kaCategoriesById.get(id);
      return {
        slug: slugField(id),
        sortOrder: index + 1,
        title: bilingual(category.label, kaCategory?.label ?? category.label),
      };
    },
  });
});

const kaWinesById = byId(kaContent.wines.items);

enContent.wines.items.forEach((wine: Wine, index: number) => {
  const categoryId: WineCategoryId = wine.categoryId ?? "wines";
  plans.push({
    id: `wineItem-${wine.id}`,
    type: "wineItem",
    label: `Wine Item — ${wine.name}`,
    build: async () => {
      const kaWine = kaWinesById.get(wine.id);
      const heroImage = await imageField("wine_page_header.webp");
      const bottleImage = await imageField("wine_bottle.png");
      return {
        itemId: wine.id,
        category: {
          _type: "reference" as const,
          _ref: `wineCategory-${categoryId}`,
        },
        sortOrder: index + 1,
        name: bilingual(wine.name, kaWine?.name ?? wine.name),
        grapeOrigin: bilingual(
          wine.grapeOrigin,
          kaWine?.grapeOrigin ?? wine.grapeOrigin,
        ),
        descriptionLines: paragraphs(
          wine.description,
          kaWine?.description ?? [],
        ),
        ...(heroImage ? { heroImage } : {}),
        ...(bottleImage ? { bottleImage } : {}),
      };
    },
  });
});

const kaExperiencesById = byId(kaContent.experiences.items);

enContent.experiences.items.forEach((experience: Experience, index: number) => {
  const id: ExperienceId = experience.id;
  plans.push({
    id: `experienceItem-${id}`,
    type: "experienceItem",
    label: `Experience — ${experience.title}`,
    build: async () => {
      const kaExperience = kaExperiencesById.get(id);
      // heroImage is no longer used by the experiences page (the left column is
      // now the single people.jpg with the frost). Kept populated for the schema
      // but repointed off the deleted gastronomy.png.
      const heroImage = await imageField("people.jpg");
      const image1 = await imageField("wine_glass.png");
      const image2 = await imageField("people.jpg");
      const mapImage = await imageField("Map-mgaloblishvili.jpg");

      const sections =
        id === "winery"
          ? []
          : experience.sections.map((section, sectionIndex) => {
              const kaSection = kaExperience?.sections?.[sectionIndex];
              return {
                _type: "experienceSection" as const,
                _key: randomUUID(),
                heading: bilingual(
                  section.heading,
                  kaSection?.heading ?? section.heading,
                ),
                body: paragraphs(section.body, kaSection?.body ?? []),
              };
            });

      return {
        slug: slugField(id),
        sortOrder: index + 1,
        title: bilingual(
          experience.title,
          kaExperience?.title ?? experience.title,
        ),
        sections,
        ...(heroImage ? { heroImage } : {}),
        ...(image1 ? { image1 } : {}),
        ...(image2 ? { image2 } : {}),
        ...(mapImage ? { mapImage } : {}),
      };
    },
  });
});

async function main() {
  console.log("");
  console.log(
    EXECUTE ? "=== Sanity seed (EXECUTE) ===" : "=== Sanity seed (dry run) ===",
  );
  console.log(`project: ${PROJECT_ID}`);
  console.log(`dataset: ${DATASET}`);
  console.log(`documents planned: ${plans.length}`);
  console.log("");

  let created = 0;
  for (const plan of plans) {
    console.log(`→ ${plan.type} ${plan.id}  (${plan.label})`);
    const fields = await plan.build();

    if (client) {
      await client.createOrReplace({
        _id: plan.id,
        _type: plan.type,
        ...fields,
      });
      console.log(`  ✓ written`);
    } else {
      console.log(`  [dry-run] would create/update`);
    }
    created += 1;
  }

  console.log("");
  console.log(
    EXECUTE
      ? `Done. ${created} documents written to Sanity.`
      : `Dry run complete. ${created} documents would be written. Re-run with --execute (or "pnpm sanity:seed") to write for real.`,
  );
  console.log("");
}

main().catch((error) => {
  console.error("\n✖ Seed script failed:\n", error);
  process.exit(1);
});
