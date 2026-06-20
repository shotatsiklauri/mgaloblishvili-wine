# guide.md — Mgaloblishvili Wine Site (engineering handoff for Codex)

This is the working guide for the **Wine Mgaloblishvili** site. It documents
how the codebase is structured, the conventions we converged on while building
v1 → v2, and the rules an AI agent (Codex) should follow when continuing the
work.

Read this **before** touching code. Then read the project rule files in
`.claude/rules/*` and the root `CLAUDE.md` / `AGENTS.md` — they are the source
of truth and this guide does not override them.

---

## 1. What this project is

A production-quality, bilingual (English / Georgian) marketing site for a
Georgian wine estate. Visual language: editorial, luxury, full-bleed,
restrained motion. Structure inspired by Antinori's Villa Antinori page; visuals
from supplied Mgaloblishvili Illustrator artboards + a Web-content `.docx`.

**It is frontend-heavy.** Server code exists only to support the UI (locale
cookie + content). There is no database, no auth, no external API.

### Stack (do not add to this without explicit approval)

| Concern | Choice |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) |
| UI | **React 19** — Server Components by default |
| Language | **TypeScript**, strict |
| Styling | **Tailwind CSS v4** — CSS-first `@theme` tokens in `globals.css`, **no `tailwind.config.*`** |
| Primitives | `@radix-ui/react-dialog` (menu), `@radix-ui/react-tabs` (history) |
| Motion | `motion` v12 — used sparingly (`Reveal`), most motion is CSS keyframes |
| Class utils | `clsx` + `tailwind-merge` → `cn()` |
| Fonts | `next/font/local` (Inter, Noto Serif Latin) + `next/font/google` (Noto Serif Georgian) |
| Package manager | **pnpm** |

Dependencies are intentionally minimal. **Do not add packages without asking.**

---

## 2. Directory map

```
src/
  app/
    layout.tsx                      # root <html>/<body>, fonts, <BrandIntro/>
    page.tsx                        # "/" hero (video, wordmark, sub-nav, contact)
    globals.css                     # @theme tokens + ALL keyframes/custom classes
    (content)/                      # route group → light/cream content pages
      layout.tsx                    # surface wrapper only
      history/page.tsx
      vineyards/page.tsx            # interactive map
      vineyards/[region]/page.tsx   # region detail
      wines/page.tsx                # category index (Wines/Brandy/Chacha)
      wines/[category]/page.tsx     # category list view
      wines/[category]/[itemId]/page.tsx  # wine detail
  components/
    ui/          # domain-neutral primitives (Button-like atoms)
    layout/      # page chrome (headers, footer, menu)
    features/    # domain-aware feature components (composed from ui/layout)
  data/
    content/{types,en,ka,index}.ts  # bilingual content + selectors + guards
    navigation.ts                   # nav/menu builders (derive labels from content)
    routes.ts                       # ⭐ single typed source of route paths
    site.ts                         # SITE_CONTACT constant
  lib/
    fonts.ts            # next/font config
    locale.ts           # getServerLocale(), isLocale, LOCALE_COOKIE
    locale-actions.ts   # "use server" setLocale()
    utils.ts            # cn(), toMtavruliIfGeorgian()
    focus-ring.ts       # focusRing(tone, offset) helper
```

**Component layering rule:**
- `ui/` = reusable, domain-neutral, accessible primitives (e.g. `NavLink`,
  `Wordmark`, `DecorativeSlash`, `BrandLogoImg`, `Container`, `Reveal`).
- `layout/` = page chrome (`HeaderContent`, `HeaderHero`, `MenuOverlay`,
  `SiteFooterMinimal`, `ContentFooter`, `HamburgerButton`, `LanguageSwitcher`).
- `features/` = domain-aware, composed (`HistoryTabs`, `WinesView`,
  `WineScrollList`, `VineyardsMap`, `VineyardRegionsOverlay`).
- **Routes (`page.tsx`) compose components; they are not component libraries.**

---

## 3. The data layer (the spine of the app)

Everything localized and structural flows through `src/data`. **Components never
hardcode routes or content strings.**

