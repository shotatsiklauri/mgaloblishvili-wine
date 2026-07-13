# CMS Implementation Plan — Mgaloblishvili Wine Site

> ## Current Implementation Status (as-built)
>
> This document is the original **plan**. Several specifics shifted during implementation — the
> as-built state below is authoritative; `SANITY_SETUP.md` has the operational detail.
>
> - **Versions:** shipped on **Sanity v6** (studio) + **next-sanity v13** + **@sanity/image-url v2**,
>   not Sanity v3 as written below. `sanity.config.ts` requires `'use client'` as its first line.
> - **Revalidation:** implemented as **path-based** `revalidatePath` in `src/app/api/revalidate/route.ts`
>   (secret-protected), **not** `revalidateTag('siteContent')` + ISR `revalidate = 60`. Content pages
>   are currently dynamic (they read the locale cookie), so they already re-render per request; the
>   webhook is a best-effort refresh. (Revisiting the caching model is tracked as a separate audit item.)
> - **TypeGen:** **not run yet.** Raw Sanity response types are maintained by hand in
>   `src/lib/sanity/adapter.ts`. `pnpm sanity:typegen` exists; `src/lib/sanity/types/sanity.types.ts`
>   has not been generated.
> - **server-only:** the Sanity server modules (`client.ts`, `queries.ts`, `adapter.ts`, `contact.ts`)
>   now use `import "server-only"` as the plan intended.
> - **Studio protection:** implemented as HTTP Basic Auth in **`src/proxy.ts`** (Next.js 16 renamed
>   the `middleware.ts` convention to `proxy.ts`), gating `/studio` only.
> - **Experience text:** stored as a structured two-section array (`sections[]`), not a flat
>   `bodyBlocks[]`, to match the two-block page layout.
> - **All seven phases (1–7) are implemented.** A seed script (`scripts/seed-sanity.ts`) populates the
>   CMS from static content for initial setup.

## CMS Choice: Sanity v3

**Why Sanity:**
- Field-level bilingual fields map cleanly to the existing `en`/`ka` content shape
- TypeScript codegen (Sanity TypeGen) keeps the type contract intact
- Hosted image CDN with on-the-fly transforms replaces `public/images/`
- `next-sanity` provides ISR integration with `revalidateTag`
- Studio is customizable — structural fields can be locked or hidden from the client
- Free tier covers a small wine estate site

---

## Studio Approach: Embedded Route (`/studio`)

**Decision: embed the Sanity Studio inside the Next.js app as a route at `/studio`.**

Do not use a separate standalone Sanity Studio folder or a separate `sanity/` monorepo package.

**Why embedded is better for this project:**
- Single repo, single `pnpm dev`, single deployment — no second process or second host to manage
- Client accesses the studio at the same domain (e.g. `mgaloblishvili.com/studio`) — no separate URL to remember or configure
- `next-sanity` provides a first-class `NextStudio` component that handles this pattern
- Auth can be enforced by a simple middleware rule protecting `/studio/*` without a separate auth layer
- Simpler for a small handoff project with one content editor

**What this looks like structurally:**
```
src/app/studio/
  [[...tool]]/
    page.tsx       — renders <NextStudio config={studioConfig} />
sanity.config.ts   — Sanity studio config (at project root)
schemaTypes/       — Sanity schema definitions (at project root)
```

The studio page must be a Client Component and excluded from the content layout.

---

## 1. What Is Editable by the Client

### Text fields (both EN and KA)
- History: tab titles, headline, body paragraphs
- Vineyard regions: title, subtitle, two body blocks
- Wine items: name, grape origin, description paragraphs, tasting/detail text
- Experiences: title, two body blocks, map link URL
- Global contact: address, phone, email

### Images / photos
Only editorial photography becomes CMS-managed. See Section 5 for the full breakdown.

### Video
`Video_Mgaloblishvili.mp4` stays static — it is a brand asset. Do not expose a video field in the CMS. If the client needs to swap it in the future, treat it as a one-off deployment task.

---

## 2. What Must Remain Hardcoded (Never CMS)

