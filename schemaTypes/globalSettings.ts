import { defineType, defineField } from 'sanity'
import { bilingualString } from './helpers'

export const globalSettings = defineType({
  name: 'globalSettings',
  title: 'Global Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      description: 'Shown in the site footer and menu overlay.',
      fields: [
        bilingualString('address', 'Address', {
          description: 'Full mailing or location address.',
        }),
        defineField({
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
        }),
        defineField({
          name: 'email',
          title: 'Email Address',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Global Settings' }),
  },
})