### 3.1 Content (`src/data/content/`)
- `types.ts` — the `SiteContent` shape + ids/unions. Also holds the
  `WINE_CATEGORY_IDS` const, the `WineCategoryId` union derived from it, and the
  `isWineCategoryId` type guard (co-located with the data they describe).
- `en.ts` / `ka.ts` — the actual copy, **lifted verbatim from the source docx**.
  ⚠️ They contain intentional source quirks (e.g. lower-case "kakheti",
  mid-sentence "In", a stray uppercase Georgian letter). **Do not "fix" these**
  without checking the original docx — the file headers say so.
- `index.ts` — the public API:
  - `getContent(locale)` → the single read entry point.
  - `findWine(content, id)`, `findVineyardRegion(content, id)` → safe lookups.
  - re-exports `isWineCategoryId`, types, `WINE_CATEGORY_IDS`.

Components **only** import from `@/data/content` (never a locale file directly).

### 3.2 Routes (`src/data/routes.ts`) ⭐
Single typed source for every path. Builders return the exact strings; adopting
them is always a no-op refactor.

```ts
routes.home / routes.history / routes.vineyards / routes.wines / routes.experiences  // string consts
routes.vineyardRegion(id)   // `/vineyards/${id}`
routes.wineCategory(id)     // `/wines/${id}`
routes.wineItem(cat, item)  // `/wines/${cat}/${item}`
```
**Never** write a route as an inline template string in a component or page.
Add a builder here instead. `routes.ts` imports only *types* from content, so it
is safe to use in client components.

### 3.3 Navigation (`src/data/navigation.ts`)
`buildPrimaryNav(content)`, `buildMenuColumns(content)`,
`buildWineCategories(content)` — all derive labels from `content` and hrefs from
`routes`. Change a label in content → it updates everywhere automatically.

### 3.4 Site constants (`src/data/site.ts`)
`SITE_CONTACT = { company, address }` — the only place the footer text lives.

---

## 4. Locale / i18n model (cookie-driven, server-resolved)

- Cookie `mga-locale` (`"en" | "ka"`), default `en`.
- **Server** reads it: `getServerLocale()` → `getContent(locale)` → pass plain
  data as props into (client) components. **Never read the locale on the client.**
- `LanguageSwitcher` (client) calls the `setLocale` **Server Action**, which
  writes the cookie and `revalidatePath("/", "layout")` so every server-rendered
  string re-renders.
- **Georgian "uppercase" = Mtavruli, done in JS, not CSS.** Use
  `toMtavruliIfGeorgian(text)` from `lib/utils.ts` for label-style text
  (nav labels, menu column titles, tab triggers, back-links). CSS
  `text-transform: uppercase` does **not** reliably map Georgian — do not use it
  for Georgian. Body copy and submenu items stay Mkhedruli (not uppercased).

---

## 5. Styling system & shared helpers

### 5.1 Design tokens — `globals.css` `@theme` (Tailwind v4, CSS-first)
Colors: `--color-surface-dark #05090a`, `--color-surface #f4f4f4`,
`--color-surface-cream #ede7e1`, `--color-ink #0d0d0d`,
`--color-ink-inverse #fff`, `--color-ink-muted #505354`, `--color-accent #c9a96e`.
Fonts: `--font-sans` (Inter), `--font-serif` = Latin Noto Serif → Georgian Noto
Serif fallback stack (the browser picks per glyph). Use tokens
(`bg-surface-dark`, `text-accent`, `font-serif`, …) — **no ad-hoc hex**.

### 5.2 Custom CSS lives in `globals.css` only
All keyframes and project classes are there: `.hero-ui-enter--*`,
`.menu-stagger--*`, `.menu-divider-v`, `.history-tab-trigger`, `.brand-intro*`,
`.no-scrollbar`, `.wine-scroll-fade`, `.wine-scroll-area`, `.wine-scroll-track`,
plus a global `html { scrollbar-width: none }` rule (see §7). There is a
`@media (prefers-reduced-motion: reduce)` block — **keep reduced-motion working.**

