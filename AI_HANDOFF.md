# AI_HANDOFF.md — Mgaloblishvili Wine Estate Site

> **Who this is for.** You are a Claude instance in the chat app. You **cannot** see this
> repo or filesystem. A user will show you a **screenshot of the running site** and you must
> write a precise **change-prompt** to paste into Claude Code (which _does_ have the repo).
> Your prompts must name **real files, components, and existing tokens/classes** — everything
> in this doc is copied verbatim from source, so trust these names over your instincts.
>
> Read §6 (Visual-to-Code Map) to turn any pixel into a file. Read §9–§10 before writing a
> prompt so you don't propose something the codebase forbids.
>
> **If you DO have the repo (Claude Code / Codex / any coding agent):** this file is the
> **canonical architecture map** — read it first, then read the actual source it points to. It is
> kept in sync with the code, but source always wins if they ever disagree; when you find a drift,
> fix the doc. Before touching layout/sizing, read **§3.3 (sizing architecture)** in full — the
> site has a deliberate, non-obvious sizing system and "just use vw" or "add `zoom`/`scale`" will
> reintroduce bugs we already fixed. Also load and actively use the repo's **`.agents/skills/`**
> and **`.codex/`** (agent definitions + the `block-env-files` hook) — they encode the house rules
> for this codebase.

**Doc reconciliation (read once):** Several older docs in the repo are stale or unrelated —
do **not** cite them:

- `PROJECT_BLUEPRINT.md` — **unrelated** (it's a gRPC/AWS microservices blueprint for a
  different project). Ignore entirely.
- `README.md` — describes a "Phase 1 foundation" with empty component folders and a
  placeholder home page. **Stale**: the site is fully built.
- `guide.md` / `wine-project.md` — good route descriptions but **predate the Sanity CMS**
  ("no database, no external API") and predate SEO. Their "known issues" (`/experiences`
  404, missing error UI, hardcoded "Grape origin") are all **now fixed**.
- `TYPOGRAPHY_SYSTEM.md`, `SANITY_SETUP.md` — **current and accurate** (SANITY_SETUP's one-line
  "seed not yet run" status is behind; the dataset has been seeded).
- `changes.md`, `TASK_Mgaloblishvili.md` — historical logs; fine for background only.

---

## 1. Project snapshot

|                    |                                                                                                                                                                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **What**           | Luxury editorial marketing site for **Wine Mgaloblishvili LLC**, a Georgian wine estate (Village Martkopi, 1320, Gardabani, Georgia).                                                                                                           |
| **Feel**           | Editorial, cinematic, spacious, slow, premium. Full-bleed imagery, serif display type, restrained motion. **No** cards, heavy borders, dashboards, or generic marketing blocks.                                                                 |
| **Design source**  | Visuals follow a supplied Mgaloblishvili Illustrator artboard (1440×900). Interaction/structure modeled on Antinori's _Villa Antinori_ page.                                                                                                    |
| **Languages**      | Bilingual **English + Georgian**. Georgian body text is **Mkhedruli**; decorative nav words render as **Mtavruli** (uppercase Georgian), done in JS.                                                                                            |
| **Commerce/Auth**  | None. No cart, no login, no user DB. Content is static TypeScript **or** Sanity CMS.                                                                                                                                                            |
| **State: built**   | All routes live; bilingual switching works; **Sanity CMS is live end-to-end** with static fallback; SEO done (robots, sitemap, OG image, dynamic `<html lang>`).                                                                                |
| **State: pending** | Browser tab favicon is **still the default Next.js icon** (`src/app/favicon.ico`). `src/data/site.ts` has one existing **lint warning** (a stray dead string). **No tests, no CI.** `NEXT_PUBLIC_SITE_URL` must be set for production SEO URLs. |

**Recent work (2026-07-15) — global sizing overhaul (see §3.3):**

- Removed the `body { zoom: 0.85 }` experiment and its `calc(100svh/0.85)` compensations; built the
  proper full-viewport shell (`globals.css`, `layout.tsx`, all page wrappers back to plain `svh`).
- The initial pass capped header/footer at the 120px source size and centered the header in the
  1440px source frame; the 2026-07-16 follow-up below applies the approved 85% desktop values.
- `/vineyards/[region]`: every fluid value capped at its 1440 Figma value; body moved into a new
  **`RegionScrollText`** frame (no-scrollbar scroll) whose bottom aligns to the photo via the
  `--vr-band`/`--vr-photo` CSS vars.
- `HeroVideo.tsx`: robust muted-autoplay with `loadeddata`/`canplay` retries.
- New file: `src/components/ui/RegionScrollText.tsx`. Verified via `pnpm typecheck` + live
  measurement. **These are uncommitted at time of writing** (`git status` to confirm).

**Follow-up (2026-07-16):** page footers are white; the home and `/vineyards` landing-page footers
remain transparent over their media. Desktop UI (`lg+`) is intentionally rendered **15% smaller**
than the source Figma measurements while mobile/tablet are unchanged. The implementation uses a
desktop root `font-size: 85%` for rem-based Tailwind utilities plus explicit 0.85-scaled caps for
px/vw geometry — never CSS `zoom` or a document transform. The region detail therefore preserves
a minimum 691.05px desktop content band and a 555.05px photo (85% of 813/653); shorter viewports
scroll instead of compressing the composition.

---

## 2. Tech stack (exact versions from `package.json`)

| Concern      | Package                                                                                      | Version                                                                      |
| ------------ | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Framework    | `next`                                                                                       | **16.2.6** (App Router, Turbopack dev)                                       |
| UI runtime   | `react` / `react-dom`                                                                        | **19.2.4**                                                                   |
| Language     | `typescript`                                                                                 | `^5` (strict; `target ES2017`)                                               |
| Styling      | `tailwindcss`                                                                                | `^4` (via `@tailwindcss/postcss ^4`) — **CSS-first, no `tailwind.config.*`** |
| Motion       | `motion`                                                                                     | `^12.38.0` (imported as `motion/react`)                                      |
| CMS          | `sanity`                                                                                     | `^6.1.0`                                                                     |
| CMS (Next)   | `next-sanity`                                                                                | `^13.1.0`                                                                    |
| CMS images   | `@sanity/image-url`                                                                          | `^2.1.1`                                                                     |
| Menu overlay | `@radix-ui/react-dialog`                                                                     | `^1.1.15`                                                                    |
| History tabs | `@radix-ui/react-tabs`                                                                       | `^1.1.13`                                                                    |
| Class utils  | `clsx` `^2.1.1` + `tailwind-merge` `^3.6.0`                                                  | → `cn()`                                                                     |
| Server guard | `server-only`                                                                                | `^0.0.1`                                                                     |
| Lint/format  | `eslint ^9` + `eslint-config-next 16.2.6`, `prettier ^3.3.3` + `prettier-plugin-tailwindcss` | flat config (`eslint.config.mjs`)                                            |

- **Package manager: pnpm.** Node types `^20`.
- **Scripts:** `pnpm dev | build | start | lint | lint:fix | typecheck | format | format:check`,
  plus `pnpm sanity:typegen`, `pnpm sanity:seed:dry-run`, `pnpm sanity:seed`.
- **Rendering model:** App Router. **Server Components by default.** All `(content)` pages read
  the locale cookie → they render **dynamically**. `"use client"` is pushed to the smallest leaf.
- **Path alias:** `@/*` → `./src/*` (`tsconfig.json`).
- **Sanity Studio** is mounted **inside the Next app** at `/studio/[[...tool]]` via
  `next-sanity`'s `<NextStudio>` (`export const dynamic = 'force-static'`). No separate Studio process.

**Client Components (the complete list — everything else is a Server Component):**
`BrandIntro`, `HeaderScrollFrame`, `MenuOverlay`, `LanguageSwitcher`, `HamburgerButton`
(forwardRef button), `HistoryTabs`, `WineScrollList`, `AnimatedCategoryList`,
`IntroAwareHorizontalReveal`, `VineyardRegionsOverlay`, `HeroVideo`,
`SubtleVideoBackground`, `Reveal`, and `error.tsx`.

---

## 3. Design system (actual values)

### 3.1 Color + font tokens — `src/app/globals.css` `@theme` (pasted verbatim)

```css
@theme {
  --font-sans: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
  --font-serif:
    var(--font-serif-latin), var(--font-serif-georgian), ui-serif, Georgia,
    serif;

  --color-surface-dark: #05090a;
  --color-surface: #f4f4f4;
  --color-surface-cream: #ede7e1;
  --color-ink: #0d0d0d;
  --color-ink-inverse: #ffffff;
  --color-ink-muted: #505354;
  --color-accent: #c9a96e;

  --color-background: #f4f4f4;
  --color-foreground: #0d0d0d;
}
```

Each token becomes Tailwind utilities: `bg-surface-dark`, `text-ink`, `text-accent`,
`border-ink-inverse/5`, etc. **Never introduce ad-hoc hex — always a token.**

