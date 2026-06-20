import { defineType } from 'sanity'
import { bilingualString, bilingualParagraphs, bilingualImage } from './helpers'

export const vineyards = defineType({
  name: 'vineyards',
  title: 'Vineyards',
  type: 'document',
  fields: [
    bilingualString('introHeading', 'Intro Heading', {
      description: 'Large heading displayed above the intro paragraphs on the Vineyards page.',
    }),
    bilingualParagraphs(
      'intro',
      'Intro Paragraphs',
      'Opening text on the Vineyards overview page.',
    ),
    bilingualImage(
      'desktopMapImage',
      'Map Image (Desktop / Tablet)',
      'Full-size map used on desktop and tablet views.',
    ),
    bilingualImage(
      'mobileMapImage',
      'Map Image (Mobile)',
      'Cropped or portrait map used on mobile views.',
    ),
  ],
  preview: {
    prepare: () => ({ title: 'Vineyards' }),
  },
})
