import { defineType, defineField } from 'sanity'
import { bilingualString, bilingualText, bilingualParagraphs, bilingualImage } from './helpers'

export const wineItem = defineType({
  name: 'wineItem',
  title: 'Wine Item',
  type: 'document',
  fields: [
    defineField({
      name: 'itemId',
      title: 'Item ID',
      type: 'string',
      description:
        'Read-only. Controls the URL for this wine (e.g. "saperavi", "tvishi"). Do not change.',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      description: 'Which category this wine belongs to (Wines, Brandy, or Chacha).',
      to: [{ type: 'wineCategory' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description:
        'Controls the order this wine appears within its category list. Lower numbers appear first.',
    }),
    bilingualString('name', 'Name', {
      required: true,
      description: 'Wine name shown in the list and on the detail page (e.g. "Saperavi", "Tvishi").',
    }),
    bilingualString('grapeOrigin', 'Grape Origin', {
      description: 'Region or village where the grapes are sourced (e.g. "Kvareli, Kakheti").',
    }),
    bilingualParagraphs(
      'descriptionLines',
      'Description Paragraphs',
      'Tasting notes and character description. Add one object per paragraph.',
    ),
    bilingualText('details', 'Additional Details', {
      description: 'Optional extra information (serving suggestions, winemaking notes, etc.).',
    }),
    bilingualImage(
      'heroImage',
      'Hero Image',
      'Banner image shown at the top of the wine detail page.',
    ),
    bilingualImage(
      'bottleImage',
      'Bottle Image',
      'Product bottle photo shown on the wine detail page.',
    ),
  ],
  preview: {
    select: { title: 'name.en', subtitle: 'itemId' },
    prepare: ({ title, subtitle }) => ({ title: title ?? '(untitled)', subtitle }),
  },
})
