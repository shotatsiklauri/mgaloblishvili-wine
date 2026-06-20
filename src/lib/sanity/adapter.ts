import 'server-only'
import type {
  Locale,
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
} from '@/data/content/types'
import { sanityImageUrl } from './image'

type SanityBilingual = { en?: string | null; ka?: string | null } | null | undefined

type SanityParagraph = { en?: string | null; ka?: string | null }

type SanitySlug = { current: string } | null | undefined

type SanityImageRef = {
  asset?: { _ref?: string; _type?: string } | null
  altEn?: string | null
  altKa?: string | null
} | null | undefined

export type SanityGlobalSettings = {
  contact?: {
    address?: SanityBilingual
    phone?: string | null
    email?: string | null
  } | null
} | null

export type SanityHistoryItem = {
  _key?: string
  sortOrder?: number | null
  tabLabel?: SanityBilingual
  heading?: SanityBilingual
  body?: SanityParagraph[] | null
  image?: SanityImageRef
}

export type SanityHistory = {
  items?: SanityHistoryItem[] | null
} | null

export type SanityVineyards = {
  introHeading?: SanityBilingual
  intro?: SanityParagraph[] | null
  desktopMapImage?: SanityImageRef
  mobileMapImage?: SanityImageRef
} | null

export type SanityVineyardRegion = {
  slug?: SanitySlug
  sortOrder?: number | null
  title?: SanityBilingual
  subtitle?: SanityBilingual
  bodyBlocks?: SanityParagraph[] | null
  images?: SanityImageRef[] | null
}

export type SanityWineCategory = {
  slug?: SanitySlug
  sortOrder?: number | null
  title?: SanityBilingual
}

export type SanityWineItem = {
  itemId?: string | null
  category?: {
    slug?: SanitySlug
    title?: SanityBilingual
  } | null
  sortOrder?: number | null
  name?: SanityBilingual
  grapeOrigin?: SanityBilingual
  descriptionLines?: SanityParagraph[] | null
  details?: SanityBilingual
  heroImage?: SanityImageRef
  bottleImage?: SanityImageRef
}

type SanityExperienceSection = {
  heading?: SanityBilingual
  body?: SanityParagraph[] | null
}

export type SanityExperienceItem = {
  slug?: SanitySlug
  sortOrder?: number | null
  title?: SanityBilingual
  sections?: SanityExperienceSection[] | null
  bodyBlocks?: SanityParagraph[] | null
  heroImage?: SanityImageRef
  image1?: SanityImageRef
  image2?: SanityImageRef
  mapImage?: SanityImageRef
  mapUrl?: string | null
}

export type SanityAllContent = {
  globalSettings?: SanityGlobalSettings
  history?: SanityHistory
  vineyards?: SanityVineyards
  vineyardRegions?: SanityVineyardRegion[] | null
  wineCategories?: SanityWineCategory[] | null
  wineItems?: SanityWineItem[] | null
  experienceItems?: SanityExperienceItem[] | null
}

function pick(field: SanityBilingual, locale: Locale): string {
  if (!field) return ''
  return field[locale] ?? field.en ?? ''
}

function pickParagraphs(
  paragraphs: SanityParagraph[] | null | undefined,
  locale: Locale,
): readonly string[] {
  if (!paragraphs) return []
  return paragraphs
    .map((p) => (p[locale] ?? p.en ?? '').trim())
    .filter((s) => s.length > 0)
}

function slugValue(slug: SanitySlug): string {
  return slug?.current ?? ''
}

const HISTORY_IDS: HistoryItemId[] = ['encounter', 'crossroads', 'symbol']

function adaptHistory(
  raw: SanityHistory,
  locale: Locale,
): SiteContent['history'] {
  const items: HistoryItem[] = (raw?.items ?? []).map((item, i) => {
    const imageUrl = sanityImageUrl(item.image) || undefined
    return {
      id: HISTORY_IDS[i] ?? ('encounter' as HistoryItemId),
      title: pick(item.tabLabel, locale),
      body: pickParagraphs(item.body, locale),
      ...(imageUrl ? { imageUrl } : {}),
    }
  })

  return {
    title: '',
    items,
  }
}

function adaptVineyards(
  raw: SanityVineyards,
  regions: SanityVineyardRegion[],
  locale: Locale,
): SiteContent['vineyards'] {
  const adaptedRegions: VineyardRegion[] = regions.map((r) => {
    const image1Url = sanityImageUrl(r.images?.[0]) || undefined
    const image2Url = sanityImageUrl(r.images?.[1]) || undefined
    return {
      id: (slugValue(r.slug) as VineyardRegionId) || 'kakheti',
      title: pick(r.title, locale),
      subtitle: pick(r.subtitle, locale) || undefined,
      body: pickParagraphs(r.bodyBlocks, locale),
      ...(image1Url ? { image1Url } : {}),
      ...(image2Url ? { image2Url } : {}),
    }
  })

  const mapImageUrl = sanityImageUrl(raw?.desktopMapImage) || undefined
  const mapMobileImageUrl = sanityImageUrl(raw?.mobileMapImage) || undefined

  return {
    title: '',
    introHeading: pick(raw?.introHeading, locale) || undefined,
    intro: pickParagraphs(raw?.intro, locale),
    regions: adaptedRegions,
    ...(mapImageUrl ? { mapImageUrl } : {}),
    ...(mapMobileImageUrl ? { mapMobileImageUrl } : {}),
  }
}

