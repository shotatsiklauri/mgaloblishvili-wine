# AI_HANDOFF.md — Mgaloblishvili Wine Estate Site

> **Who this is for.** You are a Claude instance in the chat app. You **cannot** see this
> repo or filesystem. A user will show you a **screenshot of the running site** and you must
> write a precise **change-prompt** to paste into Claude Code (which *does* have the repo).
> Your prompts must name **real files, components, and existing tokens/classes** — everything
> in this doc is copied verbatim from source, so trust these names over your instincts.
>
> Read §6 (Visual-to-Code Map) to turn any pixel into a file. Read §9–§10 before writing a
> prompt so you don't propose something the codebase forbids.

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

| | |
|---|---|
| **What** | Luxury editorial marketing site for **Wine Mgaloblishvili LLC**, a Georgian wine estate (Village Martkopi, 1320, Gardabani, Georgia). |
| **Feel** | Editorial, cinematic, spacious, slow, premium. Full-bleed imagery, serif display type, restrained motion. **No** cards, heavy borders, dashboards, or generic marketing blocks. |
| **Design source** | Visuals follow a supplied Mgaloblishvili Illustrator artboard (1440×900). Interaction/structure modeled on Antinori's *Villa Antinori* page. |
| **Languages** | Bilingual **English + Georgian**. Georgian body text is **Mkhedruli**; decorative nav words render as **Mtavruli** (uppercase Georgian), done in JS. |
| **Commerce/Auth** | None. No cart, no login, no user DB. Content is static TypeScript **or** Sanity CMS. |
| **State: built** | All routes live; bilingual switching works; **Sanity CMS is live end-to-end** with static fallback; SEO done (robots, sitemap, OG image, dynamic `<html lang>`). |
| **State: pending** | Browser tab favicon is **still the default Next.js icon** (`src/app/favicon.ico`). `src/data/site.ts` has one existing **lint warning** (a stray dead string). **No tests, no CI.** `NEXT_PUBLIC_SITE_URL` must be set for production SEO URLs. |

**Active vineyard-detail worktree changes (2026-07-13):**
- Modified: `src/app/(content)/vineyards/[region]/page.tsx`
- Modified: `src/app/globals.css`
- New/untracked: `src/components/ui/IntroAwareHorizontalReveal.tsx`

These files are one feature and must be kept together. The latest verification was
`pnpm lint` (0 errors, the existing `src/data/site.ts` warning only), `pnpm typecheck`, and a
focused Prettier check; all completed successfully.

---

## 2. Tech stack (exact versions from `package.json`)

| Concern | Package | Version |
|---|---|---|
| Framework | `next` | **16.2.6** (App Router, Turbopack dev) |
| UI runtime | `react` / `react-dom` | **19.2.4** |
| Language | `typescript` | `^5` (strict; `target ES2017`) |
| Styling | `tailwindcss` | `^4` (via `@tailwindcss/postcss ^4`) — **CSS-first, no `tailwind.config.*`** |
| Motion | `motion` | `^12.38.0` (imported as `motion/react`) |
| CMS | `sanity` | `^6.1.0` |
| CMS (Next) | `next-sanity` | `^13.1.0` |
| CMS images | `@sanity/image-url` | `^2.1.1` |
| Menu overlay | `@radix-ui/react-dialog` | `^1.1.15` |
| History tabs | `@radix-ui/react-tabs` | `^1.1.13` |
| Class utils | `clsx` `^2.1.1` + `tailwind-merge` `^3.6.0` | → `cn()` |
| Server guard | `server-only` | `^0.0.1` |
| Lint/format | `eslint ^9` + `eslint-config-next 16.2.6`, `prettier ^3.3.3` + `prettier-plugin-tailwindcss` | flat config (`eslint.config.mjs`) |

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

| Token | Hex | Where it shows up |
|---|---|---|
| `surface-dark` | `#05090a` | Home bg, dark header (scrolled + desktop), all dark footers, vineyards bg, menu overlay bg, brand-intro gradient, OG image bg, error/not-found bg |
| `surface` | `#f4f4f4` | Content-page background (`body`), `SubtleVideoBackground` base, wine/experience detail panels use `bg-surface/88` |
| `surface-cream` | `#ede7e1` | "The Symbol" history tab visual background |
| `ink` | `#0d0d0d` | Default text/underlines on light pages |
| `ink-inverse` | `#ffffff` | Text/controls on dark surfaces |
| `ink-muted` | `#505354` | Light-footer text, back-links, wine-detail separators, inactive history tab |
| `accent` | `#c9a96e` | Hover/active state, focus ring, OG rule, decorative accents |

