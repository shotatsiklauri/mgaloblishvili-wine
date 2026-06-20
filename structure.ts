import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .id('globalSettings')
        .title('Global Settings')
        .child(
          S.document().schemaType('globalSettings').documentId('globalSettings'),
        ),
      S.listItem()
        .id('history')
        .title('History')
        .child(S.document().schemaType('history').documentId('history')),
      S.listItem()
        .id('vineyards')
        .title('Vineyards')
        .child(S.document().schemaType('vineyards').documentId('vineyards')),

      S.divider(),

      S.documentTypeListItem('vineyardRegion').title('Vineyard Regions'),
      S.documentTypeListItem('wineCategory').title('Wine Categories'),
      S.documentTypeListItem('wineItem').title('Wine Items'),
      S.documentTypeListItem('experienceItem').title('Experiences'),
    ])
