export type Locale = "en" | "ka";

export type Paragraphs = readonly string[];

export type HistoryItemId = "encounter" | "crossroads" | "symbol";

export type HistoryItem = {
  readonly id: HistoryItemId;
  readonly title: string;
  readonly body: Paragraphs;
  readonly imageUrl?: string;
};

export type VineyardRegionId =
  | "kakheti"
  | "kartli"
  | "imereti"
  | "racha-lechkhumi"
  | "guria-samegrelo";

export type VineyardRegion = {
  readonly id: VineyardRegionId;
  readonly title: string;
  readonly subtitle?: string;
  readonly body: Paragraphs;
  readonly image1Url?: string;
  readonly image2Url?: string;
};

export type Wine = {
  readonly id: string;
  readonly name: string;
  readonly description: Paragraphs;
  readonly grapeOrigin: string;
  readonly categoryId?: WineCategoryId;
  readonly heroImageUrl?: string;
  readonly bottleImageUrl?: string;
};

export const WINE_CATEGORY_IDS = ["wines", "brandy", "chacha"] as const;

export type WineCategoryId = (typeof WINE_CATEGORY_IDS)[number];

export function isWineCategoryId(value: string): value is WineCategoryId {
  return (WINE_CATEGORY_IDS as readonly string[]).includes(value);
}

export type WineCategory = {
  readonly id: WineCategoryId;
  readonly label: string;
};

export type ExperienceId = "gastronomy" | "winery";

export type ExperienceSection = {
  readonly heading: string;
  readonly body: Paragraphs;
};

export type Experience = {
  readonly id: ExperienceId;
  readonly title: string;
  readonly sections: readonly ExperienceSection[];
  readonly hasCmsSections?: boolean;
  readonly heroImageUrl?: string;
  readonly image1Url?: string;
  readonly image2Url?: string;
  readonly mapImageUrl?: string;
  readonly mapUrl?: string;
};

export type SiteContent = {
  readonly locale: Locale;
  readonly nav: {
    readonly history: string;
    readonly vineyards: string;
    readonly wines: string;
    readonly experiences: string;
  };
  readonly history: {
    readonly title: string;
    readonly items: readonly HistoryItem[];
  };
  readonly vineyards: {
    readonly title: string;
    readonly introHeading?: string;
    readonly intro: Paragraphs;
    readonly regions: readonly VineyardRegion[];
    readonly mapImageUrl?: string;
    readonly mapMobileImageUrl?: string;
  };
  readonly wines: {
    readonly title: string;
    readonly originLabel: string;
    readonly intro: Paragraphs;
    readonly categories: readonly WineCategory[];
    readonly items: readonly Wine[];
  };
  readonly experiences: {
    readonly title: string;
    readonly items: readonly Experience[];
  };
};
