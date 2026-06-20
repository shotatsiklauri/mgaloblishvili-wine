import 'server-only'
import type { Locale } from '@/data/content/types'
import { SITE_CONTACT } from '@/data/site'
import { safeFetch } from './client'
import { globalSettingsQuery } from './queries'

export type ResolvedContact = {
  readonly company: string
  readonly address: string
}

type SanityContactSettings = {
  contact?: {
    address?: { en?: string | null; ka?: string | null } | null
    phone?: string | null
    email?: string | null
  } | null
} | null

export async function getResolvedContact(locale: Locale): Promise<ResolvedContact> {
  try {
    const raw = await safeFetch<SanityContactSettings>(globalSettingsQuery)
    const address = raw?.contact?.address
    const resolvedAddress = (address?.[locale] ?? address?.en ?? '').trim()
    return {
      company: SITE_CONTACT.company,
      address: resolvedAddress || SITE_CONTACT.address,
    }
  } catch {
    return { company: SITE_CONTACT.company, address: SITE_CONTACT.address }
  }
}
