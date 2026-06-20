import { defineType, defineField, defineArrayMember } from 'sanity'
import { bilingualString, bilingualParagraphs } from './helpers'

export const vineyardRegion = defineType({
  name: 'vineyardRegion',
  title: 'Vineyard Region',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'Read-only. Controls the URL for this region page (e.g. "kakheti"). Do not change.',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Read-only. Controls the order regions appear in the region list. Do not change.',
      readOnly: true,
    }),
    bilingualString('title', 'Title', {
      required: true,
      description: 'Region name shown as the page headline and in the region list.',
    }),
    bilingualString('subtitle', 'Subtitle', {
      description: 'Short tagline shown beneath the region title.',
    }),
    bilingualParagraphs(
      'bodyBlocks',
      'Body Paragraphs',
      'Editorial text describing this wine region. Add one object per paragraph.',
    ),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description:
        'Photos for the editorial grid on this region page. First image appears top-left (desktop) or first (mobile).',
      of: [
        defineArrayMember({
          type: 'image',
          name: 'regionImage',
          title: 'Image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'altEn', title: 'Alt text (English)', type: 'string' }),
            defineField({ name: 'altKa', title: 'Alt text (Georgian)', type: 'string' }),
          ],
          preview: {
            select: { asset: 'asset', alt: 'altEn' },
            prepare: ({ alt }) => ({ title: alt ?? '(no alt text)' }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title.en', subtitle: 'slug.current' },
    prepare: ({ title, subtitle }) => ({ title: title ?? '(untitled)', subtitle }),
  },
})