| Category | Reason |
|---|---|
| Route slugs (`kakheti`, `wines`, `gastronomy`, etc.) | Changing a slug breaks navigation |
| Page layouts and structure | Layout is part of the design system |
| Header/menu behavior, scroll transitions | Animation and UX logic |
| Animations (BrandIntro, category entrance, nav underline) | Code-driven motion |
| Design tokens (colors, typography scale, spacing) | `globals.css @theme` |
| Georgian Mtavruli conversion logic | Lives in `NavWord` + `toMtavruliIfGeorgian()` — never in CMS data |
| Map overlay SVGs and hit areas | Structural SVGs in `public/svgs/` that control interaction behavior |
| Logo SVGs (`Mgaloblishvili-Logo.svg`, `Product_of_Georgia.svg`) | Brand assets, not content |
| `line-pattern.svg` (burger icon mask) | Code/CSS asset |
| `Video_Mgaloblishvili.mp4` | Brand video, static asset |

---

## 3. CMS Data Model

Each document uses field-level bilingual: every text field is `{ en: string, ka: string }`.

Documents that control routing expose a `slug` or `itemId` field that is **read-only in the studio** — the client can see it but cannot change it.

### `globalSettings` (singleton)
```
contact {
  address   { en, ka }
  phone     string
  email     string
}
```

### `home` (singleton)
No editable text currently. Reserved for future use.

### `history` (singleton)
```
items[] {
  _key
  sortOrder  number   // LOCKED — determines tab order
  tabLabel   { en, ka }
  heading    { en, ka }
  body       { en, ka }
  image      { asset, altEn, altKa }
}
```
`sortOrder` is set once during setup and locked. Tab order must not change without a frontend review.

### `vineyards` (singleton)
```
introHeading  { en, ka }
intro[]       { text { en, ka } }
```
Region detail is a separate document type (see below).

### `vineyardRegion` (one per region, 5 total)
```
slug          string  // READ ONLY — controls routing
sortOrder     number  // READ ONLY — controls region list order
title         { en, ka }
subtitle      { en, ka }
bodyBlocks[]  { text { en, ka } }   // two text blocks
images[]      { asset, altEn, altKa }
```

### `wineCategory` (3 documents: wines, brandy, chacha)
```
slug       string  // READ ONLY — controls routing
sortOrder  number  // READ ONLY — controls category display order
title      { en, ka }
```

### `wineItem`
```
itemId            string  // READ ONLY — controls routing
category          reference → wineCategory
sortOrder         number   // EDITABLE — client can reorder within a category
name              { en, ka }
grapeOrigin       { en, ka }
descriptionLines  [{ text { en, ka } }]   // multiple paragraphs
details           { en, ka }
heroImage         { asset, altEn, altKa }  // wine_page_header equivalent per item
bottleImage       { asset, altEn, altKa }  // wine_bottle equivalent per item
```

Note: `heroImage` and `bottleImage` are separate fields — do not merge them into a generic `images[]` array.

### `experiences` (singleton)
No top-level editable text; the overview page is purely navigational.

### `experienceItem` (2 documents: gastronomy, winery)
```
slug         string  // READ ONLY — controls routing
sortOrder    number  // READ ONLY — 2 items, order must not change
title        { en, ka }
bodyBlocks[] { text { en, ka } }   // two text blocks
image1       { asset, altEn, altKa }  // wine_glass.png equivalent
image2       { asset, altEn, altKa }  // people.png equivalent
heroImage    { asset, altEn, altKa }  // gastronomy.png equivalent
mapImage     { asset, altEn, altKa }  // Map-mgaloblishvili.jpg
mapUrl       string  // Google Maps link, editable
```

---

## 4. Ordering Strategy

Some sections require stable ordering. Here is the policy per section:

| Section | Field | Editable by client? |
|---|---|---|
| History tabs | `sortOrder` on each item | No — lock in studio, tab order is design-driven |
| Vineyard regions | `sortOrder` on each document | No — lock in studio, region list order is map-driven |
| Wine categories | `sortOrder` on each document | No — lock in studio, category order is design-driven |
| Wine items | `sortOrder` on each document | Yes — client can reorder wines within a category |
| Experience items | `sortOrder` on each document | No — lock in studio, only 2 items, order is fixed |

For locked `sortOrder` fields: expose them as read-only in the studio (visible but not editable) so the developer can inspect them. Do not hide them completely.

---

## 5. Localization Strategy

- **Field-level bilingual**: every text field is `{ en: string; ka: string }`.
- This mirrors the existing `SiteContent` shape — migration is mostly mechanical for text.
- Georgian body text is stored as **Mkhedruli** in the CMS. No Mtavruli in the CMS.
- **Mtavruli conversion** stays in `NavWord` / `toMtavruliIfGeorgian()`. The CMS delivers plain Mkhedruli; the component decides how to render it.
- Studio field labels: "English" / "Georgian (Mkhedruli — do not use uppercase or Mtavruli script)".
- Studio validation: warn if a KA field contains characters in the Mtavruli Unicode range (U+1C90–U+1CBA). This prevents the client from accidentally pasting Mtavruli.