> Note: the vineyard **region detail** `<main>` uses literal `bg-white` (not `surface`) for its
> hero band + grid; wine detail and experience detail use `bg-surface/88`.

### 3.2 Typography

**Fonts loaded in `src/lib/fonts.ts`** (`next/font`; `.ttf` sources in `src/app/fonts/`):

| Export | Source | CSS variable | Weights |
|---|---|---|---|
| `fontSans` | `Inter-Variable.ttf` (local) | `--font-sans` | `100 900` |
| `fontSerif` | `NotoSerif-Variable.ttf` (local) | `--font-serif-latin` | `100 900` |
| `fontSerifGeorgian` | `Noto_Serif_Georgian` (**next/font/google**) | `--font-serif-georgian` | `300,400,500,700` |

Wired onto `<html>` in `src/app/layout.tsx` via `${fontSans.variable} ${fontSerif.variable}
${fontSerifGeorgian.variable}`. `<body>` is `font-sans`. The `--font-serif` stack is
Latin-Noto → Georgian-Noto → `ui-serif` so the browser picks the right glyph per character.
**Body/UI = Inter (sans); editorial headings & serif copy = Noto Serif**, always applied
through the `type-*` utilities below (not raw `font-serif`).

**Semantic type utilities (`@utility` in `globals.css`) — use these before any raw font class:**

| Utility | Family | Weight | Size | Line-height | Letter-spacing / transform | Used for |
|---|---|---|---|---|---|---|
| `type-menu` | sans | 600 | 12px | 1.4 | `0.5px`, uppercase | nav labels, tab labels, back-links, small actions |
| `type-submenu` | serif | 300 | 18px | 2.4 | — | menu submenu links, wine list items, region links |
| `type-headline` | serif | 500 | 36px | 1.2 | — | section/content headings |
| `type-body-editorial` | serif | 400 | 14px | 1.6 | `0.02em` | editorial body paragraphs |
| `type-display-hero` | serif | 400 | `clamp(46px,8vw,92px)` | 1.05 | — | image-overlay hero titles |
| `type-category-large` | serif | 300 | `clamp(34px,5vw,56px)` | 1.2 | — | Wines/Brandy/Chacha/Gastronomy/Winery selectors |
| `type-meta` | sans | 400 | 11px | 1.4 | — | footer + metadata text |
| `type-language` | sans | 600 | 11px | 1.15 | `0.12em`, uppercase | ENG/GEO switcher |

**Nav word sizing** (plain classes in `globals.css`, applied together with `type-menu`):
`.nav-word` = 13.5px (→14px `md`, →12.5px in `.site-header--compact` at `lg`). Georgian variant
`.nav-word--mtavruli` = 12.5px (→13px `md`, →11.5px compact `lg`). `NavWord` also adds
`tracking-[0.3em]`.

### 3.3 Spacing / layout

- **Breakpoints** = Tailwind defaults: `sm 640` · `md 768` · `lg 1024` · `xl 1280`. The
  **mobile→desktop pivot is mostly `lg`** for the header (fixed→sticky, nav words appear) and
  `md` for most editorial grids (1-col → 2-col).
- **`Container`** (`src/components/ui/Container.tsx`): `mx-auto w-full max-w-[1200px] px-6 md:px-10`.
- **`EditorialTextCell`** (`src/components/layout/EditorialTextCell.tsx`): outer
  `px-6 py-10 md:px-14 lg:min-h-[476px] lg:px-20 lg:py-14 xl:px-24`, inner `max-w-[520px]`.
- **Content-page skeleton** every page follows:
  ```tsx
  <div className="flex min-h-svh flex-col">   {/* or md:h-svh for viewport-locked pages */}
    <HeaderContent activeId="…" />
    <main className="flex-1 …">{/* feature component */}</main>
    <ContentFooter />                          {/* except experience detail — see §6 */}
  </div>
  ```
- The content **header** is a 3-col grid on mobile, **5-col** on `lg`:
  `grid-cols-[auto_1fr_auto] lg:grid-cols-[auto_1fr_auto_1fr_auto]` — the two `1fr` columns keep
  the logo centered across EN/KA label widths. Height `h-16 md:h-24`.

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

