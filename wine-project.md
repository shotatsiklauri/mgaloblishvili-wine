# Mgaloblishvili Wine Project Overview

This document explains the project for another AI or developer who does not have direct access to the codebase. It describes the purpose, routes, structure, data model, styling system, and important implementation rules.

## Project Purpose

This is a luxury editorial website for Wine Mgaloblishvili. It presents:

- A cinematic home page with video background and brand identity.
- History content with tabbed sections.
- Vineyard map and vineyard region detail pages.
- Wine category pages, wine lists, and wine product detail pages.
- Experiences pages for Gastronomy and Winery.
- English and Georgian language switching.

The site is strongly visual and editorial. The UI should feel refined, spacious, slow, and premium. Avoid heavy UI, cards, borders, dashboard patterns, or generic marketing blocks.

## Technology Stack

- Next.js App Router.
- React Server Components by default.
- Client Components only where browser behavior is needed.
- TypeScript.
- Tailwind CSS v4 utilities and CSS variables.
- Radix UI Dialog for burger menu overlay.
- Radix UI Tabs for History tabs.
- Next Image for optimized images.
- Cookie-based locale switching for English and Georgian.

Package scripts:

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm typecheck
pnpm format
```

The usual verification command for small UI work is:

```bash
pnpm lint
```

## App Structure

Important folders:

```text
src/app/
  layout.tsx
  page.tsx
  globals.css
  (content)/
    layout.tsx
    history/page.tsx
    vineyards/page.tsx
    vineyards/[region]/page.tsx
    wines/page.tsx
    wines/[category]/page.tsx
    wines/[category]/[itemId]/page.tsx
    experiences/page.tsx
    experiences/[experience]/page.tsx

src/components/
  layout/
  features/
  ui/

src/data/
  content/
    en.ts
    ka.ts
    index.ts
    types.ts
  navigation.ts
  routes.ts

src/lib/
  locale.ts
  locale-actions.ts
  fonts.ts
  focus-ring.ts
  utils.ts

public/
  Video_Mgaloblishvili.mp4
  images/
  svgs/