---

## 6. Image & Media Strategy

### Images that can move to Sanity CDN
These are editorial photos that the client should be able to swap:

| Current file | CMS field location |
|---|---|
| `Family.jpg` | `history.items[0].image` |
| `Crossroads.jpg` | `history.items[1].image` |
| `vazi.webp` | `vineyardRegion.images[0]` |
| `bucket.webp` | `vineyardRegion.images[1]` |
| `wine_page_header.webp` | `wineItem.heroImage` (shared or per-item) |
| `wine_bottle.png` | `wineItem.bottleImage` |
| `gastronomy.jpg` | `experienceItem.heroImage` |
| `wine_glass.png` | `experienceItem.image1` |
| `people.png` | `experienceItem.image2` |
| `Map-mgaloblishvili.jpg` | `experienceItem.mapImage` |
| `map.jpg` | `vineyards.desktopMapImage` |
| `map-mobile.jpg` | `vineyards.mobileMapImage` |

### Assets that must stay static (never CMS)

| Asset | Reason |
|---|---|
| `Mgaloblishvili-Logo.svg` | Brand identity asset, not content |
| `Product_of_Georgia.svg` | Home hero brand logo, not content |
| `line-pattern.svg` | CSS mask asset for burger button |
| `Kakheti.svg`, `Imereti.svg`, `Kvemo Kartli.svg`, `Racha-Lechkhumi.svg`, `Guria-Samegrelo.svg` | Map overlay SVGs that control hover interaction regions — their shape and hit areas are tightly coupled to the `VineyardRegionsOverlay` component and must not change |
| `Video_Mgaloblishvili.mp4` | Brand video, static deployment asset |

**Important**: the map background images (`map.jpg`, `map-mobile.jpg`) can mp4e to the CMS because they are purely visual. The map overlay SVGs must stay in `public/svgs/` because they define interactive hit areas in code.

### Rendering CMS images
`next/image` continues to be used. Sanity image fields resolve to a URL via `imageUrlBuilder`. Pass the resolved URL as `src` to `<Image>`. Do not pass Sanity image objects directly to `next/image`.

---

## 7. Frontend Integration Strategy

### The async gap

The current `getContent(locale)` is synchronous. Sanity fetches are async. This means `getContent()` cannot simply become CMS-backed without impact — pages would need to `await` it, and the existing synchronous call sites would break.

### Proposed content API

Introduce three named functions to migrate gradually:

```
getStaticContent(locale)    — synchronous, reads current en.ts / ka.ts
                               Used by: all pages today, fallback during migration

getCmsContent(locale)       — async, fetches from Sanity via GROQ
                               Returns SiteContent or null if unavailable

getResolvedContent(locale)  — async, tries getCmsContent first, falls back to getStaticContent
                               Used by: pages after they are migrated to CMS
```

### Migration path for pages
- Pages currently call `getContent(locale)` (the old synchronous function).
- During migration, pages are updated **section by section** to call `await getResolvedContent(locale)`.
- A page is not migrated until its CMS content is populated and its hardcoded image references are updated.
- Until a page is migrated it continues using `getStaticContent(locale)`.

### Text vs image migration

**Text migration** (mostly adapter-driven):
- Once `getResolvedContent()` maps Sanity text fields to `SiteContent` shape, most text flows through without page changes.
- Some page/component props may need minor updates if shape differences appear.

**Image migration** (requires controlled component updates):
- Many images are currently hardcoded in page or component files (e.g. `src="/images/Family.jpg"`).
- These cannot be replaced by adapter magic — each hardcoded image reference must be located and updated to use the CMS URL.
- This must happen section by section as part of the per-section migration phase.
- Do not assume image migration is zero-touch.

### New files
```
src/lib/sanity/
  client.ts        — @sanity/client singleton (import "server-only")
  queries.ts       — GROQ queries per section
  adapter.ts       — maps Sanity response → SiteContent shape
  image.ts         — imageUrlBuilder helper

src/lib/sanity/types/
  sanity.types.ts  — Sanity TypeGen output (auto-generated, do not edit)
```