### 5.3 Shared helpers — use them, don't re-roll
- `cn(...)` (`lib/utils.ts`) — clsx + tailwind-merge. Use for all conditional
  classes. Relies on tailwind-merge to let a later class override an earlier one
  (e.g. a page passes `after:-bottom-4` to override a primitive's `after:-bottom-3`).
- `focusRing(tone, offset?)` (`lib/focus-ring.ts`) — the standard focus-visible
  ring. New focusable elements call this; do not hand-roll the 5-class chain.
- `toMtavruliIfGeorgian(text)` — see §4.
- Primitives that exist so markup isn't duplicated: `BrandLogoImg` (the logo
  `<img>`), `DecorativeSlash` (the diagonal nav ornament), `ContentFooter` (the
  light-page contact block), `Wordmark`, `Container`.

### 5.4 Layout patterns we standardized
- **Viewport-fit pages** use `h-svh` (or `min-h-svh md:h-svh`) + a `flex flex-col`
  wrapper, `main` as `flex-1 min-h-0`, footer `shrink-0`. History and wines pages
  follow this.
- **Content page skeleton:**
  ```tsx
  <div className="flex min-h-svh flex-col">     {/* or h-svh for fixed */}
    <HeaderContent activeId="..." />
    <main className="...">{/* feature component */}</main>
    <ContentFooter />
  </div>
  ```
- **The content header** (`HeaderContent`) is a **5-zone grid**
  `[burger] [left-nav] [logo] [right-nav] [lang]` with column template
  `auto 1fr auto 1fr auto`. The two `1fr` columns keep the logo geometrically
  centered across EN/KA label widths. **Do not collapse this to a 3-column grid.**

---

## 6. Server / client boundary (strict)

- Default = **Server Component**. Add `"use client"` only at the smallest leaf
  that needs interactivity, and pass it serializable props.
- Current client components (keep the list small): `BrandIntro`,
  `LanguageSwitcher`, `MenuOverlay`, `HistoryTabs`, `WinesView`'s child
  `WineScrollList`, `VineyardRegionsOverlay`, `Reveal`.
- Pattern we use repeatedly: a **server feature** renders the static parts and
  delegates only the interactive island to a client child. Example:
  `VineyardsMap` (server: image, gradient, footer) renders
  `VineyardRegionsOverlay` (client: hover state + SVG shapes + region list).
  Do the same when adding interactivity — don't make a whole page client.
- Never import server-only code into a client component; never read secrets or
  `.env*` in the client. (There are no secrets in this repo today — keep it that
  way.)

---

## 7. Non-obvious things that will bite you (read this)

1. **Scrollbars are hidden site-wide.** `globals.css` sets
   `html { scrollbar-width: none }` + `html::-webkit-scrollbar { display:none }`.
   Scrolling still works (wheel/touch/keyboard). This is intentional/editorial.
   The `/vineyards` page is additionally locked to the viewport (`h-svh
   overflow-hidden`) so it never scrolls at all.
2. **The wine list has a custom scrollbar.** `WineScrollList` renders a
   fixed-height (`.wine-scroll-area` = `min(54vh,380px)`) scroll region with a
   CSS fade mask (`.wine-scroll-fade`) and a **JS-positioned thumb** (capped at
   1/3 of the track). The list is capped *below* the content height on purpose so
   it always scrolls.
3. **SVG-over-image alignment trick.** The vineyards overlay aligns to `map.jpg`
   because the map uses `object-cover object-center` and the inline SVG uses
   `viewBox="0 0 1920 1080"` + `preserveAspectRatio="xMidYMid slice"`. `slice` ==
   `object-cover`, `xMidYMid` == `object-center`. Both fill the same `relative`
   container → 1:1 alignment. If you ever change the map's object-fit, change the
   SVG's `preserveAspectRatio` to match.
4. **Turbopack dev serves stale CSS.** This caused hours of "my change didn't
   appear" confusion. When a CSS/class change seems missing in `pnpm dev`:
   restart the dev server and hard-refresh (Cmd-Shift-R). To *verify* a change is
   real, build (`pnpm build`) and grep the built CSS in `.next/static/chunks/*.css`
   — the production build is never stale. Don't "re-fix" source that's already
   correct.