```

## Routes And Functionality

### `/`

Home page.

Behavior:

- Fullscreen video background using `Video_Mgaloblishvili.mp4`.
- Main centered logo uses `Product_of_Georgia.svg`, not the normal wordmark.
- Header-like controls are provided by `HeaderHero`.
- Desktop home shows the four main navigation words near the bottom area.
- Mobile home hides the bottom nav words and keeps burger, logo, and language controls.

Important:

- Home page video behavior is separate from the subtle content-page background video.
- Do not replace the home hero video with the subtle content video.

### `/history`

History page.

Main component:

- `HistoryTabs`

Content:

- The Encounter
- The Crossroads
- The Symbol

Images:

- Encounter uses `Family.jpg`.
- Crossroads uses `Crossroads.jpg`.
- Symbol uses an internal brand symbol visual.

Behavior:

- Uses Radix Tabs.
- Tab underline animation duration matches main nav underline timing.
- History tab labels are treated like main decorative words: they use the same enlarged nav-word sizing and Georgian Mtavruli conversion.
- Body text remains normal text.

Mobile:

- Because the mobile header is fixed/transparent, the History page adds top padding so content does not start under the header.

### `/vineyards`

Vineyard map page.

Main component:

- `VineyardsMap`

Images:

- Desktop/tablet map uses `public/images/map.jpg`.
- Mobile map uses `public/images/map-mobile.jpg`.

Behavior:

- Header active state is Vineyards.
- Desktop shows map as the main page area, with region list positioned over the right/upper-right map area.
- Mobile uses the map as a full background under the transparent header, with region list over the map and footer/contact over the map near the bottom.
- Region links navigate to vineyard detail pages.
- Region overlay highlights use separate SVG files in `public/svgs/`.

Region links:

- `/vineyards/kakheti`
- `/vineyards/kartli`
- `/vineyards/imereti`
- `/vineyards/racha-lechkhumi`
- `/vineyards/guria-samegrelo`

Overlay behavior:

- `VineyardRegionsOverlay` handles desktop hover regions.
- Separate SVG assets are used:
  - `Kakheti.svg`
  - `Imereti.svg`
  - `Kvemo Kartli.svg`
  - `Racha-Lechkhumi.svg`
  - `Guria-Samegrelo.svg`
- Hover highlight should be white with about 32% opacity.
- Hit areas should correspond to visible regions, not broad transparent bounding boxes.

### `/vineyards/[region]`

Vineyard region detail pages.

Data:

- Region title, subtitle, and body come from `src/data/content/en.ts` and `ka.ts`.
- Invalid slugs return `notFound()`.
- `generateStaticParams()` is used.

Layout:

- Existing content header with `activeId="vineyards"`.
- Plain editorial title band, not an image hero.
- Title and subtitle are black/dark on a light background.
- 2x2 editorial grid:
  - Desktop row 1: `vazi.webp` left, first text block right.
  - Desktop row 2: second text block left, `bucket.webp` right.
  - Mobile order: image, related text, image, related text.
- Footer is black.

Important:

- These pages should still show the subtle white/gray background video on light areas.
- Avoid turning the whole page into flat gray. Use transparent white/light surfaces if a video-backed white page is needed.

### `/wines`

Wine overview/category page.

Main component:

- `WinesView`

Content:

- Wines
- Brandy
- Chacha

Behavior:

- Three category words animate in one by one on page entry.
- Animation is handled by `AnimatedCategoryList`.
- Animation should wait until after the global BrandIntro overlay, then start with little/no extra pause.

### `/wines/[category]`

Wine category list page.

Valid categories:

- `wines`
- `brandy`
- `chacha`

Behavior:

- Left side shows category words.
- Right side shows a scrollable wine list for selected category.
- Wine list has a custom fade mask and custom scrollbar indicator.
- At initial scroll position, the first visible wine item should not be faded.
- Top fade only appears after scrolling down.
- List entrance animation fades/slides from left to right when changing categories.

### `/wines/[category]/[itemId]`

Wine detail page.

Behavior:

- Invalid category or missing wine returns 404.
- Header active state is Wines.
- Hero banner uses `wine_page_header.webp`.
- Hero title is the selected wine name.
- Product detail content has text on left and bottle image on right.
- Bottle uses `wine_bottle.png`.
- Bottle should be visually centered in its right container and should not grow too large on wide screens.
- Footer is black.

### `/experiences`

Experiences overview page.

Main component:

- `ExperiencesView`

Content:

- Gastronomy
- Winery

Behavior:

- Words animate in one by one like the Wines overview page.
- No category word should be auto-focused or auto-active on page load.
- Hover/focus can use accent color.
- Footer is black.

### `/experiences/[experience]`

Experience detail pages.

Valid pages:

- `/experiences/gastronomy`
- `/experiences/winery`

Current content rule:

- Gastronomy uses Gastronomy title and Gastronomy text.
- Winery currently uses Winery title but Gastronomy text, by request.

Images:

- Hero image: `gastronomy.png`
- First grid image: `wine_glass.png`
- Second grid image: `people.png`
- Map image: `Map-mgaloblishvili.jpg`

Layout:

- Header active state is Experiences.
- Hero image with title over it.
- Editorial 2x2 grid:
  - Desktop row 1: `wine_glass.png` left, first text block right.
  - Desktop row 2: second text block left, `people.png` right.
  - Mobile order: image, related text, image, related text.
- Static map image is shown after the grid.
- Map image is clickable and opens Google Maps in a new tab.
- Footer is black after the map.

## Data Model

Content is static and lives in:

- `src/data/content/en.ts`
- `src/data/content/ka.ts`

Shared types live in:

- `src/data/content/types.ts`

Main data shape:

```text
SiteContent
  locale
  nav
    history
    vineyards
    wines
    experiences
  history
    title
    items[]
  vineyards
    title
    introHeading?
    intro[]
    regions[]
  wines
    title
    originLabel
    intro[]
    categories[]
    items[]
  experiences
    title
    items[]
