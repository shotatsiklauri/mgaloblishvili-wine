import 'server-only'
import { createClient, type SanityClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-06-18'

const REVALIDATE_SECONDS = 60

let cachedClient: SanityClient | null = null

function getSanityClient(): SanityClient | null {
  if (!projectId) return null
  if (!cachedClient) {
    cachedClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      perspective: 'published',
    })
  }
  return cachedClient
}

export async function safeFetch<T>(
  query: string,
  params?: Record<string, unknown>,
): Promise<T | null> {
  const client = getSanityClient()
  if (!client) return null
  try {
    const cacheOptions =
      process.env.NODE_ENV === 'production'
        ? { next: { revalidate: REVALIDATE_SECONDS } }
        : { cache: 'no-store' as const }
    return await client.fetch<T>(query, params ?? {}, cacheOptions)
  } catch (err) {
    console.error('[Sanity] Fetch failed:', err)
    return null
  }
}