5. **Kill stray servers before verifying.** A lingering `next start`/`next dev`
   on port 3000 will serve old assets and make you think a change failed. `pkill
   -f next` first.
6. **JS-only changes (state, handlers, inline-style fills)** are not affected by
   the CSS cache and don't need a rebuild to verify logic — only lint/typecheck.
7. **Brand intro overlay** (`BrandIntro`) uses inline `position:fixed; inset:0;
   pointer-events:none; z-index:200` deliberately, plus React `setTimeout`
   unmount, so it can never fall into document flow on a remount. Don't move
   those into pure CSS without testing soft-nav + bfcache replay.

---

## 8. How v1 → v2 was refactored (so you keep the same shape)

v1 was the first visual implementation (lots of screenshot-driven micro-tuning).
v2 was a **controlled, visual-preserving cleanup**. Every change produced
byte-identical output, verified by grepping rendered hrefs + a clean build. The
moves were:

1. **Centralized routes** → created `src/data/routes.ts`; deleted the private
   `ROUTES` record in `navigation.ts`; replaced every inline `/wines/${x}` /
   `/vineyards/${id}` template across pages and feature components with a typed
   builder.
2. **Deduped route-param validation** → one `isWineCategoryId` guard in content,
   imported by both wine routes (was copy-pasted in two files).
3. **Added content selectors** → `findWine` / `findVineyardRegion` removed the
   duplicated `.find()` calls that ran twice per page (`generateMetadata` + body).
4. **Extracted `ContentFooter`** → the identical light-page footer block (5
   copies) became one component.
5. **Stripped narrative comments** earlier in v1 cleanup → kept only "why"
   comments (Mtavruli rationale, brand-intro timing, reduced-motion swaps).
6. **Verification discipline:** `pnpm lint` + `pnpm typecheck` + `pnpm build` +
   grep served HTML/CSS to prove parity. No visual diff was allowed.

**Principle:** v2 work is *pure-logic / structure* improvements that leave the
DOM and CSS output identical. If a "cleanup" would change a single rendered
class, it is not a cleanup — it is a redesign, and needs explicit sign-off.

---

## 9. How to do common tasks (recipes)

### Add a new content route (mirror existing)
1. Add copy to `content/en.ts` + `content/ka.ts` (keep `types.ts` in sync).
2. If it has its own path segments, add builder(s) to `routes.ts`.
3. Create `src/app/(content)/<name>/page.tsx`:
   ```ts
   const content = getContent(await getServerLocale());
   ```
   Mount `<HeaderContent activeId="<name>" />`, your feature component, and
   `<ContentFooter />`. Use the viewport-fit skeleton (§5.4).
4. Dynamic segment? Type params as `Promise<{ … }>`, validate with a guard or a
   `findX()` lookup, and call `notFound()` on miss — **always**.
5. New interactivity → a `"use client"` feature child, not a client page.

### Add a wine / region / category
Just edit `content/{en,ka}.ts`. Nav, menu, list, and detail pages derive from
it. For a new wine-category id, update `WINE_CATEGORY_IDS` in `types.ts`.

### Tweak visuals
Change the smallest thing. Class strings live on the component; tokens live in
`globals.css @theme`; keyframes/custom classes live in `globals.css`. Keep
`focus-visible`, `motion-reduce:`, and `aria-*` behavior intact.

---

## 10. Verification (run before claiming done)

```bash
pnpm lint        # eslint (incl. jsx-a11y, next rules) — must be clean
pnpm typecheck   # tsc --noEmit — must be clean
pnpm build       # production build — must succeed; also catches Tailwind scan misses
pnpm format      # prettier (prettier-plugin-tailwindcss reorders classes)
```
For UI/route changes also: `pnpm build && pnpm start`, then `curl` the routes
(expect 200, invalid params 404) and grep the served HTML/CSS to prove the change
landed. **A real browser pass is still required for anything visual** — see §12.