### Modified files
```
src/data/content/index.ts   — add getResolvedContent(); keep getStaticContent() intact
```

### Caching
- Use `next-sanity` with `revalidateTag('siteContent')` on publish mutations.
- Sanity webhook calls `POST /api/revalidate` (a Route Handler, secret-protected).
- ISR fallback: `revalidate = 60` seconds as a safety net.

---

## 8. Implementation Phases

### Phase 1 — Studio Setup Only
- Create Sanity project on sanity.io (free tier)
- Add env vars: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN`
- Create `src/app/studio/[[...tool]]/page.tsx` with `NextStudio`
- Create `sanity.config.ts` at project root (minimal, no schemas yet)
- Verify studio loads at `/studio` locally
- Add middleware rule to protect `/studio` from public access
- **No schemas, no client code, no page changes**

### Phase 2 — Schema Definition Only
- Define all document types and field shapes in `schemaTypes/`
- Lock `slug`, `itemId`, `_type`, and non-editable `sortOrder` fields as read-only
- Add studio field descriptions and KA Mkhedruli validation hints
- Register schemas in `sanity.config.ts`
- Verify all document types appear correctly in studio
- **No content population, no frontend changes**

### Phase 3 — CMS Client & Query Layer Only
- Install `@sanity/client` and `next-sanity`
- Write `src/lib/sanity/client.ts`, `queries.ts`, `adapter.ts`, `image.ts`
- Run Sanity TypeGen to generate `sanity.types.ts`
- Write and unit-test the adapter mapping (mock Sanity response → `SiteContent`)
- **No page changes, no fallback wiring yet**

### Phase 4 — Fallback Adapter Only
- Add `getStaticContent()`, `getCmsContent()`, `getResolvedContent()` to `src/data/content/index.ts`
- Keep existing `getContent()` untouched as an alias for `getStaticContent()`
- Run `pnpm typecheck` to verify `SiteContent` shape is preserved
- All pages still call the old `getContent()` and serve static data
- **No page migrations yet**

### Phase 5 — Migrate One Low-Risk Section (History)
- Populate History documents in Sanity studio (EN + KA text)
- Upload `Family.jpg` and `Crossroads.jpg` to Sanity
- Update History page and `HistoryTabs` to call `await getResolvedContent(locale)` and use CMS image URLs
- Verify: Georgian displays as Mkhedruli, `NavWord` still applies Mtavruli, tab order correct
- Set up and test revalidation webhook end-to-end
- **Rollback path**: revert page to `getStaticContent()` if anything breaks

### Phase 6 — Migrate Remaining Sections (Text + Images)
Migrate one section at a time. For each section:
1. Populate text in Sanity studio (EN + KA)
2. Upload images to Sanity
3. Update page and relevant components to use `getResolvedContent()` and CMS image URLs
4. Run `pnpm lint && pnpm typecheck`, test in browser
5. Move to next section only after current section passes

Order: Vineyards regions → Wines → Experiences → Global Settings

Do not batch sections. Each section is an independent migration step.

### Phase 7 — Revalidation, Hardening & Client Handoff
- Verify revalidation webhook works across all sections
- Set up Sanity project member with Editor role (cannot access schema settings)
- Audit studio for any accidentally exposed structural fields
- Write short client usage guide: how to edit text, swap images, EN vs KA, what not to touch
- Remove static image files from `public/images/` that are now fully CMS-managed (only after full smoke test)
- Keep `en.ts` / `ka.ts` as documented fallback (do not delete)

---

## Risk Notes

| Risk | Mitigation |
|---|---|
| Sanity shape diverges from `SiteContent` | TypeGen + adapter unit tests; `getStaticContent()` fallback prevents outage |
| Client accidentally pastes Mtavruli in KA fields | Studio validation warning on U+1C90–U+1CBA range |
| Client edits a slug and breaks routing | Lock slug/itemId fields read-only in studio |
| Video upload attempted | No video field in CMS schema; note it explicitly in client guide |
| Mobile/desktop map images swapped | Separate named fields (`desktopMapImage`, `mobileMapImage`) with clear labels |
| Async migration breaks a page mid-migration | `getStaticContent()` alias means unmigrated pages are unaffected |
| Map overlay SVGs broken by CMS image swap | Map background and SVG overlays are separate — SVGs stay in code |
| CMS image URL passed directly to `next/image` without resolution | `image.ts` helper enforces `imageUrlBuilder` — never pass raw Sanity refs |
