import { defineType, defineField, defineArrayMember } from 'sanity'
import { bilingualString, bilingualParagraphs, bilingualImage } from './helpers'

export const history = defineType({
  name: 'history',
  title: 'History',
  type: 'document',
  fields: [
    defineField({
      name: 'items',
      title: 'History Items',
      type: 'array',
      description: 'The three story tabs: Encounter, Crossroads, Symbol. Do not add or remove items.',
      validation: (Rule) => Rule.max(3),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'historyItem',
          title: 'History Item',
          fields: [
            defineField({
              name: 'sortOrder',
              title: 'Sort Order',
              type: 'number',
              description:
                'Read-only. Controls tab display order. Do not change.',
              readOnly: true,
            }),
            bilingualString('tabLabel', 'Tab Label', {
              required: true,
              description: 'Short label shown on the tab trigger (e.g. "The Encounter").',
            }),
            bilingualString('heading', 'Heading', {
              description: 'Displayed headline inside the tab panel.',
            }),
            bilingualParagraphs('body', 'Body Paragraphs', 'Main story text. Add one object per paragraph.'),
            bilingualImage('image', 'Image', 'Photo displayed alongside this story.'),
          ],
          preview: {
            select: { title: 'tabLabel.en', order: 'sortOrder' },
            prepare: ({ title, order }) => ({
              title: title ?? '(untitled)',
              subtitle: `Order: ${order ?? '—'}`,
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'History' }),
  },
})
