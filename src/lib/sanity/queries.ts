import 'server-only'
import { groq } from 'next-sanity'

export const globalSettingsQuery = groq`
  *[_type == "globalSettings"][0]{
    contact {
      address { en, ka },
      phone,
      email
    }
  }
`

export const historyQuery = groq`
  *[_type == "history"][0]{
    items[] | order(sortOrder asc) {
      _key,
      sortOrder,
      tabLabel { en, ka },
      heading  { en, ka },
      body[]   { en, ka },
      image    { asset, altEn, altKa }
    }
  }
`

export const vineyardsQuery = groq`
  *[_type == "vineyards"][0]{
    introHeading { en, ka },
    intro[]      { en, ka },
    desktopMapImage { asset, altEn, altKa },
    mobileMapImage  { asset, altEn, altKa }
  }
`

export const vineyardRegionsQuery = groq`
  *[_type == "vineyardRegion"] | order(sortOrder asc) {
    slug,
    sortOrder,
    title    { en, ka },
    subtitle { en, ka },
    bodyBlocks[] { en, ka },
    images[] { asset, altEn, altKa }
  }
`

export const wineCategoriesQuery = groq`
  *[_type == "wineCategory"] | order(sortOrder asc) {
    slug,
    sortOrder,
    title { en, ka }
  }
`

export const wineItemsQuery = groq`
  *[_type == "wineItem"] | order(sortOrder asc) {
    itemId,
    category->{ slug, title { en, ka } },
    sortOrder,
    name         { en, ka },
    grapeOrigin  { en, ka },
    descriptionLines[] { en, ka },
    details      { en, ka },
    heroImage    { asset, altEn, altKa },
    bottleImage  { asset, altEn, altKa }
  }
`

export const experienceItemsQuery = groq`
  *[_type == "experienceItem"] | order(sortOrder asc) {
    slug,
    sortOrder,
    title      { en, ka },
    sections[] { heading { en, ka }, body[] { en, ka } },
    bodyBlocks[] { en, ka },
    heroImage  { asset, altEn, altKa },
    image1     { asset, altEn, altKa },
    image2     { asset, altEn, altKa },
    mapImage   { asset, altEn, altKa },
    mapUrl
  }
`

export const allContentQuery = groq`
  {
    "globalSettings": *[_type == "globalSettings"][0]{
      contact { address { en, ka }, phone, email }
    },
    "history": *[_type == "history"][0]{
      items[] | order(sortOrder asc) {
        _key, sortOrder,
        tabLabel { en, ka }, heading { en, ka },
        body[]   { en, ka },
        image    { asset, altEn, altKa }
      }
    },
    "vineyards": *[_type == "vineyards"][0]{
      introHeading { en, ka },
      intro[]      { en, ka },
      desktopMapImage { asset, altEn, altKa },
      mobileMapImage  { asset, altEn, altKa }
    },
    "vineyardRegions": *[_type == "vineyardRegion"] | order(sortOrder asc) {
      slug, sortOrder,
      title { en, ka }, subtitle { en, ka },
      bodyBlocks[] { en, ka },
      images[] { asset, altEn, altKa }
    },
    "wineCategories": *[_type == "wineCategory"] | order(sortOrder asc) {
      slug, sortOrder, title { en, ka }
    },
    "wineItems": *[_type == "wineItem"] | order(sortOrder asc) {
      itemId,
      category->{ slug, title { en, ka } },
      sortOrder,
      name { en, ka }, grapeOrigin { en, ka },
      descriptionLines[] { en, ka },
      details { en, ka },
      heroImage { asset, altEn, altKa },
      bottleImage { asset, altEn, altKa }
    },
    "experienceItems": *[_type == "experienceItem"] | order(sortOrder asc) {
      slug, sortOrder,
      title { en, ka },
      sections[] { heading { en, ka }, body[] { en, ka } },
      bodyBlocks[] { en, ka },
      heroImage { asset, altEn, altKa },
      image1    { asset, altEn, altKa },
      image2    { asset, altEn, altKa },
      mapImage  { asset, altEn, altKa },
      mapUrl
    }
  }
`