```

Do not invent new content unless explicitly requested. Prefer using existing data.

Navigation builders live in:

- `src/data/navigation.ts`

Route helpers live in:

- `src/data/routes.ts`

Use route helpers instead of hardcoding paths when possible.

## Localization And Georgian Script Rules

Supported locales:

- `en`
- `ka`

Locale is stored in a cookie:

- `mga-locale`

Locale helpers:

- `getServerLocale()` reads the locale cookie server-side.
- `setLocale()` is a Server Action that updates the cookie and revalidates the layout.

Language UI:

- `LanguageSwitcher` shows ENG/GEO.
- It must remain readable on mobile over transparent headers and imagery.

Important Georgian script rule:

- Main decorative words should render Georgian in Mtavruli.
- Normal text, body copy, submenu words, and detail content should stay Mkhedruli.

Currently, Mtavruli conversion is intentionally scoped to:

- `NavWord`
- History tab labels

Do not globally convert the whole Georgian content object to Mtavruli. That was tried before and was incorrect because it made body text and submenu text Mtavruli too.

## Header Behavior

There are two header systems:

### Home Header

Home uses:

- `HeaderHero`

It is custom for the fullscreen landing page.

### Content Header

Content pages use:

- `HeaderContent`
- `HeaderScrollFrame`

Behavior:

- Desktop header is black and in normal/sticky flow.
- Mobile/tablet header is fixed, transparent at top, and overlays page content.
- When the user scrolls down, the mobile/tablet header becomes black with white controls.
- Header controls are burger menu, centered wordmark, and language switcher.
- Desktop nav labels are hidden on mobile.

Important:

- Because mobile header is fixed, some pages may need top padding if their content is not a hero/map and should not sit behind the header.
- History has such top padding.
- Map/hero pages intentionally sit behind the transparent header.

## Burger Menu Overlay

Main component:

- `MenuOverlay`

Behavior:

- Opens via Radix Dialog.
- Full-screen black overlay.
- Top row contains close X, centered logo, language switcher.
- Desktop menu shows four columns with submenu entries.
- Mobile menu shows only the four main words and each word navigates directly to its overview page.
- No mobile dropdown logic currently.
- Footer/contact sits at the bottom of the overlay.
- Overlay should scroll internally if viewport height is too small.

Menu content comes from:

- `buildMenuColumns(content)`

Main column titles:

- History
- Vineyards
- Wines
- Experiences

These title words use `NavWord`, so Georgian displays as Mtavruli.

Submenu entries stay normal text.

## Styling System

Global styling lives in:

- `src/app/globals.css`

Important CSS tokens:

```text
--color-surface-dark: #05090a
--color-surface: #f4f4f4
--color-surface-cream: #ede7e1
--color-ink: #0d0d0d
--color-ink-inverse: #ffffff
--color-ink-muted: #505354
--color-accent: #c9a96e
```

Important type utilities:

- `type-menu`
- `type-submenu`
- `type-headline`
- `type-body-editorial`
- `type-display-hero`
- `type-category-large`
- `type-meta`
- `type-language`

Main nav words:

- Render through `NavWord`.
- Use `type-menu nav-word`.
- Have decorative diagonal slash.
- Have underline animation.
- Underline duration should be `1420ms`.

Important visual rules:

- Keep UI editorial, spacious, and minimal.
- Avoid cards and heavy borders unless already established.
- Prefer serif typography for editorial content.
- Use black footers on detail/content pages where currently established.
- Do not alter desktop layout when fixing mobile unless explicitly requested.

## Background Video Rules

Home page:

- Uses the hero video directly in `src/app/page.tsx`.
- This is a prominent fullscreen background video.

Content pages:

- Use `SubtleVideoBackground` in `src/app/(content)/layout.tsx`.
- It renders one fixed decorative video layer for content pages.
- It uses `Video_Mgaloblishvili.mp4`.
- Video is grayscale, low opacity, and covered by a light overlay.
- Respect reduced motion: if reduced motion is enabled, video should not autoplay.

Important:

- Do not duplicate video elements inside every page/section.
- Light pages may use transparent white/light surfaces so the subtle video is visible.
- Be careful with `bg-surface/88`: `surface` is gray, so it can make a page look too gray.

## Assets

Main public assets:

```text
public/Video_Mgaloblishvili.mp4
public/images/Mgaloblishvili-Logo.svg
public/svgs/Product_of_Georgia.svg
public/svgs/line-pattern.svg

