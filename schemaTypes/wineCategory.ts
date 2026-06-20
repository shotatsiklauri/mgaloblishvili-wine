import { defineType, defineField } from 'sanity'
import { bilingualString } from './helpers'

export const wineCategory = defineType({
  name: 'wineCategory',
  title: 'Wine Category',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'Read-only. Controls the URL for this category (e.g. "wines", "brandy", "chacha"). Do not change.',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description:
        'Read-only. Controls display order of categories (1 = Wines, 2 = Brandy, 3 = Chacha). Do not change.',
      readOnly: true,
    }),
    bilingualString('title', 'Title', {
      required: true,
      description: 'Category label shown in the wines navigation (e.g. "Wines", "Brandy", "Chacha").',
    }),
  ],
  preview: {
    select: { title: 'title.en', subtitle: 'slug.current' },
    prepare: ({ title, subtitle }) => ({ title: title ?? '(untitled)', subtitle }),
  },
})
