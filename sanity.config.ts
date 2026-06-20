'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'
import { structure } from './structure'
import { isSingletonType } from './singletonTypes'

const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'mgaloblishvili',
  title: 'Mgaloblishvili CMS',
  basePath: '/studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',

  plugins: [structureTool({ structure })],

  schema: {
    types: schemaTypes,
  },

  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type !== 'global') return prev
      return prev.filter((item) => {
        const candidate = item as { schemaType?: string; templateId: string }
        const schemaType = candidate.schemaType ?? candidate.templateId
        return !isSingletonType(schemaType)
      })
    },
    actions: (prev, { schemaType }) =>
      isSingletonType(schemaType)
        ? prev.filter(({ action }) => !!action && SINGLETON_ACTIONS.has(action))
        : prev,
  },
})