public/images/Family.jpg
public/images/Crossroads.jpg
public/images/map.jpg
public/images/map-mobile.jpg
public/images/vazi.webp
public/images/bucket.webp
public/images/gastronomy.png
public/images/wine_glass.png
public/images/people.png
public/images/Map-mgaloblishvili.jpg
public/images/wine_page_header.webp
public/images/wine_bottle.png

public/svgs/Kakheti.svg
public/svgs/Imereti.svg
public/svgs/Kvemo Kartli.svg
public/svgs/Racha-Lechkhumi.svg
public/svgs/Guria-Samegrelo.svg
```

Logo rules:

- Normal site/header/menu wordmark uses `Mgaloblishvili-Logo.svg`.
- Main home centered logo uses `Product_of_Georgia.svg`.

Burger icon:

- Uses `line-pattern.svg` as a CSS mask in `HamburgerButton`.

## Important Responsive Rules

Mobile content header:

- Fixed and transparent at top.
- Becomes black after scroll.
- Should reveal the actual page behind it.

Editorial grids:

- Desktop can alternate image/text and text/image.
- Mobile should stack in natural reading order:
  1. image
  2. related text
  3. image
  4. related text

Vineyards map:

- Desktop uses `map.jpg`.
- Mobile uses `map-mobile.jpg`.
- Mobile region list overlays the map, not a separate black section.

History:

- Needs top padding on mobile/tablet because header is fixed and the page does not have a top image hero.

## Animation Rules

General:

- Motion should be slow, elegant, and subtle.
- Respect reduced motion where existing patterns do.

Brand intro:

- `BrandIntro` is mounted in the root layout.
- Category word animations should not appear behind BrandIntro.

Category entrances:

- `AnimatedCategoryList` controls staggered appearance for `/wines` and `/experiences`.
- It should replay on client-side navigation.

Wines list:

- `WineScrollList` controls custom scroll behavior and fade masks.
- Top fade appears only after scroll.
- Bottom fade indicates more content below.

Navigation underline:

- Main nav and related decorative underlines should use the same slow `1420ms` motion.

## Accessibility Notes

- Interactive navigation should use real links/buttons.
- Burger menu uses Radix Dialog.
- History tabs use Radix Tabs.
- Icon-only buttons need labels.
- Decorative images should use empty alt text.
- Menu and map links need accessible labels where appropriate.
- Focus rings come from `focusRing()`.

## Common Pitfalls

Avoid these mistakes:

- Do not globally convert Georgian text to Mtavruli.
- Do not make mobile menu dropdowns unless requested; current mobile menu is four direct overview links.
- Do not replace the home logo with the normal wordmark.
- Do not make the mobile header occupy document flow if it should overlay content.
- Do not put the subtle video as a CSS background; use the real video component.
- Do not duplicate video elements per section.
- Do not change desktop layouts when making mobile fixes.
- Do not use the desktop map on mobile; mobile needs `map-mobile.jpg`.
- Do not make wine list first item faded at initial scroll position.
- Do not remove black footers from detail pages.
- Do not use broad hardcoded route strings when route helpers exist.

## Current Mental Model For Future Changes

If editing the project:

1. Identify whether the page is home or a content page.
2. Get content through `getServerLocale()` and `getContent(locale)`.
3. Use route helpers from `src/data/routes.ts`.
4. Preserve the established header behavior.
5. Preserve desktop layout unless task asks otherwise.
6. For mobile issues, add responsive classes instead of rewriting the whole layout.
7. Run `pnpm lint` after code changes.