| URL | Route file | Renders | Data |
|---|---|---|---|
| `/` | `src/app/page.tsx` (RSC) | `<HeroVideo>` (client: muted video + scrim + explicit sound toggle), `HeaderHero`, centered `Product_of_Georgia.svg`, bottom `NavLink` row, inline `SiteFooterMinimal` | **static** (home does **not** read CMS) |
| `/history` | `(content)/history/page.tsx` | `HeaderContent` + `HistoryTabs` + `ContentFooter` | CMS-first |
| `/vineyards` | `(content)/vineyards/page.tsx` | `HeaderContent(mobileTransparentControls="light")` + `VineyardsMap` | CMS-first |
| `/vineyards/[region]` | `(content)/vineyards/[region]/page.tsx` | viewport-locked 42/58 text-and-photo composition + `ContentFooter tone="dark"` | CMS-first; `generateStaticParams` from static; `findVineyardRegion` → `notFound()` |
| `/wines` | `(content)/wines/page.tsx` | `HeaderContent` + `WinesView` (index) + `ContentFooter` | CMS-first |
| `/wines/[category]` | `(content)/wines/[category]/page.tsx` | `WinesView` (category + `WineScrollList`) | CMS-first; `isWineCategoryId` guard → `notFound()` |
| `/wines/[category]/[itemId]` | `(content)/wines/[category]/[itemId]/page.tsx` | hero + text + bottle + `ContentFooter tone="dark"` | CMS-first; `findWine` → `notFound()` |
| `/experiences` | `(content)/experiences/page.tsx` | `HeaderContent` + `ExperiencesView` + `ContentFooter` | CMS-first |
| `/experiences/[experience]` | `(content)/experiences/[experience]/page.tsx` | hero + 2×2 grid + clickable map + own dark footer | CMS-first; `generateStaticParams`; `findExperience` → `notFound()` |
| `/studio`, `/studio/*` | `src/app/studio/[[...tool]]/page.tsx` | `<NextStudio>` (`force-static`) | Sanity Studio; gated by `src/proxy.ts` Basic Auth |
| `/api/revalidate` | `src/app/api/revalidate/route.ts` | `POST`/`GET` webhook (secret) → `revalidatePath` all CMS paths | — |
| `/sitemap.xml` | `src/app/sitemap.ts` | all routes enumerated from static content | static |
| `/robots.txt` | `src/app/robots.ts` | allow `/`, disallow `/studio` + `/api/` | — |
| `/opengraph-image` | `src/app/opengraph-image.tsx` | 1200×630 `next/og` brand card | — |
| (root error) | `src/app/error.tsx` (client) | dark full-screen "Something went wrong" + reset | — |
| (root 404) | `src/app/not-found.tsx` | dark full-screen "Page not found" + home link | — |

Root shell: `src/app/layout.tsx` (RSC, async) sets `<html lang={locale}>`, font variables,
metadata (title template `%s · Mgaloblishvili`, OG, Twitter, `metadataBase`), and renders
`{children}` + `<BrandIntro />`. `(content)/layout.tsx` wraps content pages with
`bg-surface` and a fixed `<SubtleVideoBackground />`.

---

## 5. Component catalog

Paths are under `src/components/`. "C" = Client Component, "S" = Server Component.

### `ui/` — domain-neutral primitives

