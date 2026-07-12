# Changes

This file summarizes the UI and routing changes made during this chat.

## Project Review

- Reviewed the project structure, styling approach, Tailwind v4 theme tokens, font setup, App Router routes, content data, and shared UI components.
- Confirmed the app uses localized content data, `next/font`, Tailwind utility styling, and small shared primitives like `NavLink`, `Container`, and `Reveal`.

## Header And Navigation

- Adjusted the content-page header layout to better match the Figma/header reference:
  - widened the header grid to the viewport,
  - adjusted desktop header height,
  - increased header logo sizing,
  - increased spacing between left/right nav groups.
- Changed the hamburger icon from two lines to three lines.
- Updated main nav word styling for stronger visual weight:
  - `font-black`,
  - wider tracking,
  - white text,
  - thicker extended white underline.
- Applied the same nav-word styling behavior to:
  - content-page header nav,
  - landing page nav,
  - burger menu overlay column titles.
- Kept diagonal slash decorations and hover/focus interactions.

## Burger Menu Overlay

- Tuned the fullscreen menu overlay positioning so the four menu columns sit closer to the intended centered/upper composition.
- Fixed the column grouping issue so each title, slash, submenu list, and divider moves as one visual group.
- Kept the logo, close button, language switcher, footer/contact text, animation classes, and menu content unchanged.
- Updated Vineyard menu links to point to real region routes:
  - `/vineyards/kakheti`
  - `/vineyards/kartli`
  - `/vineyards/imereti`
  - `/vineyards/racha-lechkhumi`
  - `/vineyards/guria-samegrelo`

## Wine Detail Page

- Reworked the dynamic wine detail page at:
  - `src/app/(content)/wines/[category]/[itemId]/page.tsx`
- Added a wide hero banner directly below the black header.
- Used `public/images/wine_page_header.png` as a cropped horizontal banner with `object-cover`.
- Added the dynamic wine name centered over the hero banner in large white serif text.
- Rebuilt the product content section below the hero:
  - text/back link/description/grape origin on the left,
  - bottle image on the right,
  - no cards or heavy UI.
- Used `public/images/wine_bottle.png` for the bottle image.
- Tuned bottle sizing several times:
  - reduced the bottle size,
  - added responsive width and max-height controls,
  - prevented it from growing too large on wide screens,
  - centered it inside its image column.
- Preserved existing route validation and `notFound()` behavior for invalid wine routes.

## Vineyards Map Page

- Added the `/vineyards` route:
  - `src/app/(content)/vineyards/page.tsx`
- Added a reusable map feature component:
  - `src/components/features/VineyardsMap.tsx`
- Used `public/images/map.jpg` as the full-area map background.
- Displayed region links over the map:
  - Kakheti
  - Kartli
  - Imereti
  - Racha-Lechkhumi
  - Guria-Samegrelo
- Positioned the region list on the upper-right/right side of the map and left-aligned the text.
- Tuned the map overlay so the image is less dark and closer to the original map/reference.
- Kept the footer/contact text as a bottom-center overlay on the map.
- Added a small overflow fix on the `/vineyards` page wrapper to remove the unwanted browser scrollbar without changing map/list/footer visual positioning.

## Vineyard Region Pages

- Added dynamic region pages at:
  - `src/app/(content)/vineyards/[region]/page.tsx`
- Region pages reuse existing vineyard data from the localized content files.
- Added placeholder/detail layout with:
  - existing black header,
  - back link to `/vineyards`,
  - region title,
  - optional subtitle,
  - existing region body paragraphs.
- Invalid region slugs return 404.

## Navigation Data

- Updated `src/data/navigation.ts` so the burger menu Vineyard entries navigate to the new region pages instead of hash anchors.
- Did not rewrite the content system or change vineyard/wine/history data.

## Validation

Commands run successfully during this work:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`

Note: production builds require network access for the current Google-hosted Georgian font setup.