| Token           | Hex       | Where it shows up                                                                                                               |
| --------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `surface-dark`  | `#05090a` | Home bg, dark header (scrolled + desktop), vineyards bg, menu overlay bg, brand-intro gradient, OG image bg, error/not-found bg |
| `surface`       | `#f4f4f4` | Content-page background (`body`), `SubtleVideoBackground` base, wine/experience detail panels use `bg-surface/88`               |
| `surface-cream` | `#ede7e1` | "The Symbol" history tab visual background                                                                                      |
| `ink`           | `#0d0d0d` | Default text/underlines on light pages                                                                                          |
| `ink-inverse`   | `#ffffff` | Text/controls on dark surfaces                                                                                                  |
| `ink-muted`     | `#505354` | Light-footer text, back-links, wine-detail separators, inactive history tab                                                     |
| `accent`        | `#c9a96e` | Hover/active state, focus ring, OG rule, decorative accents                                                                     |

> Note: the vineyard **region detail** shell, `<main>`, and grid are transparent so the shared
> `SubtleVideoBackground` remains visible; only its footer is solid white. Wine detail and
> experience detail panels use `bg-surface/88`.

### 3.2 Typography

**Fonts loaded in `src/lib/fonts.ts`** (`next/font`; `.ttf` sources in `src/app/fonts/`):

| Export              | Source                                       | CSS variable            | Weights           |
| ------------------- | -------------------------------------------- | ----------------------- | ----------------- |
| `fontSans`          | `Inter-Variable.ttf` (local)                 | `--font-sans`           | `100 900`         |
| `fontSerif`         | `NotoSerif-Variable.ttf` (local)             | `--font-serif-latin`    | `100 900`         |
| `fontSerifGeorgian` | `Noto_Serif_Georgian` (**next/font/google**) | `--font-serif-georgian` | `300,400,500,700` |

Wired onto `<html>` in `src/app/layout.tsx` via `${fontSans.variable} ${fontSerif.variable}
${fontSerifGeorgian.variable}`. `<body>` is `font-sans`. The `--font-serif` stack is
Latin-Noto → Georgian-Noto → `ui-serif` so the browser picks the right glyph per character.
**Body/UI = Inter (sans); editorial headings & serif copy = Noto Serif**, always applied
through the `type-*` utilities below (not raw `font-serif`).

**Semantic type utilities (`@utility` in `globals.css`) — use these before any raw font class:**

| Utility               | Family | Weight | Size                                  | Line-height | Letter-spacing / transform     | Used for                                          |
| --------------------- | ------ | ------ | ------------------------------------- | ----------- | ------------------------------ | ------------------------------------------------- |
| `type-menu`           | sans   | 600    | 12px → 10.2px `lg`                    | 1.4         | `0.5px` → `0.425px`, uppercase | nav labels, tab labels, back-links, small actions |
| `type-submenu`        | serif  | 300    | 18px → 15.3px `lg`                    | 2.4         | —                              | menu submenu links, wine list items, region links |
| `type-headline`       | serif  | 500    | 36px → 30.6px `lg`                    | 1.2         | —                              | section/content headings                          |
| `type-body-editorial` | serif  | 400    | 14px → 11.9px `lg`                    | 1.6         | `0.02em`                       | editorial body paragraphs                         |
| `type-display-hero`   | serif  | 400    | `clamp(46px,8vw,92px)` → 85% `lg`     | 1.05        | —                              | image-overlay hero titles                         |
| `type-category-large` | serif  | 300    | `clamp(34px,5vw,56px)` → 85% `lg`     | 1.2         | —                              | Wines/Brandy/Chacha/Gastronomy/Winery selectors   |
| `type-meta`           | sans   | 400    | 11px → 9.35px `lg`                    | 1.4         | —                              | footer + metadata text                            |
| `type-language`       | sans   | 400    | `clamp(11px,0.833vw,13px)` → 85% `lg` | 1           | no tracking, uppercase         | ENG/GEO switcher                                  |

**Nav word sizing** (plain classes in `globals.css`, applied together with `type-menu`):
`.nav-word` = 13.5px (→14px `md`, →11.9px `lg`, →10.625px compact `lg`). Georgian variant
`.nav-word--mtavruli` = 12.5px (→13px `md`, →11.05px `lg`, →9.775px compact `lg`). `NavWord`
also adds `tracking-[0.3em]`.

### 3.3 Sizing / layout architecture ⭐ (read before touching any layout)

The design is drawn to a **1440-wide Figma reference** (frame height ~900–1053), but the approved
desktop rendering is now **85% of those source measurements**. The system preserves the Figma
composition, scales fluidly below 1440, and caps explicit sizes on wide monitors — **without** CSS
`zoom`, a page-level `transform: scale()`, or a document-size clamp (all three break viewport/media
behavior; do not introduce them).

**The document shell (`globals.css` + `src/app/layout.tsx`):**

- `html, body` have **no** document `max-width`/`max-height`, `zoom`, or scale transform.
  `box-sizing: border-box` is global via Tailwind Preflight.
- At `lg` only, `html { font-size: 85% }` scales Tailwind's rem-based spacing/sizing. This is a
  desktop design-token calibration, **not** CSS `zoom`; breakpoints, `svh`, percentages, fixed
  media, and explicit px/vw values do not inherit it. Explicit desktop lengths are therefore
  scaled separately in their component clamps. **Do not apply it below 1024px.**
- Height base lives in `layout.tsx`: `<html class="h-full">` + `<body class="min-h-full flex flex-col">`.
  So **short pages fill the viewport; tall pages grow and scroll naturally.**
- Full width is the default; framed content opts into a centered per-section max (for example, the
  1440 source header frame becomes `1224px = 1440 × 0.85` at `lg`), never on the whole document.

**The fluid-cap convention (this is the core rule):** for an original source rule
`clamp(min, Xvw, X×14.4)`, the `lg` implementation is
**`clamp(min×0.85, X×0.85vw, X×14.4×0.85)`**. Effect: **≥1440 the value freezes at 85% of its
Figma size**, **1024–1440 it scales fluidly at 85%**, and **<1024 keeps the existing mobile/tablet
rules unchanged**. Raw uncapped `vw` is still a bug because it grows unbounded on wide screens.

- Example (region title): Figma `48px / 3.333vw` becomes
  `lg:text-[clamp(34px,2.833vw,40.8px)]`.
- For a raw single source value, use `min(X×0.85vw, cap×0.85)` — e.g. source 50px padding becomes
  `lg:pl-[min(2.951vw,42.5px)]`.
- Do **not** shrink proportions/full-bleed geometry (`w-full`, percentage grids), viewport heights,
  accessibility hit targets that are intentionally mobile, or media backgrounds. Those define the
  canvas; scale the desktop content measurements inside it.

**Viewport-fill heights** use plain `svh`: `min-h-svh` (short-pages-fill) or `h-svh`/
`md:h-svh`/`lg:h-svh` + `overflow-hidden` for the viewport-locked pages (vineyards map, wines,
history). With 102px desktop header + 102px footer, the desktop content-band input is
`calc(100svh - clamp(176.8px,14.167vw,204px))`.

The vineyard-region detail uses that viewport band as one input but enforces the scaled design
minimum: `max(viewportBand, clamp(578px,47.989vw,691.05px))`. This makes short desktop viewports
scroll while preserving the approved composition.

- **Header & footer cap at 102px on desktop:** header `lg:h-[clamp(88.4px,7.083vw,102px)]`
  (`HeaderContent.tsx`), footer `lg:min-h-[clamp(88.4px,7.081vw,102px)]`
  (`ContentFooter.tsx`). Backgrounds remain full-width while header content centers in the
  scaled `lg:max-w-[1224px]` frame.
- **Breakpoints** = Tailwind defaults: `sm 640` · `md 768` · `lg 1024` · `xl 1280`. The
  **mobile→desktop pivot is mostly `lg`** for the header (fixed→sticky, nav words appear) and
  `md` for most editorial grids (1-col → 2-col).
- **`Container`** (`src/components/ui/Container.tsx`): source max 1200 becomes
  `lg:max-w-[1020px]`; its rem-based padding scales through the desktop root calibration.
- **`EditorialTextCell`** (`src/components/layout/EditorialTextCell.tsx`): outer
  source 476px minimum becomes `lg:min-h-[404.6px]`; source 520px inner max becomes
  `lg:max-w-[442px]`. Rem-based spacing scales automatically at `lg`.
- **Content-page skeleton** every page follows:
  ```tsx
  <div className="flex min-h-svh flex-col">
    {" "}
    {/* or md:h-svh / lg:h-svh for viewport-locked pages */}
    <HeaderContent activeId="…" />
    <main className="flex-1 …">{/* feature component */}</main>
    <ContentFooter /> {/* except experience detail — see §6 */}
  </div>
  ```
- The content **header** is a `relative mx-auto flex w-full max-w-[1440px]
lg:max-w-[1224px]` bar (not a grid).
  The centered logo is `absolute` at 50%; the four desktop nav words are `absolute`, positioned by
  **percent of the 1440 frame** (`NAV_LEFT_POS` in `HeaderContent.tsx`: History 10.694% · Vineyards
  24.861% · Wines 68.056% · Experiences 81.597%) so the source relationships survive inside the
  scaled frame. Height `h-16 md:h-24 lg:h-[clamp(88.4px,7.083vw,102px)]`.

> **Changing the overall scale:** the root percentage covers only rem-based Tailwind values.
> Explicit px/vw clamps must be changed by the same factor, and the header/footer caps plus content
> band subtraction must remain coordinated. Never substitute `zoom` or a page transform.

### 3.4 Motion