| File | S/C | Responsibility | Key props | Used by |
|---|---|---|---|---|
| `Wordmark.tsx` | S | The Mgaloblishvili logo lockup (wraps `BrandLogoImg`). | `size: "lg"\|"sm"\|"header"\|"home"` (default `lg`), `asHeading`, `className` | `HeaderContent`, `MenuOverlay` (`header`); `error`, `not-found` (`sm`). *`lg`/`home` defined but currently unused.* |
| `BrandLogoImg.tsx` | S | Renders `/images/Mgaloblishvili-Logo.svg` (`width 245 height 50`, `h-auto`). | `className` | `Wordmark` only |
| `BrandSymbol.tsx` | S | Inline SVG "crossroads" mark (`viewBox 0 0 100 100`, `fill-current`). | `size`, `title`, `className` | `HistoryTabs` (Symbol tab visual) |
| `NavLink.tsx` | S | `next/link` wrapper around `NavWord` (adds `group`, focus ring). | `href`, `active`, `edgeUnderline`, `underlineClassName`, `className` | content header, home nav |
| `NavWord.tsx` | S | The decorative nav word: `type-menu nav-word tracking-[0.3em]`, Mtavruli conversion, hover→`text-accent`, growing underline (`duration-[1420ms]`), `DecorativeSlash`. | `active`, `edgeUnderline`, `underlineClassName`, `className` | `NavLink`, `MenuOverlay`, `HistoryTabs` pattern |
| `DecorativeSlash.tsx` | S | The diagonal ornament behind an inactive nav word (`h-[0.5px] w-[100px] rotate-[-45deg] bg-white/30`, hides on hover). | `className` | `NavWord` |
| `Container.tsx` | S | Centered max-width wrapper `max-w-[1200px] px-6 md:px-10`. | `className`, `children` | `HistoryTabs` |
| `Reveal.tsx` | C | `motion/react` scroll-reveal (fade-up). | `delay`, `amount`, `distance`, `className` | `HistoryTabs` |
| `BrandIntro.tsx` | C | Full-screen loading overlay on mount + soft-nav + bfcache restore; unmounts after `1600ms`. Two stacked `/images/Mgaloblishvili-Logo.svg` (base 20% + clip-path reveal). | — | root `layout.tsx` |
| `brandIntroTiming.ts` | — | `export const BRAND_INTRO_TOTAL_MS = 1600` | — | `BrandIntro`, `AnimatedCategoryList` |
| `IntroAwareHorizontalReveal.tsx` | C | Holds content clipped at 0% while `.brand-intro` exists, then runs the shared 1420ms left-to-right reveal; supports a per-layer `delayMs` and route replay. | `children`, `className?`, `delayMs?` | vineyard region photo + frosted strip |

### `layout/` — page chrome