Do not claim something "passes" or "works" unless you ran the check. State what
you verified and what you did not.

---

## 11. Rules for Codex (hard constraints)

**Always**
- Read `CLAUDE.md`, `AGENTS.md`, and `.claude/rules/*` first; they govern.
- Make the **smallest correct change**. Prefer editing existing patterns over
  inventing new ones.
- Keep the server-first boundary; push `"use client"` to the leaf.
- Route through `routes.ts`, content through `getContent`/selectors, footer text
  through `SITE_CONTACT`.
- Use `cn()`, `focusRing()`, `toMtavruliIfGeorgian()` — don't re-roll them.
- Validate dynamic route params and `notFound()` on miss.
- Keep `pnpm lint` + `pnpm typecheck` + `pnpm build` green.
- Before editing a visual component, **explain why the change is visually safe.**
  If unsure, don't touch it.

**Never (without explicit user approval)**
- Add or upgrade dependencies, or change `next.config.*`, `tsconfig.json`,
  PostCSS, or ESLint config.
- Redesign / restyle. Don't change sizes, spacing, fonts, colors, hover/underline
  behavior, or animations unless that's the explicit task and stays visually
  identical.
- Rewrite `HeaderContent`, `MenuOverlay`, or the wines/vineyards layouts.
- Change routes, route names, or content text.
- Read/edit/commit `.env*` files, hardcode secrets, or move secrets to the client.
- "Simplify" CSS in a way that changes the rendered result.
- Run destructive git commands or push without being asked.

**Working style**
- Small, reviewable diffs. Group related edits; verify; summarize what changed,
  why it's safe, what you verified, and what you intentionally left alone.
- Don't over-trust `pnpm dev` for CSS (§7.4). Verify via build when in doubt.
- Be honest about uncertainty — especially visual correctness you couldn't see.

---

## 12. Known issues / tech debt (status at handoff)

The build is a **valid production bundle** (lint/typecheck/build all green), but
it is **not** fully production-hardened. Open items, roughly prioritized:

1. **`/experiences` 404s** — the primary nav *and* burger menu link to
   `/experiences`, but the route doesn't exist. This is a live, user-facing
   broken link. Fix: build the route, or remove its nav/menu entry.
2. **No error UI** — there is no `error.tsx`, `global-error.tsx`, or styled
   `not-found.tsx`. Runtime errors / 404s show Next's bare defaults.
3. **No tests** — zero Playwright/unit. Nothing guards regressions. Add at least
   a route-200 + nav + locale-switch + click-through smoke suite.
4. **Hardcoded `"Grape origin"`** label in the wine detail page is English-only —
   a localization bug (everything else there is localized). Move it to content.
5. **Build needs network** — Georgian font uses `next/font/google`; offline/CI
   builds fail. Self-host it like the Latin fonts for hermetic builds.
6. **`public/images/wine_page_header.png` is ~6.9 MB** — compress the source.
7. **No live browser QA done in-session** (no Chrome for Playwright here). Map
   overlay alignment, hover/click, and responsive behavior are logically correct
   but visually unconfirmed — verify in a browser.
8. Minor: `/vineyards` `h-svh overflow-hidden` can clip on very short viewports;
   global scrollbar-hide is an intentional a11y/UX tradeoff.

---

## 13. One-paragraph summary for a cold start

Server-first Next.js 16 site. All routes come from `data/routes.ts`, all copy
from `data/content` via `getContent(locale)`, all nav/menu from `data/navigation`.
Locale is a cookie resolved on the server; Georgian uppercase uses the
`toMtavruliIfGeorgian` JS helper, never CSS. Styling is Tailwind v4 tokens in
`globals.css` plus shared helpers (`cn`, `focusRing`). Interactivity is isolated
to small `"use client"` islands. Verify with lint + typecheck + build (the dev
server lies about CSS). Don't change the look, don't add deps, don't break the
server/client boundary, and validate + `notFound()` every dynamic route. Known
must-fixes before "production": the `/experiences` broken link, error/not-found
boundaries, the `"Grape origin"` localization, font self-hosting, and a smoke
test suite.
