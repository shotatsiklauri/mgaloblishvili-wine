import { defineField, defineArrayMember } from 'sanity'

const MTAVRULI = /[Ა-ᲺᲽ-Ჿ]/

const validateKa = (value: string | undefined) => {
  if (!value || typeof value !== 'string') return true
  if (MTAVRULI.test(value)) {
    return 'Georgian text must remain Mkhedruli. Do not use Mtavruli (uppercase Georgian) characters.'
  }
  return true
}

const KA_DESCRIPTION =
  'Georgian (Mkhedruli script). Do not type or paste Mtavruli/uppercase Georgian.'

export function bilingualString(
  name: string,
  title: string,
  options: { required?: boolean; description?: string } = {},
) {
  return defineField({
    name,
    title,
    type: 'object',
    description: options.description,
    fields: [
      defineField({
        name: 'en',
        title: 'English',
        type: 'string',
        validation: options.required ? (Rule) => Rule.required() : undefined,
      }),
      defineField({
        name: 'ka',
        title: 'Georgian (Mkhedruli)',
        type: 'string',
        description: KA_DESCRIPTION,
        validation: (Rule) => Rule.custom(validateKa),
      }),
    ],
  })
}

export function bilingualText(
  name: string,
  title: string,
  options: { required?: boolean; rows?: number; description?: string } = {},
) {
  return defineField({
    name,
    title,
    type: 'object',
    description: options.description,
    fields: [
      defineField({
        name: 'en',
        title: 'English',
        type: 'text',
        rows: options.rows ?? 3,
        validation: options.required ? (Rule) => Rule.required() : undefined,
      }),
      defineField({
        name: 'ka',
        title: 'Georgian (Mkhedruli)',
        type: 'text',
        rows: options.rows ?? 3,
        description: KA_DESCRIPTION,
        validation: (Rule) => Rule.custom(validateKa),
      }),
    ],
  })
}

export function bilingualParagraphs(name: string, title: string, description?: string) {
  return defineField({
    name,
    title,
    type: 'array',
    description,
    of: [
      defineArrayMember({
        type: 'object',
        name: 'paragraph',
        title: 'Paragraph',
        fields: [
          defineField({ name: 'en', title: 'English', type: 'text', rows: 3 }),
          defineField({
            name: 'ka',
            title: 'Georgian (Mkhedruli)',
            type: 'text',
            rows: 3,
            description: KA_DESCRIPTION,
            validation: (Rule) => Rule.custom(validateKa),
          }),
        ],
        preview: {
          select: { title: 'en' },
          prepare: ({ title }) => ({ title: title ?? '(empty paragraph)' }),
        },
      }),
    ],
  })
}

export function bilingualImage(name: string, title: string, description?: string) {
  return defineField({
    name,
    title,
    type: 'image',
    description,
    options: { hotspot: true },
    fields: [
      defineField({ name: 'altEn', title: 'Alt text (English)', type: 'string' }),
      defineField({
        name: 'altKa',
        title: 'Alt text (Georgian)',
        type: 'string',
        description: KA_DESCRIPTION,
        validation: (Rule) => Rule.custom(validateKa),
      }),
    ],
  })
}