- **`Reveal`** (`src/components/ui/Reveal.tsx`, client) — the only `motion/react` component.
  `whileInView` fade-up, `duration 0.7`, `ease [0.22, 1, 0.36, 1]`, `viewport once`, props
  `delay`/`amount`/`distance` (default `distance 24`). Collapses to opacity-only under
  `prefers-reduced-motion`. **Only used in `HistoryTabs`.**
- **Everything else is CSS keyframes** in `globals.css`: `hero-fade-in`/`hero-fade-up`
  (`.hero-ui-enter--{logo,header,nav,contact}`), `menu-fade-*` + `.menu-stagger--*`,
  `menu-divider-grow-*`, `category-fade-down` (`.category-enter-list`),
  `wine-list-fade-right` (`.wine-list-enter`), `reveal-left-to-right`
  (`.horizontal-reveal-enter`), and `brand-intro-layer`/`brand-intro-fill`.
- **BrandIntro timing:** `src/components/ui/brandIntroTiming.ts` → `BRAND_INTRO_TOTAL_MS = 1600`
  (JS unmount). The `.brand-intro` CSS layer fades over `1500ms`.
- **Standard easing** across the system: `cubic-bezier(0.22, 1, 0.36, 1)`. **Nav underline** grows
  over `duration-[1420ms]`. A `@media (prefers-reduced-motion: reduce)` block neutralizes all of
  it — **keep reduced-motion working** in any motion change.

### 3.5 Helpers (use them; never re-roll)

