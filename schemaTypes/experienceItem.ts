import { defineType, defineField, defineArrayMember } from 'sanity'
import { bilingualString, bilingualParagraphs, bilingualImage } from './helpers'

export const experienceItem = defineType({
  name: 'experienceItem',
  title: 'Experience Item',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'Read-only. Controls the URL for this experience (e.g. "gastronomy", "winery"). Do not change.',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description:
        'Read-only. Controls display order (1 = Gastronomy, 2 = Winery). Do not change.',
      readOnly: true,
    }),
    bilingualString('title', 'Title', {
      required: true,
      description: 'Experience name shown as the page headline (e.g. "Gastronomy", "Winery").',
    }),
    defineField({
      name: 'sections',
      title: 'Text Sections',
      type: 'array',
      description:
        'The editorial text blocks shown beside the photos. Add up to two sections; each renders as one block with its own heading and paragraphs.',
      validation: (Rule) => Rule.max(2),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'experienceSection',
          title: 'Text Section',
          fields: [
            bilingualString('heading', 'Heading', {
              description: 'Headline shown above this text block.',
            }),
            bilingualParagraphs(
              'body',
              'Body Paragraphs',
              'Paragraphs shown under this heading. Add one object per paragraph.',
            ),
          ],
          preview: {
            select: { title: 'heading.en' },
            prepare: ({ title }) => ({ title: title ?? '(untitled section)' }),
          },
        }),
      ],
    }),
    bilingualImage(
      'heroImage',
      'Hero Image',
      'Full-width banner image shown at the top of this experience page.',
    ),
    bilingualImage(
      'image1',
      'Grid Image 1',
      'First editorial grid image (left column on desktop, first on mobile).',
    ),
    bilingualImage(
      'image2',
      'Grid Image 2',
      'Second editorial grid image (right column on desktop, third on mobile).',
    ),
    bilingualImage(
      'mapImage',
      'Map Image',
      'Static map photo shown below the editorial grid. Should be the location map.',
    ),
    defineField({
      name: 'mapUrl',
      title: 'Map Link URL',
      type: 'url',
      description:
        'Google Maps or other map link. Clicking the map image opens this URL in a new tab.',
    }),
  ],
  preview: {
    select: { title: 'title.en', subtitle: 'slug.current' },
    prepare: ({ title, subtitle }) => ({ title: title ?? '(untitled)', subtitle }),
  },
})
