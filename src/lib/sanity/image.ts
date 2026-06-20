import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'

const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
})

export function sanityImageUrl(source: SanityImageSource | null | undefined): string {
  if (!source) return ''
  try {
    return builder.image(source).auto('format').url()
  } catch {
    return ''
  }
}

export function sanityImageUrlSized(
  source: SanityImageSource | null | undefined,
  width: number,
  height?: number,
): string {
  if (!source) return ''
  try {
    const b = builder.image(source).auto('format').width(width)
    return height ? b.height(height).url() : b.url()
  } catch {
    return ''
  }
}