- **`cn(...)`** (`src/lib/utils.ts`) = `twMerge(clsx(...))`. Use for all conditional classes;
  relies on `tailwind-merge` so a later class wins (e.g. a page passing `after:-bottom-4`
  overrides a primitive's `after:-bottom-3`).
- **`focusRing(tone, offset?)`** (`src/lib/focus-ring.ts`) — `tone: "dark"|"light"`,
  `offset: 2|4`. Returns exactly:
  `rounded-sm focus-visible:outline-none focus-visible:ring-accent focus-visible:ring-2
focus-visible:ring-offset-{surface-dark|surface} focus-visible:ring-offset-{2|4}`.
  Every focusable element calls this.
- **`toMtavruliIfGeorgian(text)`** (`src/lib/utils.ts`) — shifts Georgian codepoints by
  `0x1c90 - 0x10d0` to produce Mtavruli. Used only in `NavWord` and `HistoryTabs` triggers.
  **CSS `text-transform: uppercase` does NOT work for Georgian — never use it for `ka`.**

---

## 4. Routing map

RSC = React Server Component (default). All `(content)` pages are **dynamic** (locale cookie).
"Data" column: **static** = `getContent(locale)` from `src/data/content`; **CMS-first** =
`getResolvedContent(locale)` (Sanity → static fallback).

| URL                          | Route file                                     | Renders                                                                                                                                                                | Data                                                                               |
| ---------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `/`                          | `src/app/page.tsx` (RSC)                       | `<HeroVideo>` (client: muted video + scrim + explicit sound toggle), `HeaderHero`, centered `Product_of_Georgia.svg`, bottom `NavLink` row, inline `SiteFooterMinimal` | **static** (home does **not** read CMS)                                            |
| `/history`                   | `(content)/history/page.tsx`                   | `HeaderContent` + `HistoryTabs` + `ContentFooter`                                                                                                                      | CMS-first                                                                          |
| `/vineyards`                 | `(content)/vineyards/page.tsx`                 | `HeaderContent(mobileTransparentControls="light")` + `VineyardsMap`                                                                                                    | CMS-first                                                                          |
| `/vineyards/[region]`        | `(content)/vineyards/[region]/page.tsx`        | scroll-capable 41/59 text-and-photo composition + white `ContentFooter`                                                                                                | CMS-first; `generateStaticParams` from static; `findVineyardRegion` → `notFound()` |
| `/wines`                     | `(content)/wines/page.tsx`                     | `HeaderContent` + `WinesView` (index) + `ContentFooter`                                                                                                                | CMS-first                                                                          |
| `/wines/[category]`          | `(content)/wines/[category]/page.tsx`          | `WinesView` (category + `WineScrollList`)                                                                                                                              | CMS-first; `isWineCategoryId` guard → `notFound()`                                 |
| `/wines/[category]/[itemId]` | `(content)/wines/[category]/[itemId]/page.tsx` | hero + text + bottle + white `ContentFooter`                                                                                                                           | CMS-first; `findWine` → `notFound()`                                               |
| `/experiences`               | `(content)/experiences/page.tsx`               | `HeaderContent` + `ExperiencesView` + `ContentFooter`                                                                                                                  | CMS-first                                                                          |
| `/experiences/[experience]`  | `(content)/experiences/[experience]/page.tsx`  | editorial composition + clickable map + own white footer                                                                                                               | CMS-first; `generateStaticParams`; `findExperience` → `notFound()`                 |
| `/studio`, `/studio/*`       | `src/app/studio/[[...tool]]/page.tsx`          | `<NextStudio>` (`force-static`)                                                                                                                                        | Sanity Studio; gated by `src/proxy.ts` Basic Auth                                  |
| `/api/revalidate`            | `src/app/api/revalidate/route.ts`              | `POST`/`GET` webhook (secret) → `revalidatePath` all CMS paths                                                                                                         | —                                                                                  |
| `/sitemap.xml`               | `src/app/sitemap.ts`                           | all routes enumerated from static content                                                                                                                              | static                                                                             |
| `/robots.txt`                | `src/app/robots.ts`                            | allow `/`, disallow `/studio` + `/api/`                                                                                                                                | —                                                                                  |
| `/opengraph-image`           | `src/app/opengraph-image.tsx`                  | 1200×630 `next/og` brand card                                                                                                                                          | —                                                                                  |
| (root error)                 | `src/app/error.tsx` (client)                   | dark full-screen "Something went wrong" + reset                                                                                                                        | —                                                                                  |
| (root 404)                   | `src/app/not-found.tsx`                        | dark full-screen "Page not found" + home link                                                                                                                          | —                                                                                  |

Root shell: `src/app/layout.tsx` (RSC, async) sets `<html lang={locale}>`, font variables,
metadata (title template `%s · Mgaloblishvili`, OG, Twitter, `metadataBase`), and renders
`{children}` + `<BrandIntro />`. `(content)/layout.tsx` wraps content pages with
`bg-surface` and a fixed `<SubtleVideoBackground />`.

---

## 5. Component catalog

Paths are under `src/components/`. "C" = Client Component, "S" = Server Component.

### `ui/` — domain-neutral primitives

| File                             | S/C | Responsibility                                                                                                                                                                                                                                                                                                      | Key props                                                                     | Used by                                                                                                             |
| -------------------------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `Wordmark.tsx`                   | S   | The Mgaloblishvili logo lockup (wraps `BrandLogoImg`).                                                                                                                                                                                                                                                              | `size: "lg"\|"sm"\|"header"\|"home"` (default `lg`), `asHeading`, `className` | `HeaderContent`, `MenuOverlay` (`header`); `error`, `not-found` (`sm`). _`lg`/`home` defined but currently unused._ |
| `BrandLogoImg.tsx`               | S   | Renders `/images/Mgaloblishvili-Logo.svg` (`width 245 height 50`, `h-auto`).                                                                                                                                                                                                                                        | `className`                                                                   | `Wordmark` only                                                                                                     |
| `BrandSymbol.tsx`                | S   | Inline SVG "crossroads" mark (`viewBox 0 0 100 100`, `fill-current`).                                                                                                                                                                                                                                               | `size`, `title`, `className`                                                  | `HistoryTabs` (Symbol tab visual)                                                                                   |
| `NavLink.tsx`                    | S   | `next/link` wrapper around `NavWord` (adds `group`, focus ring).                                                                                                                                                                                                                                                    | `href`, `active`, `edgeUnderline`, `underlineClassName`, `className`          | content header, home nav                                                                                            |
| `NavWord.tsx`                    | S   | The decorative nav word: `type-menu nav-word tracking-[0.3em]`, Mtavruli conversion, hover→`text-accent`, growing underline (`duration-[1420ms]`), `DecorativeSlash`.                                                                                                                                               | `active`, `edgeUnderline`, `underlineClassName`, `className`                  | `NavLink`, `MenuOverlay`, `HistoryTabs` pattern                                                                     |
| `DecorativeSlash.tsx`            | S   | The diagonal ornament behind an inactive nav word (`h-[0.5px] w-[100px] rotate-[-45deg] bg-white/30`, hides on hover).                                                                                                                                                                                              | `className`                                                                   | `NavWord`                                                                                                           |
| `Container.tsx`                  | S   | Centered wrapper; source `max-w-[1200px]`, desktop `lg:max-w-[1020px]`.                                                                                                                                                                                                                                             | `className`, `children`                                                       | `HistoryTabs`                                                                                                       |
| `Reveal.tsx`                     | C   | `motion/react` scroll-reveal (fade-up).                                                                                                                                                                                                                                                                             | `delay`, `amount`, `distance`, `className`                                    | `HistoryTabs`                                                                                                       |
| `BrandIntro.tsx`                 | C   | Full-screen loading overlay on mount + soft-nav + bfcache restore; unmounts after `1600ms`. Two stacked `/images/Mgaloblishvili-Logo.svg` (base 20% + clip-path reveal).                                                                                                                                            | —                                                                             | root `layout.tsx`                                                                                                   |
| `brandIntroTiming.ts`            | —   | `export const BRAND_INTRO_TOTAL_MS = 1600`                                                                                                                                                                                                                                                                          | —                                                                             | `BrandIntro`, `AnimatedCategoryList`                                                                                |
| `IntroAwareHorizontalReveal.tsx` | C   | Holds content clipped at 0% while `.brand-intro` exists, then runs the shared left→right clip reveal; per-layer `durationMs` (unified **800ms**), `delayMs`, `revealFrom` (start clip %, e.g. `"25%"` shows ¾ immediately), and route replay.                                                                       | `children`, `className?`, `durationMs?`, `delayMs?`, `revealFrom?`            | vineyard region photo + frosted strip; wine-detail hero + bottle                                                    |
| `InViewReveal.tsx`               | C   | **Scroll-triggered** top→bottom clip reveal (+ optional Ken-Burns `zoom`) via `IntersectionObserver` on an OUTER unclipped wrapper (observing the clipped element itself deadlocks — 0 area). 800ms.                                                                                                                | `children`, `durationMs?`, `zoom?`, `rootMargin?`                             | `/experiences` map                                                                                                  |
| `RegionScrollText.tsx`           | C   | Fixed-height text frame that **scrolls its overflow with no visible scrollbar** — native bar hidden (`no-scrollbar`), no custom track/thumb; overflow signalled only by the `/wines` fade masks (`wine-scroll-fade--top/--bottom`), scrollable on hover/keyboard-focus (`role="region"`, `tabIndex=0`, focus ring). | `children`, `className?` (height/flex), `ariaLabel?`                          | `/vineyards/[region]` body                                                                                          |

### `layout/` — page chrome

| File                        | S/C | Responsibility                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Key props                                                                           | Notes                                                                                                            |
| --------------------------- | --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `HeaderContent.tsx`         | S   | Content-page header: burger, left/right nav (`lg` only), centered `Wordmark`, `LanguageSwitcher`. Reads locale + builds nav.                                                                                                                                                                                                                                                                                                                                                                  | `activeId?: NavRouteId`, `mobileTransparentControls?: "dark"\|"light"`, `className` | Wraps children in `HeaderScrollFrame`. Nav labels are **static** (`getContent`).                                 |
| `HeaderScrollFrame.tsx`     | C   | Sets `data-scrolled` when `scrollY>8`; `fixed` transparent on mobile → `bg-surface-dark`; `lg:sticky` always dark. `group/header`.                                                                                                                                                                                                                                                                                                                                                            | `children`, `className`                                                             | Drives all child color inversions via `group-data-[scrolled=true]/header:…`.                                     |
| `HeaderHero.tsx`            | S   | Home-only header: burger + `LanguageSwitcher` (no nav words). `absolute top-0`.                                                                                                                                                                                                                                                                                                                                                                                                               | `className`                                                                         | Only on `/`.                                                                                                     |
| `HeroVideo.tsx`             | C   | Home hero: the full-screen `<video>` + gradient scrim. Autoplays **muted** reliably — sets `muted`/`defaultMuted` via the ref, calls `play()`, and **retries on `loadeddata`/`canplay`** (a single early `play()` can lose the race with media loading and leave it paused, showing the native play button — the bug this fixes) plus a first-interaction fallback. The lower-right speaker button is a **pure sound toggle** (flips `.muted`); it no longer has to be what starts the video. | —                                                                                   | Only on `/`; rendered by `page.tsx`.                                                                             |
| `HamburgerButton.tsx`       | C   | Icon button; `/svgs/line-pattern.svg` as CSS `mask` (58px mobile / 39.1px `lg`). `aria-label="Open menu"`.                                                                                                                                                                                                                                                                                                                                                                                    | `tone: "light"\|"dark"`, native button props (forwardRef)                           | Trigger for `MenuOverlay`.                                                                                       |
| `MenuOverlay.tsx`           | C   | Radix `Dialog` full-screen menu: close X, centered `Wordmark`, `LanguageSwitcher`, 4 columns (mobile = 4 direct links; `lg` = titles + `type-submenu` entries + vertical dividers), `SiteFooterMinimal`.                                                                                                                                                                                                                                                                                      | `trigger`, `menuColumns`, `currentLocale`                                           | Column titles use `NavWord`. Staggered via `.menu-stagger--*`.                                                   |
| `LanguageSwitcher.tsx`      | C   | ENG/GEO buttons calling `setLocale` server action inside `useTransition`. `aria-pressed`.                                                                                                                                                                                                                                                                                                                                                                                                     | `current: Locale`, `tone: "dark"\|"light"`, `className`                             | `type-language`.                                                                                                 |
| `ContentFooter.tsx`         | S   | Server wrapper: fetches CMS contact (`getResolvedContact`) → renders `SiteFooterMinimal` in a white page-footer bar.                                                                                                                                                                                                                                                                                                                                                                          | `background?: "white"\|"transparent"` (default `white`), `text?: "dark"\|"light"`   | Used by wines/experiences + region & wine detail. Home and `/vineyards` render transparent footer text directly. |
| `SiteFooterMinimal.tsx`     | S   | The actual footer markup: company + address. `type-meta`.                                                                                                                                                                                                                                                                                                                                                                                                                                     | `tone`, `layout: "stacked"\|"inline"`, `contact?`, `className`                      | Falls back to `SITE_CONTACT` if no `contact`.                                                                    |
| `EditorialTextCell.tsx`     | S   | Text cell in editorial grids; source inner max 520px, desktop 442px.                                                                                                                                                                                                                                                                                                                                                                                                                          | `children`, `className`, `contentClassName`                                         | experience detail                                                                                                |
| `SubtleVideoBackground.tsx` | C   | Fixed decorative grayscale video layer (`opacity-[0.31]`), disabled under reduced motion. `Video_Mgaloblishvili.mp4`.                                                                                                                                                                                                                                                                                                                                                                         | —                                                                                   | `(content)/layout.tsx` only                                                                                      |

### `features/` — domain-aware

| File                         | S/C | Responsibility                                                                                                                                                                                                                                                                                                 | Key props                                                          |
| ---------------------------- | --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `HistoryTabs.tsx`            | C   | Radix `Tabs` (3 panels). Each panel = symbol + title/body + revealed image. Tab triggers use the `nav-word` underline pattern + Mtavruli.                                                                                                                                                                      | `items: readonly HistoryItem[]`                                    |
| `VineyardsMap.tsx`           | S   | The map section: desktop `map.jpg` / mobile `map-mobile.jpg`, gradient scrim, mobile region list, footer. Delegates interactivity to `VineyardRegionsOverlay`.                                                                                                                                                 | `regions`, `activeRegionId?`, `mapImageUrl?`, `mapMobileImageUrl?` |
| `VineyardRegionsOverlay.tsx` | C   | Desktop hover/click regions: two `viewBox="0 0 2230 1203" preserveAspectRatio="xMidYMid slice"` SVGs (masked highlight rects + transparent hit-paths) + a positioned region `<nav>`. Highlight `rgba(255,255,255,0.32)`. Both layers share the new-map calibration and the Kakheti/Kvemo Kartli local offsets. | `regions`, `activeRegionId?`                                       |
| `WinesView.tsx`              | S   | Two modes: **index** (3 category words via `AnimatedCategoryList`) and **category** (left category list + `WineScrollList`).                                                                                                                                                                                   | `categories`, `wines`, `activeCategoryId?`                         |
| `WineScrollList.tsx`         | C   | Fixed-height scroll list with CSS fade mask + JS-positioned custom scrollbar thumb (capped at ⅓ track).                                                                                                                                                                                                        | `wines`, `categoryId`                                              |
| `AnimatedCategoryList.tsx`   | C   | `<ul>` that staggers its `<li>`s in **after** `BrandIntro` clears (MutationObserver + `1600ms` fallback); replays on client nav.                                                                                                                                                                               | `className`, `introFallbackMs?`, `children`                        |
| `ExperiencesView.tsx`        | S   | Gastronomy/Winery words via `AnimatedCategoryList`; nothing auto-active.                                                                                                                                                                                                                                       | `experiences`                                                      |

---

## 6. VISUAL-TO-CODE MAP ⭐ (the important one)

Point at anything in a screenshot → here is the file(s), the classes/tokens, and the gotcha.

### Loading splash (dark blurred overlay, logo fills top-to-bottom)

- **File:** `src/components/ui/BrandIntro.tsx` (+ `brandIntroTiming.ts`) · CSS `.brand-intro`,
  `.brand-intro__stack`, `.brand-intro__logo--base/--reveal` in `globals.css`.
- **Logo asset:** `/images/Mgaloblishvili-Logo.svg`. **Size** = `.brand-intro__stack` width
  (`188px → sm:225 → md:338 → lg:350`, aspect `245/50`). Total visible ~1.6s.
- Prompt tip: to resize the loading logo, change `.brand-intro__stack` widths in `globals.css`
  (not the component). This is a **different, larger** logo than the header wordmark.

### Home page `/`

- **File:** `src/app/page.tsx` (Server Component) renders **`<HeroVideo>`**
  (`src/components/layout/HeroVideo.tsx`, `"use client"`), which holds the full-screen `<video>`
  (`/Video_Mgaloblishvili.mp4`, `.hero-video-enter`, `autoPlay muted loop`) + the `surface-dark`
  gradient scrim.
- **Autoplay (must stay robust):** on mount it sets `muted`/`defaultMuted` via the ref, calls
  `play()`, then **retries on `loadeddata` and `canplay`**, with a first-user-interaction fallback.
  A single early `play()` can reject before the media is ready and leave the video paused with the
  native play button showing — that was the bug. Don't reduce this back to one `play()` call.
- **Sound:** the video autoplays **muted**. A lower-right icon-only button (`aria-label` toggles
  between `Unmute background video` and `Mute background video`) is a **pure sound toggle** that
  flips `.muted` (falling back to muted if a browser rejects audible playback). Do **not** restore a
  global first-click unmute listener: menu and language clicks must not unexpectedly start audio,
  and starting the video must not depend on the button.
- **Centered logo:** `/svgs/Product_of_Georgia.svg` (`width 603 height 152`, shown
  `w-[270px] sm:w-[320px] md:w-[400px] lg:w-[clamp(374px,30.855vw,527px)]`) — **NOT** the
  wordmark. In an `<h1>`.
- **Top-left burger + top-right ENG/GEO:** `HeaderHero.tsx` (no nav words up here).
- **Bottom nav words (Wines/History/…):** `NavLink` row, `hidden md:flex`. **Mobile hides them.**
- **Bottom contact line:** `SiteFooterMinimal layout="inline"`.
- Data is **static** — CMS edits do **not** change the home page.

### Content header (History/Wines/Vineyards/Experiences top bar)

- **File:** `HeaderContent.tsx` inside `HeaderScrollFrame.tsx`. The bar background (on
  `HeaderScrollFrame`) is **full-width**; the content div is **`relative mx-auto flex w-full
max-w-[1440px] lg:max-w-[1224px] items-center`**, height
  `h-16 md:h-24 lg:h-[clamp(88.4px,7.083vw,102px)]`.
- **Nav words** (desktop) are `absolute`, positioned by **% of the source frame** via `NAV_LEFT_POS`
  (History 10.694% · Vineyards 24.861% · Wines 68.056% · Experiences 81.597%), so centering the
  scaled content frame preserves the Figma composition. **Logo** is `absolute` centered at 50%.
  To move a nav word, edit its `NAV_LEFT_POS` percentage — not a grid column.
- **Scroll behavior:** transparent over content on mobile, turns `bg-surface-dark` after
  `scrollY>8` (`data-[scrolled=true]`); always dark on `lg` (`lg:sticky`). Some pages pass
  `mobileTransparentControls="light"` (vineyards, wine detail, experience detail) so the
  burger/lang start white over imagery.
- **Center logo:** `Wordmark size="header"` → `/images/Mgaloblishvili-Logo.svg`, desktop width
  `lg:w-[clamp(187px,14.935vw,238px)]` (mobile/tablet widths from `Wordmark`).

### Nav word (with diagonal slash + growing underline)

- **File:** `NavWord.tsx` (+ `DecorativeSlash.tsx`, wrapped by `NavLink.tsx`). Classes
  `type-menu nav-word tracking-[0.3em]`; active = `text-accent`; underline
  `h-[3px] bg-white … duration-[1420ms]`. Georgian adds `nav-word--mtavruli` + JS Mtavruli.

### Hamburger + menu overlay

- **Hamburger:** `HamburgerButton.tsx` — the 3-line icon is `/svgs/line-pattern.svg` used as a
  CSS `mask` on a `bg-current` box.
- **Overlay:** `MenuOverlay.tsx` (Radix `Dialog`, `bg-surface-dark`). Mobile = 4 centered
  `NavWord` links; `lg` = 4 columns (`NavWord` title + `type-submenu` entries + `.menu-divider-v`).
  Columns/labels come from `buildMenuColumns(content)` — **static**, so menu text is **not**
  CMS-driven. Close X is an inline SVG; footer is `SiteFooterMinimal`.

### Language switcher (ENG / GEO, stacked)

- **File:** `LanguageSwitcher.tsx`. `type-language`, `aria-pressed`. Calls `setLocale` server
  action (`src/lib/locale-actions.ts`) → sets `mga-locale` cookie → `revalidatePath("/","layout")`.

### `/history` — tabs + story panels

- **File:** `HistoryTabs.tsx` (Radix `Tabs`, `activationMode="manual"`). Panel image via
  the shared horizontal reveal/zoom; heading/body use the scaled editorial typography. **Tab bar**
  is at the bottom; triggers reuse the `nav-word` underline (`duration-[1420ms]`).
- **Desktop panel geometry:** `--history-band` is the viewport space above the tab bar,
  `--history-photo` is the capped photo height, and
  `--history-gap = (var(--history-band) - var(--history-photo)) / 2`. The text column uses that gap
  as its right padding, so the whitespace to the photo matches the photo's top/bottom inset.
- **Images:** `encounter` → `/images/Family.jpg`, `crossroads` → `/images/Crossroads.jpg`,
  `symbol` → `BrandSymbol` SVG on `bg-surface-cream` (unless a CMS image is set; `/images/TheSymbol.jpg`
  exists but is only used if the History "Symbol" item gets an image in Studio).
- Mobile: `<main>` has `pt-16 md:pt-24` because the header is fixed.

### `/vineyards` — interactive map

- **File (frame):** `VineyardsMap.tsx` (server). Desktop `/images/map.jpg`, mobile
  `/images/map-mobile.jpg`, gradient scrim, `SiteFooterMinimal` bottom.
- **File (interaction):** `VineyardRegionsOverlay.tsx` (client). Region shapes are inline SVG
  paths (`REGION_PATHS`) + masked highlight rects that mask `/svgs/{Kakheti,Imereti,Kvemo
Kartli,Racha-Lechkhumi,Guria-Samegrelo}.svg`. Hover/active fill `rgba(255,255,255,0.32)`.
  The right-side region list (`type-submenu`) lives here too.
- **Alignment trick:** map uses `object-cover object-center`; SVG uses
  `preserveAspectRatio="xMidYMid slice"`. The current `map.jpg` is `2230×1203`, so the SVG
  viewBox is also `0 0 2230 1203`. Both visible marks and transparent hit areas are wrapped in
  `SOURCE_TO_MAP_TRANSFORM = matrix(0.85 0 0 0.8 240 180)`. Do not alter one layer without the
  other. `REGION_OFFSETS` intentionally moves only Kakheti right by `50` and Kvemo Kartli down
  by `50`; the other three regions use no local offset.
- The page is viewport-locked on desktop (`md:h-svh md:overflow-hidden`).

### `/vineyards/[region]` — region detail (spec-accurate @ 1440×1053)

- **File:** `(content)/vineyards/[region]/page.tsx`. A scroll-capable desktop composition between
  `HeaderContent` and the white `ContentFooter`: a **41.18% / 58.82%** grid (`lg:grid-cols-[41.18%_58.82%]`)
  — Figma photo `left 593 / 1440 = 41.18%`. Left = symbol + localized title/subtitle + body;
  right = the region photo (`region.image1Url ?? /images/vineyard-kakheti.png`).
- **All fluid values are capped at their 1440 Figma sizes** (see §3.3): title
  and then rendered at the approved 85% desktop scale (see §3.3): title
  `clamp(34px,2.833vw,40.8px)`, body/subtitle `clamp(11.9px,0.944vw,13.6px)`, symbol
  `clamp(61.2px,5.136vw,73.95px)`, pads `min(2.951vw,42.5px)` / `min(1.417vw,20.4px)` / top
  `clamp(78.2px,6.198vw,89.25px)`. **Body line-height is `1.45`** (Figma reports `100%` but its drawn
  373px block ÷ 16 lines = 23.3px = 1.45 — the 1.45 is correct; do not "fix" it to 100%).
- **Two shared CSS vars on the `<section>` drive the geometry:**
  `--vr-band = max(calc(100svh - clamp(176.8px,14.167vw,204px)),
clamp(578px,47.989vw,691.05px))` and
  `--vr-photo = clamp(374px,38.545vw,555.05px)` (photo height). The **photo** is
  `lg:h-[var(--vr-photo)] lg:self-center` (centered in the band → equal top/bottom gaps).
- **Text column** is `lg:h-[var(--vr-band)]` and a **flex column**: symbol/title/subtitle pinned at
  the top, the **body frame flexes to fill** (`lg:flex-1 lg:min-h-0`), and the column's
  shared `--vr-gap = (band − photo) / 2` drives both `lg:pr` and `lg:pb`. The text-to-photo gap
  therefore equals the photo's top/bottom gap, and the frame bottom lands level with the photo.
  Change `--vr-photo` and the photo height plus all three gaps follow automatically.
- **Body is a `RegionScrollText` frame** (§5): the extra copy of long regions (Imereti) **hides
  into a no-scrollbar scroll** (only the top/bottom fade masks show; scrollable on hover/focus)
  instead of pushing the page. Short regions (Kakheti) fit with no fade. This is why the page fits
  one screen on tall viewports — do not replace it with a fixed-`px` body height.
- **Entrance motion:** symbol/title/subtitle via `IntroFlyIn` (order 1–3); the photo is wrapped in
  `IntroAwareHorizontalReveal durationMs={800}` (left→right) with `intro-zoom` on the image; a
  frosted strip (`absolute left-0 w-[15%]`, `bg-white/70 backdrop-blur-md`) uses the same reveal at
  `delayMs={500}`. Reduced motion removes the clip/zoom.
- CMS-first via `getResolvedContent(locale)`; `findVineyardRegion(...)` → `notFound()` on bad slugs.

### `/wines` and `/wines/[category]`

- **File:** `WinesView.tsx`. Index = three `type-category-large` words (Wines/Brandy/Chacha) via
  `AnimatedCategoryList`. Category = left category list + `WineScrollList.tsx` (right).
- **Wine list scroll UX:** `WineScrollList` — fade mask (`.wine-scroll-fade--top/--bottom`,
  top fade only after scrolling), JS thumb on `.wine-scroll-track`; `.wine-list-enter` slide on
  category change. Height is `min(54vh,380px)` at `md` and `min(45.9vh,323px)` at `lg`.

### `/wines/[category]/[itemId]` — wine detail

- **File:** `(content)/wines/[category]/[itemId]/page.tsx`. Hero image
  (`/images/wine_page_header.webp` default, `type-display-hero` title). Body section
  `bg-surface/88`: back-link (`type-menu`, `← {categoryLabel}`), `type-headline` name,
  `type-body-editorial` description, and the **grape-origin line** using
  `content.wines.originLabel` (the "Grape origin" label — **static**, not CMS) + `wine.grapeOrigin`.
- **Bottle:** `/images/wine_bottle.png` (`width 308 height 1114`, shown
  `w-[min(70vw,167px)] md:w-[min(48vw,214px)] lg:w-[18.182vw]`). The page uses the white
  `ContentFooter`.

### `/experiences` and `/experiences/[experience]`

- **Index:** `ExperiencesView.tsx` — Gastronomy/Winery via `AnimatedCategoryList`.
- **Detail:** `(content)/experiences/[experience]/page.tsx` — **rebuilt** (was a hero + 2×2 grid).
  Desktop (`lg`) is a two-column composition pixel-mapped to Figma @1440: **left** = one tasting
  photo (`image2Url ?? /images/people.jpg`) with an **L-shaped 30% white frost** (top band + right
  strip) holding centered intro copy — see `ExperienceFrostIntro.tsx` (client): the top band wipes
  bottom→top, the right strip left→right (both 800ms), then the copy fades in. **Right** = wine
  photo (`image1Url ?? /images/wine_glass.png`) + `TheSymbol.svg` + welcome copy. Below: a
  **clickable static map** (`mapImageUrl ?? /images/Map-mgaloblishvili.jpg`) that reveals
  top→bottom via `InViewReveal` on scroll and opens Google Maps in a new tab. Mobile is a clean
  vertical stack. Footer is an **inline `SiteFooterMinimal`** in a white section (not
  `ContentFooter`).
- **Desktop geometry follows the 85% rule and is capped at 1440**: for example, the source 880px
  left photo becomes `h-[min(51.944vw,748px)]`; the source 421px frost band becomes
  `h-[min(24.851vw,357.85px)]`. Mobile remains the existing vertical stack.
- **Content quirk:** if `winery` has no CMS text sections, it shows **gastronomy's** text.

### Footers (there are two)

- **`SiteFooterMinimal.tsx`** — the visible company + address line. Tones `light`/`dark`, layouts
  `stacked`/`inline`.
- **`ContentFooter.tsx`** — a server wrapper that resolves CMS contact and renders
  `SiteFooterMinimal` in a white bar by default. Address text **is** CMS-overridable (via
  `globalSettings.contact.address`); company name is `SITE_CONTACT.company` (static). Home and the
  `/vineyards` landing page render `SiteFooterMinimal` directly and transparently over media.

### Subtle background video (faint moving texture on light content pages)

- **File:** `SubtleVideoBackground.tsx` in `(content)/layout.tsx`. Grayscale, `opacity-[0.31]`,
  off under reduced motion. It's a real `<video>`, **not** a CSS background — don't convert it.

### Error / 404 screens

- **Files:** `src/app/error.tsx` (client, "Something went wrong" + Try again), `src/app/not-found.tsx`
  ("Page not found" + Return home). Both: dark, centered, `Wordmark size="sm"`, `type-headline`.

---

## 6.5 Reading the breakpoint from a screenshot

Tailwind breakpoints here are the defaults: **base (<640)** · **sm 640** · **md 768** ·
**lg 1024** · **xl 1280**. Use the tells below to infer which one a screenshot is showing, then
target that variant in your prompt. Each tell is a real responsive class copied from source.

| Visual tell                                                                                                                                                                          | Breakpoint                                                                      | Source (class · file)                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Content header: nav words flank the logo (left **and** right) vs. only burger · logo · ENG/GEO                                                                                       | words = **≥ lg** · none = **< lg**                                              | nav words `absolute … hidden … lg:flex` at `NAV_LEFT_POS` %, content `mx-auto max-w-[1440px] lg:max-w-[1224px]` · `HeaderContent.tsx` |
| Content header **bar height**: short ≈64px vs. tall ≈96px                                                                                                                            | short = **< md** · tall = **≥ md**                                              | `h-16 md:h-24` · `HeaderContent.tsx`                                                                                                  |
| Content header **background**: transparent over the hero/map vs. solid `surface-dark`                                                                                                | transparent = **mobile, unscrolled** · solid = **scrolled (any width) OR ≥ lg** | `bg-transparent` / `data-[scrolled=true]:bg-surface-dark` / `lg:bg-surface-dark`, `fixed … lg:sticky` · `HeaderScrollFrame.tsx`       |
| Home page: horizontal **row of nav words** across the bottom                                                                                                                         | present = **≥ md** · absent = **< md**                                          | `hidden w-full md:flex` · `page.tsx`                                                                                                  |
| Menu overlay: 4 centered **stacked** links vs. 4 **columns** with vertical dividers + submenu lists                                                                                  | stacked = **< lg** · columns = **≥ lg**                                         | `lg:hidden` vs `hidden … lg:flex` + `grid-cols-4` + divider `… lg:block` · `MenuOverlay.tsx`                                          |
| Region detail: **text then photo** vs. **41/59 text-left / photo-right**                                                                                                             | stacked = **< lg** · side-by-side = **≥ lg**                                    | `lg:grid-cols-[41.18%_58.82%]` · vineyard region `page.tsx`                                                                           |
| Experience detail: **one stacked column** vs. **2×2** image/text grid                                                                                                                | stacked = **< lg** · grid = **≥ lg**                                            | `grid-cols-1 lg:grid-cols-2` · experience `page.tsx`                                                                                  |
| Wine detail: description **above** the bottle vs. **text-left / bottle-right** two columns                                                                                           | stacked = **< lg** · two-col = **≥ lg**                                         | `grid-cols-1 lg:grid-cols-[minmax(0,440px)_1fr]` · wine detail `page.tsx`                                                             |
| Wines category: category words **above** the wine list vs. **words-left / list-right** (+ vertical scroll indicator appears)                                                         | stacked = **< md** · side-by-side = **≥ md**                                    | `flex-col md:flex-row` · `WinesView.tsx`; track `hidden … md:block` · `WineScrollList.tsx`                                            |
| Vineyards: **portrait mobile map** (`map-mobile.jpg`) + centered plain region list, page scrolls vs. **interactive hover map** (`map.jpg`) + right-side region list, viewport-locked | mobile map = **< md** · hover map = **≥ md**                                    | `md:hidden` / `md:block` · `VineyardsMap.tsx` + `VineyardRegionsOverlay.tsx`; `md:h-svh md:overflow-hidden` · `vineyards/page.tsx`    |
| History: three tab triggers **stacked** (one per row) vs. **three across** in one row                                                                                                | stacked = **< sm** · row = **≥ sm**                                             | `grid-cols-1 sm:grid-cols-3` · `HistoryTabs.tsx` (its panel image/text splits at `lg:grid-cols-2`)                                    |
| History / Wines pages: visible **top gap** below the fixed header vs. content flush to top                                                                                           | gap = **< lg** · flush = **≥ lg**                                               | `pt-16 md:pt-24 lg:pt-0` · those `page.tsx`                                                                                           |

**Combine tells — they narrow a band, not conflict.** Because different tells flip at different
breakpoints (sm / md / lg), one screenshot will usually satisfy tells from more than one breakpoint
at once, which _narrows_ the viewport to a range rather than contradicting itself. For example: a
tall header (**≥ md**) + no flanking nav words (**< lg**) + side-by-side Wines category (**≥ md**) +
still-stacked detail grids (**< lg**) together pin the width to **[md, lg)** — a tablet or
resized-window width. The "when tells conflict" rule below applies only to _genuine_ disagreement —
the same feature reading as both present and absent, or a screenshot too unclear to read — not to
tells that simply fire at different breakpoints.

**Secondary `md` tell on experience detail pages.** Even while _stacked_ (`< lg`), the people
image grows from `min-h-[520px]` to `md:min-h-[600px]`, and the wine image from `h-[272px]` to
`md:h-[380px]`. At `lg` the separate capped 85%-scaled composition takes over. Vineyard region
detail uses its own grid; its mobile photo keeps `aspect-[851/666]`.

**Width sanity-check** — cross-check the inferred breakpoint against a logo's apparent width
(base / sm / md / lg):

- Header wordmark (`Wordmark size="header"` → `Mgaloblishvili-Logo.svg`): **150 / 180 / 270 /
  187–238 px** (the content header uses a fluid capped `lg` override).
- Home center logo (`Product_of_Georgia.svg`): **270 / 320 / 338 / 400 px**.
- Loading-splash logo (`.brand-intro__stack`): **188 / 225 / 338 / 350 px**.
  The header wordmark nearly doubles between phone (150) and tablet (270) — the single clearest cross-check.

**When the tells conflict or the screenshot is ambiguous**, the change-prompt should tell Claude
Code to update **all** relevant responsive variants — or explicitly state which breakpoint it assumed.

---

## 7. Content & i18n

### Where text comes from

- **Static source of truth:** `src/data/content/{types,en,ka,index}.ts`.
  - `types.ts` — the `SiteContent` shape + id unions (`WineCategoryId`, `VineyardRegionId`,
    `ExperienceId`, `HistoryItemId`) + `isWineCategoryId` guard.
  - `en.ts` / `ka.ts` — the actual copy, lifted verbatim from source docs (they contain
    **intentional quirks**: Saperavi's lower-case `kakheti`, a mid-sentence capital `In` in the
    wines intro — **do not "fix" these**). `ka.ts` mirrors `en.ts` in Mkhedruli.
  - `index.ts` — public API: `getContent` / `getStaticContent` (sync), `getCmsContent` (async),
    **`getResolvedContent`** (async, CMS-first + static fallback), plus `findWine`,
    `getWinesByCategory`, `findVineyardRegion`, `findExperience`.
- **CMS overlay:** `getResolvedContent(locale)` calls Sanity and merges over the static baseline
  (see §8). **Content pages use `getResolvedContent`. Home page and both headers use the static
  `getContent`.**

### What is CMS-editable vs always-static (critical)

The adapter (`src/lib/sanity/adapter.ts`) merges per section. These stay **static even when CMS
has data**:

- **All nav labels** (`content.nav.*`) — so primary nav + menu column titles never reflect CMS.
- **`wines.originLabel`** ("Grape origin") and **`wines.intro`** paragraphs.
- **Section "title" fields** and company name in the footer.

Everything else (history items, vineyard intro + regions, wine categories' labels & wine items,
experiences' sections, contact **address**, and all images) **is** CMS-overridable. If CMS is
empty/unreachable, the static text shows.

### Real content IDs (so you can name things from a screenshot)

- **History items:** `encounter` ("The Encounter"), `crossroads` ("The Crossroads"),
  `symbol` ("The Symbol").
- **Vineyard regions:** `kakheti`, `kartli`, `imereti`, `racha-lechkhumi`, `guria-samegrelo`.
- **Wine categories:** `wines`, `brandy`, `chacha`.
- **Wine items** (category `wines` unless noted): `saperavi`, `tavkveri-rose`, `rkatsiteli-amber`,
  `rkatsiteli`, `kindzmarauli`, `kisi`, `kakhuri-mtsvane`, `saperavi-reserve`,
  `rkatsiteli-batonnage`, `krakhuna`, `tvishi`, `tsolikouri`, `tsinandali`; `xo`, `vsop`
  (**brandy**); `chacha` (**chacha**). 16 total.
- **Experiences:** `gastronomy` (2 text sections), `winery` (1 section).

### Locale mechanics

- Cookie **`mga-locale`** (`"en"|"ka"`, default `en`) — `src/lib/locale.ts`
  (`getServerLocale`, `isLocale`, `LOCALE_COOKIE`).
- **`setLocale`** server action (`src/lib/locale-actions.ts`) writes the cookie +
  `revalidatePath("/", "layout")`. Triggered by `LanguageSwitcher`.
- **`src/proxy.ts`** (Next 16's renamed middleware) does **NOT** handle locale — it only guards
  `/studio` with HTTP Basic Auth (`STUDIO_AUTH_USER`/`STUDIO_AUTH_PASSWORD`).
- **Mtavruli** (Georgian caps) is JS-only via `toMtavruliIfGeorgian`, scoped to `NavWord` +
  history tab labels. Body/submenu Georgian stays Mkhedruli.

---

## 8. Sanity CMS

- **Project id is env-driven** (`NEXT_PUBLIC_SANITY_PROJECT_ID`; live value **`n350sy33`**),
  dataset `production`. Studio at `/studio` (config `sanity.config.ts`, starts with `'use client'`).
  Studio list structure in `structure.ts`.
- **Read client** (`src/lib/sanity/client.ts`): lazy, **token-less**, `useCdn:false`,
  `perspective:'published'`. `safeFetch` cache = dev `{cache:'no-store'}` / prod
  `{next:{revalidate:60}}`. Returns `null` if no project id (so static fallback kicks in).

### Schema types (`schemaTypes/*.ts`)

Fields are built with `schemaTypes/helpers.ts`: `bilingualString`, `bilingualText`,
`bilingualParagraphs` (array of `{en,ka}`), `bilingualImage` (`hotspot` + `altEn`/`altKa`).
**Georgian fields are validated to reject Mtavruli** (must stay Mkhedruli).

| Type             | Singleton?   | Doc ID                  | Editable fields                                                                                                                        |
| ---------------- | ------------ | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `globalSettings` | ✅           | `globalSettings`        | `contact.address` (bilingual), `contact.phone`, `contact.email`                                                                        |
| `history`        | ✅           | `history`               | `items[]` (max 3): `tabLabel`, `heading`, `body[]`, `image`; `sortOrder` read-only                                                     |
| `vineyards`      | ✅           | `vineyards`             | `introHeading`, `intro[]`, `desktopMapImage`, `mobileMapImage`                                                                         |
| `vineyardRegion` | ✕ collection | `vineyardRegion-<slug>` | `title`, `subtitle`, `bodyBlocks[]`, `images[]`; `slug`/`sortOrder` read-only                                                          |
| `wineCategory`   | ✕ collection | `wineCategory-<slug>`   | `title`; `slug`/`sortOrder` read-only                                                                                                  |
| `wineItem`       | ✕ collection | `wineItem-<itemId>`     | `category` (ref), `sortOrder`, `name`, `grapeOrigin`, `descriptionLines[]`, `details`, `heroImage`, `bottleImage`; `itemId` read-only  |
| `experienceItem` | ✕ collection | `experienceItem-<slug>` | `title`, `sections[]` (max 2: `heading`+`body[]`), `heroImage`, `image1`, `image2`, `mapImage`, `mapUrl`; `slug`/`sortOrder` read-only |

Singletons are enforced in `singletonTypes.ts` + `sanity.config.ts` (`SINGLETON_TYPES =
{globalSettings, history, vineyards}`; duplicate-create disabled, actions limited to
publish/discard/restore).

### How CMS data reaches components

```
Studio publish
  → queries.ts (GROQ: allContentQuery / per-type)   [server-only]
  → safeFetch (client.ts)                            [token-less, published]
  → adaptCmsToContent (adapter.ts): per-section merge over static fallback
      · mergeWineCategories = per-id label merge (not all-or-nothing)
      · experiences read structured sections[] (legacy bodyBlocks as fallback)
      · history maps positionally (0=encounter,1=crossroads,2=symbol)
      · images → sanityImageUrl (image.ts, @sanity/image-url, auto format)
  → getResolvedContent (data/content/index.ts): CMS ?? static
  → pages render
```

Contact text has its own path: `src/lib/sanity/contact.ts` (`getResolvedContact`) used by
`ContentFooter`, `VineyardsMap`, experience detail.

### Revalidation

`/api/revalidate` (`route.ts`): `POST` (or `GET`) with secret in header
`x-sanity-revalidate-secret` (query `?secret=` = local only). Verifies
`SANITY_REVALIDATE_SECRET`, then `revalidatePath` on **every** CMS-driven path (derived from
static content so it works even if Sanity is down). Configure a Sanity webhook → this URL to make
Studio publishes appear immediately; otherwise pages refresh on their own cadence.

### Seeding

`scripts/seed-sanity.ts` (`pnpm sanity:seed:dry-run` / `pnpm sanity:seed`, needs
`SANITY_API_WRITE_TOKEN`). Uses **`createOrReplace`** → initial population only; **re-running
overwrites live client edits + the 3 singletons** with the static baseline.

---

## 9. Conventions & patterns

**Naming / structure**

- `ui/` = domain-neutral primitives · `layout/` = page chrome · `features/` = domain-aware.
  Routes (`page.tsx`) **compose** components; they aren't component libraries.
- **All paths go through `src/data/routes.ts`** (`routes.wineItem(cat,id)`, etc.) — never inline
  a route template string.
- **All copy goes through `getContent`/`getResolvedContent` + selectors** — never hardcode
  content strings in a component.
- Footer text = `SITE_CONTACT` (`src/data/site.ts`) / `getResolvedContact`.

**Styling approach**

- Utility-first Tailwind v4. Tokens live in `globals.css @theme`; **there is no
  `tailwind.config.*`**. Keyframes + project classes live only in `globals.css`.
- Prefer an existing `type-*` utility / token before adding anything. Add a new `@theme` token or
  `@utility` only for a repeated role; one-off arbitrary values need a real layout reason.
- Conditional classes via `cn()`; focus rings via `focusRing()`; Georgian caps via
  `toMtavruliIfGeorgian()`.

**How a typical change is made** (tell Claude Code which lane it's in)
| Change | Where |
|---|---|
| Restyle a piece of UI | edit that component's class string; or the token in `globals.css @theme`; or a keyframe/`.class` in `globals.css` |
| Reword site copy (static) | `src/data/content/en.ts` + `ka.ts` (keep `types.ts` in sync) |
| Reword copy (client-editable) | Sanity Studio `/studio` (history/vineyards/wines/experiences/contact) |
| New route/section | mirror an existing `(content)` page; add a `routes.ts` builder; validate params + `notFound()` |
| Add a wine/region/experience | edit `content/{en,ka}.ts` (+ `WINE_CATEGORY_IDS` for a new category); nav/menu/lists derive automatically |

**Hard rules (from `CLAUDE.md`, `AGENTS.md`, `guide.md`)**

- Server-first; push `"use client"` to the smallest leaf; serializable props across the boundary.
- Validate every dynamic route param and call `notFound()` on miss.
- Ask before: dependencies, `next.config`/`tsconfig`/PostCSS/ESLint changes, auth/session changes,
  schema/migrations, broad multi-file refactors.
- **Never** read/edit/commit `.env*` (hook-blocked); never hardcode secrets; never expose them to
  the client (only `NEXT_PUBLIC_*` reaches the browser, and those aren't secrets).
- Don't redesign/restyle unless that's the explicit task; preserve desktop layout when fixing
  mobile; keep `focus-visible`, `motion-reduce`, and `aria-*` behavior intact.
- Verify with `pnpm lint` + `pnpm typecheck` + `pnpm build` (dev server lies about CSS — see §10).

---

## 10. Gotchas (non-obvious; these have bitten before)

1. **Home page + headers are static, not CMS.** Editing content in Studio changes the content
   pages but **not** the home page and **not** any nav/menu label. `wines.intro` and the
   "Grape origin" label are also always static. Don't promise a Studio edit will change those.
2. **Dotted Sanity document `_id`s are private/invisible.** A `_id` with a `.` lands in the
   `drafts.`/`versions.` namespace and the token-less frontend can't read it — it publishes
   "successfully" yet never appears. All IDs use hyphens (`wineItem-saperavi`). If new CMS
   content "won't show," suspect this.
3. **Georgian uppercase must be JS (`toMtavruliIfGeorgian`), never CSS `uppercase`.** CSS
   uppercase doesn't map Georgian. Only nav words + history tab labels are Mtavruli; body stays
   Mkhedruli.
4. **Scrollbars are hidden site-wide** (`globals.css` on `html`). Scrolling still works. The
   `/vineyards` map page is additionally viewport-locked (`md:h-svh md:overflow-hidden`).
   4a. **Sizing: desktop is 85%, cap `vw` at 1440, never `zoom`/page-scale (§3.3).** At `lg`, rem-based
   utilities inherit `html { font-size:85% }`; explicit measurements use 0.85-scaled `clamp()`/
   `min()` values capped at their scaled 1440 size. Mobile/tablet stay unchanged. Do **not** replace
   this with `body{zoom}`, a page-level `transform:scale`, or a document `max-width`/`max-height`
   clamp. Viewport-fill sections still use plain `svh`; there is no `/0.85` height compensation.
   4b. **`/vineyards/[region]` text is a `RegionScrollText` frame with no visible scrollbar.** Long
   regions (Imereti) hide overflow into a hover-scroll (fade masks only). The frame bottom is
   aligned to the photo via `--vr-band`/`--vr-photo`; `--vr-gap` also keeps its right edge the same
   distance from the photo as the photo's top/bottom inset. Don't swap it for a fixed-`px` body
   height or re-add a track/thumb (both were explicitly removed).
5. **Turbopack dev serves stale CSS.** If a class/CSS change "doesn't appear" in `pnpm dev`,
   restart + hard-refresh, or verify with `pnpm build`. JS/state/inline-style changes are
   unaffected. Don't "re-fix" already-correct source.
6. **`BrandIntro` overlay also plays over `/studio`** (root layout wraps the studio route). Known,
   not a bug.
7. **Winery experience shows Gastronomy's text** until the `winery` document gets its own CMS
   `sections`. Intentional.
8. **`pnpm sanity:seed` overwrites live edits** (`createOrReplace`). Never run it against a
   dataset the client has edited unless deliberately resetting to the static baseline.
9. **SVG-over-image alignment** on the vineyards map depends on `object-cover object-center`
   (image) matching `preserveAspectRatio="xMidYMid slice"` (SVG). The replacement `map.jpg`
   uses a `2230×1203` canvas, `SOURCE_TO_MAP_TRANSFORM = matrix(0.85 0 0 0.8 240 180)`, and
   local offsets for Kakheti (`+50px` x) and Kvemo Kartli (`+50px` y). Update the visible masks
   and transparent hit paths together.
10. **Two logos, two sizes.** Header/menu/error use `Mgaloblishvili-Logo.svg` via
    `Wordmark size="header"` (150→238px). The **home center** logo is a different asset,
    `Product_of_Georgia.svg` (270→a capped 527px desktop max). The **loading** logo is
    `Mgaloblishvili-Logo.svg` sized by `.brand-intro__stack` (188→297.5px).
11. **Region detail shell/content are transparent** so `SubtleVideoBackground` shows through;
    only its footer is `bg-white`. Wine/experience detail panels use `bg-surface/88`.
12. **Georgian font uses `next/font/google`** (`Noto_Serif_Georgian`) — offline/hermetic builds
    need network. Latin fonts are self-hosted.
13. **Known-pending items (state today):** the browser tab icon is the default Next.js
    `src/app/favicon.ico` (no custom `icon.*` yet); `src/data/site.ts` has a lint error — a stray
    parenthesized string on line ~10 (dead `@typescript-eslint/no-unused-expressions`). Current
    `SITE_DESCRIPTION` = "Ancient Georgian winemaking reimagined. Bold flavors, modern spirit."
    Don't rely on either being resolved yet.
14. **`experiences` map link** opens a hardcoded Google Maps URL unless the CMS `mapUrl` is set.
15. **Home-video audio cannot be forced on load.** Browsers block audible autoplay for many
    first-time visitors, and synthetic clicks do not count as user activation. Keep the video
    muted until the visitor explicitly uses the speaker button in `HeroVideo.tsx`.
16. **Vineyard region reveal and Safari cache:** both reveal states include `clip-path` and
    `-webkit-clip-path`, plus `will-change: clip-path`. Chrome, Brave, and Safari private mode
    displayed the photo and 70%-white frosted strip correctly. If normal Safari alone omits the
    strip, first hard-refresh or clear that site's Safari cache before changing source; this has
    already presented as profile-specific stale CSS.
17. **Reveal readiness is currently instance-local.** Each `IntroAwareHorizontalReveal` watches
    `.brand-intro` with its own `MutationObserver` and a `BRAND_INTRO_TOTAL_MS` fallback. The
    photo and frosted strip currently work as two instances (strip delayed 500ms). If an
    intermittent reload race returns, the preferred structural fix is one shared intro-ready
    signal/provider for both layers, not extra timers or duplicate overlay markup.

---

## How to use this doc (note to the other Claude)

You will receive **screenshots**, not code. Your job is to write a **change-prompt for Claude
Code**. Workflow:

1. **Locate.** Use **§6 (Visual-to-Code Map)** to turn the region in the screenshot into exact
   files. Cross-check the token/class names in **§3** and the component props in **§5**.
2. **Name real things.** Reference actual files (`src/components/...`), actual components
   (`WineScrollList`), actual tokens (`text-accent`, `type-headline`, `bg-surface-dark`), and
   actual content IDs (`saperavi`, `kakheti`) — all listed here. Do **not** invent class names,
   files, or tokens.
3. **Pick the right lane** (§9 table): is this a **styling** tweak (component class / `@theme`
   token / `globals.css` keyframe), a **static copy** change (`en.ts`/`ka.ts`), a **CMS copy**
   change (Studio), or a **new route/section**?
4. **Respect the guardrails** (§9 hard rules + §10 gotchas): server-first boundary,
   `routes.ts`/`getContent` indirection, `focusRing`/`cn`/Mtavruli helpers, `notFound()` on bad
   params, reduced-motion, no `.env`/dependency/config changes without calling it out, and the
   fact that home + nav labels are static.
5. **Write the prompt** as a specific instruction, e.g.:
   > "In `src/components/features/WineScrollList.tsx`, change the wine list item links
   > (`type-submenu text-ink/85`) hover color from `hover:text-accent` to … Keep `focusRing`,
   > the fade mask classes, and reduced-motion behavior. Verify with `pnpm lint && pnpm
typecheck`."
6. **Ask Claude Code to verify** with `pnpm lint` + `pnpm typecheck` + `pnpm build`, and remind it
   the dev server can serve stale CSS.

When unsure whether something is static or CMS-driven, default to telling Claude Code to check
`src/data/content/*` and `src/lib/sanity/adapter.ts` first — that's where the answer lives.

```

```