function adaptWines(
  categories: SanityWineCategory[],
  items: SanityWineItem[],
  locale: Locale,
): SiteContent['wines'] {
  const adaptedCategories: WineCategory[] = categories.map((c) => ({
    id: (slugValue(c.slug) as WineCategoryId) || 'wines',
    label: pick(c.title, locale),
  }))

  const adaptedItems: Wine[] = items
    .filter((w) => !!w.itemId)
    .map((w) => {
      const categorySlug = slugValue(w.category?.slug) as WineCategoryId | undefined
      const heroImageUrl = sanityImageUrl(w.heroImage) || undefined
      const bottleImageUrl = sanityImageUrl(w.bottleImage) || undefined
      return {
        id: w.itemId!,
        name: pick(w.name, locale),
        description: pickParagraphs(w.descriptionLines, locale),
        grapeOrigin: pick(w.grapeOrigin, locale),
        ...(categorySlug && categorySlug !== 'wines' ? { categoryId: categorySlug } : {}),
        ...(heroImageUrl ? { heroImageUrl } : {}),
        ...(bottleImageUrl ? { bottleImageUrl } : {}),
      }
    })

  return {
    title: '',
    originLabel: '',
    intro: [],
    categories: adaptedCategories,
    items: adaptedItems,
  }
}

function mergeWineCategories(
  cmsCategories: readonly WineCategory[],
  staticCategories: readonly WineCategory[],
): readonly WineCategory[] {
  if (cmsCategories.length === 0) return staticCategories

  const cmsById = new Map(cmsCategories.map((c) => [c.id, c]))
  return staticCategories.map((staticCategory) => {
    const cmsLabel = cmsById.get(staticCategory.id)?.label.trim()
    return cmsLabel ? { id: staticCategory.id, label: cmsLabel } : staticCategory
  })
}

function adaptExperienceSections(
  item: SanityExperienceItem,
  locale: Locale,
): ExperienceSection[] {
  if (item.sections && item.sections.length > 0) {
    return item.sections
      .map((section) => ({
        heading: pick(section.heading, locale),
        body: pickParagraphs(section.body, locale),
      }))
      .filter((section) => section.heading.length > 0 || section.body.length > 0)
  }

  const paragraphs = pickParagraphs(item.bodyBlocks, locale)
  if (paragraphs.length > 0) {
    return [{ heading: paragraphs[0] ?? '', body: paragraphs.slice(1) }]
  }

  return []
}

function adaptExperiences(
  items: SanityExperienceItem[],
  locale: Locale,
): SiteContent['experiences'] {
  const adaptedItems: Experience[] = items.map((item) => {
    const sections = adaptExperienceSections(item, locale)
    const hasCmsSections = sections.length > 0

    const heroImageUrl = sanityImageUrl(item.heroImage) || undefined
    const image1Url = sanityImageUrl(item.image1) || undefined
    const image2Url = sanityImageUrl(item.image2) || undefined
    const mapImageUrl = sanityImageUrl(item.mapImage) || undefined
    const mapUrl = item.mapUrl || undefined

    return {
      id: (slugValue(item.slug) as ExperienceId) || 'gastronomy',
      title: pick(item.title, locale),
      sections,
      ...(hasCmsSections ? { hasCmsSections: true as const } : {}),
      ...(heroImageUrl ? { heroImageUrl } : {}),
      ...(image1Url ? { image1Url } : {}),
      ...(image2Url ? { image2Url } : {}),
      ...(mapImageUrl ? { mapImageUrl } : {}),
      ...(mapUrl ? { mapUrl } : {}),
    }
  })

  return {
    title: '',
    items: adaptedItems,
  }
}

export function adaptCmsToContent(
  raw: SanityAllContent,
  locale: Locale,
  staticFallback: SiteContent,
): SiteContent {
  const history = adaptHistory(raw.history ?? null, locale)
  const vineyards = adaptVineyards(
    raw.vineyards ?? null,
    raw.vineyardRegions ?? [],
    locale,
  )
  const wines = adaptWines(
    raw.wineCategories ?? [],
    raw.wineItems ?? [],
    locale,
  )
  const experiences = adaptExperiences(raw.experienceItems ?? [], locale)

  return {
    locale,
    nav: staticFallback.nav,

    history: {
      ...history,
      title: history.title || staticFallback.history.title,
      items: history.items.length > 0 ? history.items : staticFallback.history.items,
    },

    vineyards: {
      ...vineyards,
      title: vineyards.title || staticFallback.vineyards.title,
      intro:
        vineyards.intro.length > 0 ? vineyards.intro : staticFallback.vineyards.intro,
      regions:
        vineyards.regions.length > 0
          ? vineyards.regions
          : staticFallback.vineyards.regions,
    },

    wines: {
      ...wines,
      title: wines.title || staticFallback.wines.title,
      originLabel: wines.originLabel || staticFallback.wines.originLabel,
      intro: wines.intro.length > 0 ? wines.intro : staticFallback.wines.intro,
      categories: mergeWineCategories(
        wines.categories,
        staticFallback.wines.categories,
      ),
      items:
        wines.items.length > 0 ? wines.items : staticFallback.wines.items,
    },

    experiences: {
      ...experiences,
      title: experiences.title || staticFallback.experiences.title,
      items:
        experiences.items.length > 0
          ? experiences.items
          : staticFallback.experiences.items,
    },
  }
}
