import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
});

export function sanityImageUrl(
  source: SanityImageSource | null | undefined,
): string {
  if (!source) return "";
  try {
    return builder.image(source).auto("format").url();
  } catch {
    return "";
  }
}

export function sanityImageUrlSized(
  source: SanityImageSource | null | undefined,
  width: number,
  height?: number,
): string {
  if (!source) return "";
  try {
    const b = builder.image(source).auto("format").width(width);
    return height ? b.height(height).url() : b.url();
  } catch {
    return "";
  }
}

/**
 * Centre-crops to the given aspect on Sanity's CDN, so the delivered asset has
 * the shape the layout expects no matter what a client uploads in Studio.
 * Used for the vineyards map, whose SVG hotspot overlay is calibrated to a
 * fixed aspect ratio.
 */
export function sanityImageUrlCropped(
  source: SanityImageSource | null | undefined,
  width: number,
  height: number,
): string {
  if (!source) return "";
  try {
    return builder
      .image(source)
      .auto("format")
      .width(width)
      .height(height)
      .fit("crop")
      .url();
  } catch {
    return "";
  }
}