| File | S/C | Responsibility | Key props | Notes |
|---|---|---|---|---|
| `HeaderContent.tsx` | S | Content-page header: burger, left/right nav (`lg` only), centered `Wordmark`, `LanguageSwitcher`. Reads locale + builds nav. | `activeId?: NavRouteId`, `mobileTransparentControls?: "dark"\|"light"`, `className` | Wraps children in `HeaderScrollFrame`. Nav labels are **static** (`getContent`). |
| `HeaderScrollFrame.tsx` | C | Sets `data-scrolled` when `scrollY>8`; `fixed` transparent on mobile → `bg-surface-dark`; `lg:sticky` always dark. `group/header`. | `children`, `className` | Drives all child color inversions via `group-data-[scrolled=true]/header:…`. |
| `HeaderHero.tsx` | S | Home-only header: burger + `LanguageSwitcher` (no nav words). `absolute top-0`. | `className` | Only on `/`. |
| `HeroVideo.tsx` | C | Home hero: the full-screen `<video>` + gradient scrim. Autoplays **muted** (set imperatively via the ref so autoplay isn't blocked), with a lower-right speaker button that explicitly toggles sound. | — | Only on `/`; rendered by `page.tsx`. |
| `HamburgerButton.tsx` | C | Icon button; `/svgs/line-pattern.svg` as CSS `mask` (58px mobile / 46px `lg`). `aria-label="Open menu"`. | `tone: "light"\|"dark"`, native button props (forwardRef) | Trigger for `MenuOverlay`. |
| `MenuOverlay.tsx` | C | Radix `Dialog` full-screen menu: close X, centered `Wordmark`, `LanguageSwitcher`, 4 columns (mobile = 4 direct links; `lg` = titles + `type-submenu` entries + vertical dividers), `SiteFooterMinimal`. | `trigger`, `menuColumns`, `currentLocale` | Column titles use `NavWord`. Staggered via `.menu-stagger--*`. |
| `LanguageSwitcher.tsx` | C | ENG/GEO buttons calling `setLocale` server action inside `useTransition`. `aria-pressed`. | `current: Locale`, `tone: "dark"\|"light"`, `className` | `type-language`. |
| `ContentFooter.tsx` | S | Server wrapper: fetches CMS contact (`getResolvedContact`) → renders `SiteFooterMinimal`. Adds `footer-overscroll-fill-dark bg-surface-dark` when dark. | `tone?: "light"\|"dark"` (default `dark`) | Used by history/wines/vineyards + region & wine detail. |
| `SiteFooterMinimal.tsx` | S | The actual footer markup: company + address. `type-meta`. | `tone`, `layout: "stacked"\|"inline"`, `contact?`, `className` | Falls back to `SITE_CONTACT` if no `contact`. |
| `EditorialTextCell.tsx` | S | Text cell in editorial 2×2 grids (padding + `max-w-[520px]`). | `children`, `className`, `contentClassName` | experience detail |
| `SubtleVideoBackground.tsx` | C | Fixed decorative grayscale video layer (`opacity-[0.13]`), disabled under reduced motion. `Video_Mgaloblishvili.mp4`. | — | `(content)/layout.tsx` only |

### `features/` — domain-aware

| File | S/C | Responsibility | Key props |
|---|---|---|---|
| `HistoryTabs.tsx` | C | Radix `Tabs` (3 panels). Each panel = image + `type-headline` + `type-body-editorial`, wrapped in `Reveal`. Tab triggers use the `nav-word` underline pattern + Mtavruli. Symbol tab falls back to `BrandSymbol`. | `items: readonly HistoryItem[]` |
| `VineyardsMap.tsx` | S | The map section: desktop `map.jpg` / mobile `map-mobile.jpg`, gradient scrim, mobile region list, footer. Delegates interactivity to `VineyardRegionsOverlay`. | `regions`, `activeRegionId?`, `mapImageUrl?`, `mapMobileImageUrl?` |
| `VineyardRegionsOverlay.tsx` | C | Desktop hover/click regions: two `viewBox="0 0 2230 1203" preserveAspectRatio="xMidYMid slice"` SVGs (masked highlight rects + transparent hit-paths) + a positioned region `<nav>`. Highlight `rgba(255,255,255,0.32)`. Both layers share the new-map calibration and the Kakheti/Kvemo Kartli local offsets. | `regions`, `activeRegionId?` |
| `WinesView.tsx` | S | Two modes: **index** (3 category words via `AnimatedCategoryList`) and **category** (left category list + `WineScrollList`). | `categories`, `wines`, `activeCategoryId?` |
| `WineScrollList.tsx` | C | Fixed-height scroll list with CSS fade mask + JS-positioned custom scrollbar thumb (capped at ⅓ track). | `wines`, `categoryId` |
| `AnimatedCategoryList.tsx` | C | `<ul>` that staggers its `<li>`s in **after** `BrandIntro` clears (MutationObserver + `1600ms` fallback); replays on client nav. | `className`, `introFallbackMs?`, `children` |
| `ExperiencesView.tsx` | S | Gastronomy/Winery words via `AnimatedCategoryList`; nothing auto-active. | `experiences` |

---

## 6. VISUAL-TO-CODE MAP  ⭐ (the important one)

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
  gradient scrim. `muted` is also set imperatively via the ref on mount, otherwise React's `muted`
  prop can leave autoplay blocked and show the native play button.
- **Sound:** the video autoplays **muted**. A lower-right icon-only button (`aria-label` toggles
  between `Unmute background video` and `Mute background video`) is the only control that changes
  `.muted`; it calls `video.play()` again when enabling sound and falls back to muted if a browser
  rejects playback. Do **not** restore a global first-click unmute listener: menu and language
  clicks must not unexpectedly start audio.
- **Centered logo:** `/svgs/Product_of_Georgia.svg` (`width 603 height 152`, shown
  `w-[270px] sm:w-[320px] md:w-[338px] lg:w-[400px]`) — **NOT** the wordmark. In an `<h1>`.
- **Top-left burger + top-right ENG/GEO:** `HeaderHero.tsx` (no nav words up here).
- **Bottom nav words (Wines/History/…):** `NavLink` row, `hidden md:flex`. **Mobile hides them.**
- **Bottom contact line:** `SiteFooterMinimal layout="inline"`.
- Data is **static** — CMS edits do **not** change the home page.

### Content header (History/Wines/Vineyards/Experiences top bar)
- **File:** `HeaderContent.tsx` inside `HeaderScrollFrame.tsx`. Grid
  `grid-cols-[auto_1fr_auto] lg:grid-cols-[auto_1fr_auto_1fr_auto]`, `h-16 md:h-24`.
- **Scroll behavior:** transparent over content on mobile, turns `bg-surface-dark` after
  `scrollY>8` (`data-[scrolled=true]`); always dark on `lg` (`lg:sticky`). Some pages pass
  `mobileTransparentControls="light"` (vineyards, wine detail, experience detail) so the
  burger/lang start white over imagery.
- **Center logo:** `Wordmark size="header"` → `/images/Mgaloblishvili-Logo.svg`, widths
  `w-[150px] sm:w-[180px] md:w-[270px] lg:w-[280px]`.

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
  `Reveal`; heading `type-headline`; body `type-body-editorial`. **Tab bar** at the bottom
  (`bg-surface/88 border-t`), triggers reuse the `nav-word` underline (`bg-ink`, `duration-[1420ms]`).
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

### `/vineyards/[region]` — region detail
- **File:** `(content)/vineyards/[region]/page.tsx`. The old hero + 2×2 editorial grid was
  removed. Desktop is now one viewport (`lg:h-svh lg:overflow-hidden`) with a single centered
  composition between `HeaderContent` and `ContentFooter tone="dark"`.
- **Desktop grid:** `lg:grid-cols-[42%_58%]`. The left cell contains `/images/TheSymbol.jpg`,
  the localized region title/subtitle, and the complete `region.body`. The right cell contains
  the shared `/images/vineyard-kakheti.png` for every region for now.
- **Photo sizing/alignment:** the photo wrapper fills the complete 58% right column; do **not**
  re-add `lg:max-w-[851px]` or `lg:justify-self-end`, because those classes create a large empty
  gap between text and image on wide screens. Desktop height remains
  `lg:h-full lg:max-h-[666px]`. The section uses `items-center` and `lg:py-12`, so the photo's
  top and bottom whitespace stays visually balanced between the header and footer. Mobile keeps
  its natural stacked `aspect-[851/666]` layout.
- **Entrance motion:** the photo is wrapped in `IntroAwareHorizontalReveal` and reveals from
  left to right over `1420ms` immediately after `BrandIntro` disappears. A single frosted strip
  (`absolute left-0 w-[15%]`, `bg-white/70 backdrop-blur-md`) uses the same reveal with
  `delayMs={500}`. The previous extra gradient tail was intentionally removed because it looked
  like an unwanted third overlay layer. Reduced motion removes the animation and clip-path.
- The content remains CMS-first through `getResolvedContent(locale)`; slugs still validate with
  `findVineyardRegion(...)` and call `notFound()` on invalid routes.

### `/wines` and `/wines/[category]`
- **File:** `WinesView.tsx`. Index = three `type-category-large` words (Wines/Brandy/Chacha) via
  `AnimatedCategoryList`. Category = left category list + `WineScrollList.tsx` (right).
- **Wine list scroll UX:** `WineScrollList` — fade mask (`.wine-scroll-fade--top/--bottom`,
  top fade only after scrolling), JS thumb on `.wine-scroll-track`; `.wine-list-enter` slide on
  category change. Fixed height `.wine-scroll-area` = `min(54vh,380px)` (`md+`).

### `/wines/[category]/[itemId]` — wine detail
- **File:** `(content)/wines/[category]/[itemId]/page.tsx`. Hero image
  (`/images/wine_page_header.webp` default, `type-display-hero` title). Body section
  `bg-surface/88`: back-link (`type-menu`, `← {categoryLabel}`), `type-headline` name,
  `type-body-editorial` description, and the **grape-origin line** using
  `content.wines.originLabel` (the "Grape origin" label — **static**, not CMS) + `wine.grapeOrigin`.
- **Bottle:** `/images/wine_bottle.png` (`width 308 height 1114`, shown
  `w-[min(70vw,167px)] md:w-[min(48vw,214px)] lg:w-[250px]`). `ContentFooter tone="dark"`.

### `/experiences` and `/experiences/[experience]`
- **Index:** `ExperiencesView.tsx` — Gastronomy/Winery via `AnimatedCategoryList`.
- **Detail:** `(content)/experiences/[experience]/page.tsx`. Hero (`/images/gastronomy.png`
  default) + 2×2 grid (`/images/wine_glass.png`, `/images/people.jpg`) with two
  `ExperienceTextBlock`s + a **clickable static map** (`/images/Map-mgaloblishvili.jpg`) opening
  Google Maps in a new tab. Its footer is an **inline `SiteFooterMinimal`** (this page does **not**
  use `ContentFooter`).
- **Content quirk:** if `winery` has no CMS text sections, it shows **gastronomy's** text.

### Footers (there are two)
- **`SiteFooterMinimal.tsx`** — the visible company + address line. Tones `light`/`dark`, layouts
  `stacked`/`inline`.
- **`ContentFooter.tsx`** — a server wrapper that resolves CMS contact and renders
  `SiteFooterMinimal`; adds the dark overscroll fill. Address text **is** CMS-overridable
  (via `globalSettings.contact.address`); company name is `SITE_CONTACT.company` (static).

### Subtle background video (faint moving texture on light content pages)
- **File:** `SubtleVideoBackground.tsx` in `(content)/layout.tsx`. Grayscale, `opacity-[0.13]`,
  off under reduced motion. It's a real `<video>`, **not** a CSS background — don't convert it.

### Error / 404 screens
- **Files:** `src/app/error.tsx` (client, "Something went wrong" + Try again), `src/app/not-found.tsx`
  ("Page not found" + Return home). Both: dark, centered, `Wordmark size="sm"`, `type-headline`.

---

## 6.5 Reading the breakpoint from a screenshot

Tailwind breakpoints here are the defaults: **base (<640)** · **sm 640** · **md 768** ·
**lg 1024** · **xl 1280**. Use the tells below to infer which one a screenshot is showing, then
target that variant in your prompt. Each tell is a real responsive class copied from source.

| Visual tell | Breakpoint | Source (class · file) |
|---|---|---|
| Content header: nav words flank the logo (left **and** right) vs. only burger · logo · ENG/GEO | words = **≥ lg** · none = **< lg** | nav `hidden … lg:flex`, `lg:grid-cols-[auto_1fr_auto_1fr_auto]` · `HeaderContent.tsx` |
| Content header **bar height**: short ≈64px vs. tall ≈96px | short = **< md** · tall = **≥ md** | `h-16 md:h-24` · `HeaderContent.tsx` |
| Content header **background**: transparent over the hero/map vs. solid `surface-dark` | transparent = **mobile, unscrolled** · solid = **scrolled (any width) OR ≥ lg** | `bg-transparent` / `data-[scrolled=true]:bg-surface-dark` / `lg:bg-surface-dark`, `fixed … lg:sticky` · `HeaderScrollFrame.tsx` |
| Home page: horizontal **row of nav words** across the bottom | present = **≥ md** · absent = **< md** | `hidden w-full md:flex` · `page.tsx` |
| Menu overlay: 4 centered **stacked** links vs. 4 **columns** with vertical dividers + submenu lists | stacked = **< lg** · columns = **≥ lg** | `lg:hidden` vs `hidden … lg:flex` + `grid-cols-4` + divider `… lg:block` · `MenuOverlay.tsx` |
| Region detail: **text then photo** vs. **42/58 text-left / photo-right** | stacked = **< lg** · side-by-side = **≥ lg** | `lg:grid-cols-[42%_58%]` · vineyard region `page.tsx` |
| Experience detail: **one stacked column** vs. **2×2** image/text grid | stacked = **< lg** · grid = **≥ lg** | `grid-cols-1 lg:grid-cols-2` · experience `page.tsx` |
| Wine detail: description **above** the bottle vs. **text-left / bottle-right** two columns | stacked = **< lg** · two-col = **≥ lg** | `grid-cols-1 lg:grid-cols-[minmax(0,440px)_1fr]` · wine detail `page.tsx` |
| Wines category: category words **above** the wine list vs. **words-left / list-right** (+ vertical scroll indicator appears) | stacked = **< md** · side-by-side = **≥ md** | `flex-col md:flex-row` · `WinesView.tsx`; track `hidden … md:block` · `WineScrollList.tsx` |
| Vineyards: **portrait mobile map** (`map-mobile.jpg`) + centered plain region list, page scrolls vs. **interactive hover map** (`map.jpg`) + right-side region list, viewport-locked | mobile map = **< md** · hover map = **≥ md** | `md:hidden` / `md:block` · `VineyardsMap.tsx` + `VineyardRegionsOverlay.tsx`; `md:h-svh md:overflow-hidden` · `vineyards/page.tsx` |
| History: three tab triggers **stacked** (one per row) vs. **three across** in one row | stacked = **< sm** · row = **≥ sm** | `grid-cols-1 sm:grid-cols-3` · `HistoryTabs.tsx` (its panel image/text splits at `lg:grid-cols-2`) |
| History / Wines pages: visible **top gap** below the fixed header vs. content flush to top | gap = **< lg** · flush = **≥ lg** | `pt-16 md:pt-24 lg:pt-0` · those `page.tsx` |

**Combine tells — they narrow a band, not conflict.** Because different tells flip at different
breakpoints (sm / md / lg), one screenshot will usually satisfy tells from more than one breakpoint
at once, which *narrows* the viewport to a range rather than contradicting itself. For example: a
tall header (**≥ md**) + no flanking nav words (**< lg**) + side-by-side Wines category (**≥ md**) +
still-stacked detail grids (**< lg**) together pin the width to **[md, lg)** — a tablet or
resized-window width. The "when tells conflict" rule below applies only to *genuine* disagreement —
the same feature reading as both present and absent, or a screenshot too unclear to read — not to
tells that simply fire at different breakpoints.

**Secondary `md` tell on experience detail pages.** Even while *stacked* (`< lg`), experience
image panels grow at `md`: `h-[272px] md:h-[357px] lg:h-[476px]` (hero bands
`h-[272px] md:h-[374px] lg:h-[442px]`). Vineyard region detail no longer uses this hero/grid
pattern; its mobile photo keeps `aspect-[851/666]`.

**Width sanity-check** — cross-check the inferred breakpoint against a logo's apparent width
(base / sm / md / lg):
- Header wordmark (`Wordmark size="header"` → `Mgaloblishvili-Logo.svg`): **150 / 180 / 270 / 280 px**.
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

- **Project** `iyaoquaj`, dataset `production`. Studio at `/studio` (config `sanity.config.ts`,
  starts with `'use client'`). Studio list structure in `structure.ts`.
- **Read client** (`src/lib/sanity/client.ts`): lazy, **token-less**, `useCdn:false`,
  `perspective:'published'`. `safeFetch` cache = dev `{cache:'no-store'}` / prod
  `{next:{revalidate:60}}`. Returns `null` if no project id (so static fallback kicks in).

### Schema types (`schemaTypes/*.ts`)
Fields are built with `schemaTypes/helpers.ts`: `bilingualString`, `bilingualText`,
`bilingualParagraphs` (array of `{en,ka}`), `bilingualImage` (`hotspot` + `altEn`/`altKa`).
**Georgian fields are validated to reject Mtavruli** (must stay Mkhedruli).

| Type | Singleton? | Doc ID | Editable fields |
|---|---|---|---|
| `globalSettings` | ✅ | `globalSettings` | `contact.address` (bilingual), `contact.phone`, `contact.email` |
| `history` | ✅ | `history` | `items[]` (max 3): `tabLabel`, `heading`, `body[]`, `image`; `sortOrder` read-only |
| `vineyards` | ✅ | `vineyards` | `introHeading`, `intro[]`, `desktopMapImage`, `mobileMapImage` |
| `vineyardRegion` | ✕ collection | `vineyardRegion-<slug>` | `title`, `subtitle`, `bodyBlocks[]`, `images[]`; `slug`/`sortOrder` read-only |
| `wineCategory` | ✕ collection | `wineCategory-<slug>` | `title`; `slug`/`sortOrder` read-only |
| `wineItem` | ✕ collection | `wineItem-<itemId>` | `category` (ref), `sortOrder`, `name`, `grapeOrigin`, `descriptionLines[]`, `details`, `heroImage`, `bottleImage`; `itemId` read-only |
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
   `/vineyards` page is additionally viewport-locked (`md:h-svh md:overflow-hidden`).
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
    `Wordmark size="header"` (150→280px). The **home center** logo is a different asset,
    `Product_of_Georgia.svg` (270→400px). The **loading** logo is `Mgaloblishvili-Logo.svg` sized
    by `.brand-intro__stack` (188→350px).
11. **Region detail `<main>` is `bg-white`;** wine/experience detail panels are `bg-surface/88`.
    If a screenshot shows a pure-white editorial page, it's the region detail.
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
   > typecheck`."
6. **Ask Claude Code to verify** with `pnpm lint` + `pnpm typecheck` + `pnpm build`, and remind it
   the dev server can serve stale CSS.

When unsure whether something is static or CMS-driven, default to telling Claude Code to check
`src/data/content/*` and `src/lib/sanity/adapter.ts` first — that's where the answer lives.
```
