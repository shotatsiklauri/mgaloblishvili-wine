# CMS / Admin Implementation — Code Review Report

**Date:** 2026-06-19
**Reviewer:** Senior audit (Opus) — read-only, no fixes applied
**Scope:** Sanity Studio, client/query/adapter layer, content API, CMS-migrated pages, seed script, revalidation, Studio protection, Next.js/security best practices, docs.

Verification run during audit:

| Check | Result |
|---|---|
| `pnpm lint` | ✅ No issues |
| `pnpm typecheck` | ✅ Clean |
| `pnpm build` | ✅ Succeeds; all 10 routes + `/api/revalidate` + Proxy present |
| `.claude/tools/doctor.sh` | ✅ All required + optional checks pass |

---

## 1. Executive Summary

**Verdict: PASS WITH WARNINGS**

The CMS integration is well-architected and production-safe in its core guarantees: secrets are never exposed to the client, every CMS-driven page degrades gracefully to static content when Sanity is empty/unreachable, the studio is hardened against duplicate singletons, and `/studio` is gated by Basic Auth with a fail-closed production branch. There are **no critical blockers**. Build, lint, and typecheck are all green.

The warnings are mostly **latent correctness and best-practice issues** that do not bite today (because the CMS is still empty and pages fall back to static), but will surface once content is actually populated:

- The **experiences adapter flattens two text sections into one**, which will visibly change the `/experiences/[experience]` layout once CMS data exists.
- The **revalidation webhook is largely redundant** given the current rendering model (dynamic pages + an uncached Sanity client), so it does not do what it appears to.
- The **seed script's `createOrReplace` will overwrite client edits** if re-run after handoff.
- The **menu overlay reads static content**, so CMS edits to region/category/experience labels won't propagate to the navigation.

None of these block a first production deploy with an empty-or-seeded CMS, but several should be resolved before the client begins editing in earnest.

---

## 2. Critical Issues

**None.**

No issue in this implementation can cause a build failure, a runtime crash on a configured-but-empty CMS, a secret leak, or an unauthenticated `/studio` in production. The defensive chain (`safeFetch` → `adaptCmsToContent` → `getResolvedContent` → static fallback) is consistently applied and each link is wrapped against throwing.

---

## 3. Security Issues

Overall security posture is **good**. No secret is bundled to the client; the only `NEXT_PUBLIC_*` values are `projectId`/`dataset`/`apiVersion`, none of which are sensitive. The write token, revalidate secret, and studio credentials are all server-only.

### S1 — `revalidate` route accepts `GET` with secret in query string *(Low)*
`src/app/api/revalidate/route.ts` exposes both `GET` and `POST`, and accepts the secret via `?secret=`. A secret in a URL can leak into server access logs, proxy logs, browser history, and `Referer` headers. The header form (`x-sanity-revalidate-secret`) is safe; the query/GET form is the weak path, and `SANITY_SETUP.md` actively recommends it.
**Why it matters:** low impact (worst case an attacker can force a re-render — no data exposure), but it normalizes putting a secret in a URL.
**Recommendation:** prefer the header form in docs; consider dropping `GET` or at least not advertising the query-param form.

### S2 — Non-constant-time secret/credential comparison *(Low / theoretical)*
Both `src/app/api/revalidate/route.ts` (`providedSecret !== expectedSecret`) and `src/proxy.ts` (`providedUser === user && providedPassword === password`) use plain string equality.
**Why it matters:** timing attacks against these are impractical over a network for this threat model, and the payoff (trigger a revalidation / brute-force a studio gate that still sits in front of Sanity's own login) is low. Noting for completeness, not urgency.

### S3 — Basic Auth relies on HTTPS in deployment *(Low — deployment note)*
`src/proxy.ts` Basic Auth sends base64 (not encrypted) credentials. This is standard and fine over HTTPS, but the docs don't state the HTTPS requirement.
**Why it matters:** if `/studio` is ever reachable over plain HTTP, studio credentials are sent in the clear.
**Recommendation:** add a one-line "serve over HTTPS only" note to the studio-protection docs.

### S4 — `src/lib/sanity/client.ts` lacks `import "server-only"` *(Low)*
The implementation plan specified `client.ts — @sanity/client singleton (import "server-only")`; the guard is absent. The client carries **no token**, so a bundle leak would expose nothing sensitive — this is hygiene, not a live vulnerability. It would, however, catch a future mistake where someone imports the fetch client into a Client Component.

**No issues found** with GROQ injection (queries are static; `safeFetch` params are parameterized and no user input reaches them), CORS/domain setup, or `next.config.ts` image remote patterns (`cdn.sanity.io` only, `https`).

---

## 4. Correctness Issues

### C1 — Experiences: two CMS-able sections collapse into one rendered block *(Medium, latent)*
`src/lib/sanity/adapter.ts` → `adaptExperiences()` maps `bodyBlocks[]` into a **single** `ExperienceSection` (`heading: paragraphs[0]`, `body: paragraphs.slice(1)`). But `src/app/(content)/experiences/[experience]/page.tsx` renders `firstSection` **and** `secondSection` in a 2×2 editorial grid. With CMS data there is only ever one section, so `secondSection` is `undefined` and that grid cell renders an empty `<div>`.
**Why it matters:** the static gastronomy page shows two headed text blocks; the CMS-populated version will show one block with the second heading demoted into body text, and an empty cell. This is a visual/content regression that appears the moment experiences are populated. Today it's masked because the CMS is empty (static fallback renders). The seed script also flattens this, so seeding then "going live" on experiences would expose it.

### C2 — Revalidation webhook is largely ineffective given the rendering model *(Medium, best-practice)*
All content routes are **dynamic** (`ƒ` in build output) because `getServerLocale()` calls `cookies()`. They re-render and re-fetch on every request. The Sanity read client (`@sanity/client`) uses its own HTTP layer, not Next's instrumented `fetch`, so results are **not** in the Next Data Cache and are **not** associated with any path/tag. Therefore `revalidatePath()` in `src/app/api/revalidate/route.ts` has little to no effect — there is no cached render to purge.
**Why it matters:** the webhook reads as the freshness mechanism, but freshness actually comes from (a) per-request dynamic rendering and (b) Sanity's own CDN auto-purge on publish. The endpoint isn't harmful, but it's misleading and could create false confidence. The implementation plan's intended design (`revalidateTag('siteContent')` + `revalidate = 60` ISR) was **not** implemented; path-based was substituted but the pages aren't cacheable for it to act on.
**Recommendation:** either (a) make content pages cacheable (move locale off `cookies()` or wrap fetches with `{ next: { tags: [...] } }`) and switch to `revalidateTag`, or (b) keep as-is but document that it's a no-op safety belt and freshness is request-time.

### C3 — `adaptCmsToContent` merges per-section all-or-nothing *(Low)*
For each section the merge is `cms.length > 0 ? cms : staticFallback` (e.g. `wines.items`). A **partial** migration (say 10 of 16 wines created in CMS) would use only the 10 CMS wines and silently **drop** the 6 static ones.
**Why it matters:** safe under the intended "seed everything, then edit" workflow (the seed creates the full set), but fragile if anyone hand-creates a subset. Worth a comment at minimum.

### C4 — History items have no `max(3)`; a 4th item produces a duplicate id *(Low)*
`schemaTypes/history.ts` relies only on a description ("Do not add or remove items") with no `Rule.max(3)`. The adapter maps positionally: `HISTORY_IDS[i] ?? 'encounter'`. A 4th item → `id: 'encounter'` again → duplicate Radix Tab `value` and duplicate React `key` in `HistoryTabs`, breaking tab behavior.
**Why it matters:** low likelihood (client is told not to), but the schema doesn't enforce what the adapter assumes.

### C5 — Image alt text is collected in CMS but never rendered *(Low, accessibility)*
Every schema image carries `altEn`/`altKa`, and the seed uploads them, but `sanityImageUrl()` extracts only the URL and **all** frontend `<Image>` tags use `alt=""`. The client can fill alt text that goes nowhere.
**Why it matters:** either the images are decorative (then the alt fields are dead weight and mildly misleading to the editor) or they're meaningful (then `alt=""` is an a11y gap, against `.claude/rules/accessibility.md`). Pick one. Given the editorial design, decorative is defensible — but then the fields shouldn't invite input.

### C6 — Menu overlay / nav labels don't reflect CMS edits *(Low–Medium)*
`HeaderContent.tsx` and `HeaderHero.tsx` build menu columns via `getContent()` (synchronous static), not `getResolvedContent()`. `buildMenuColumns()` sources region titles, wine category labels, and experience titles from static content. If a client edits e.g. a wine category label or experience title in the CMS, the page updates but the **menu** still shows the static label.
**Why it matters:** content divergence between nav and page. Top-level nav (History/Vineyards/Wines/Experiences) is intentionally static and fine; the sub-entry labels are the exposure. Likelihood is modest (these are mostly place/category names), but it's a genuine inconsistency.

### C7 — Wine detail doesn't verify the item belongs to the URL category *(Low, pre-existing)*
`src/app/(content)/wines/[category]/[itemId]/page.tsx` validates the category slug and finds the wine by id, but never checks the wine is actually in that category. `/wines/brandy/saperavi` renders Saperavi. This predates the CMS work (same in the static design) and isn't a regression — noting for completeness.

**Confirmed correct:** `getContent()` stayed synchronous; `getStaticContent`/`getCmsContent`/`getResolvedContent` are clean and each falls back safely; `generateStaticParams()` in both dynamic routes uses **static** content (build-safe, CMS-independent); `generateMetadata()` uses `getResolvedContent` with title fallback; invalid slugs `notFound()` correctly; per-field image fallback (`cmsUrl ?? "/images/…"`) is consistent across history, vineyards, wines, experiences; the winery `hasCmsSections` gate correctly preserves the gastronomy-text behavior.

---

## 5. Code Quality Issues

### Q1 — Adapter uses hand-written Sanity types instead of TypeGen *(Low)*
`src/lib/sanity/adapter.ts` defines ~10 `SanityX` types by hand. The plan called for `sanity.types.ts` via `pnpm sanity:typegen`. The hand types are reasonable and `unknown`-free, but they can drift from the schema silently (nothing ties them to `schemaTypes/`). TypeGen would make the query/schema contract enforced.

### Q2 — Over-fetching on every page render *(Low, performance)*
Each content page calls `getResolvedContent()` → `allContentQuery`, which pulls **all** sections (history + vineyards + wines + all 16 wines + experiences + global) even on, say, `/history`. Separately, `ContentFooter`/`VineyardsMap` call `getResolvedContact()` → a **second** round-trip to `globalSettingsQuery`, whose data is already inside `allContentQuery` but unused by the page. So a typical content page does 2 Sanity requests and discards most of the first. Fine at this site's scale; worth knowing.

### Q3 — Stale comments / plan divergence *(Low, maintainability)*
- `src/lib/sanity/adapter.ts` header still says *"Not yet wired to pages. Used by getResolvedContent() in Phase 4"* and *"TypeGen is not yet run (Phase 3)"* — both stale; the adapter is wired and in use.
- `CMS_IMPLEMENTATION_PLAN.md` still says **"CMS Choice: Sanity v3"** (actual: v6 studio / v13 next-sanity), prescribes `revalidateTag`/ISR (not implemented), and `import "server-only"` (not present). As a future-reference doc it now misleads.

### Q4 — `proxy.ts` / `revalidate` duplicate the "read secret from header or query" idea *(Trivial)*
Minor, not worth abstracting — noting only so it isn't "fixed" into premature shared code.

No issues with naming, no `any`, no unsafe casts beyond the single well-contained `item as { schemaType?: string; templateId: string }` in `sanity.config.ts` (which is appropriate given Sanity's loose `TemplateItem` type).

---

## 6. Recommended Improvements

### Must fix before production
*(Only if the corresponding content will be populated at launch.)*
- **C1 — Experiences two-section flattening.** If experiences will be CMS-populated at launch, fix the adapter↔page contract first; otherwise leave experiences on static fallback and defer.
- **Confirm the seed has not been (and will not be) re-run after the client starts editing** (see O1 below) — operational guardrail, not code.

### Should fix soon
- **C2 — Decide the caching/revalidation story.** Either make pages cacheable + `revalidateTag`, or document the webhook as a request-time safety belt. Avoid leaving it implying behavior it doesn't have.
- **S1 — Stop recommending the secret-in-URL form;** prefer header, consider removing `GET`.
- **S4 — Add `import "server-only"` to `client.ts`** (and `queries.ts`/`adapter.ts`/`contact.ts` as appropriate).
- **C6 — Make menu sub-entry labels CMS-aware** (or explicitly document that nav labels are static by design and won't track CMS edits).
- **Q1 — Run `pnpm sanity:typegen`** once a project is connected and replace the hand-written adapter types.

### Nice to have
- **C3 / C4** — add `Rule.max(3)` to history items (and similar caps where cardinality is fixed); add a short comment on the all-or-nothing section merge.
- **C5** — either render the CMS alt text or remove the alt fields to match the decorative-image reality.
- **Q2** — drop the separate `getResolvedContact()` round-trip by reusing the `globalSettings` already present in `allContentQuery`, and/or split `allContentQuery` per route.
- **Q3** — refresh the stale adapter header comment and add a "Status / divergences from this plan" note to `CMS_IMPLEMENTATION_PLAN.md`.
- **S3** — add an HTTPS-only note to the studio-protection docs.

### Operational (not code)
- **O1 — Seed re-run overwrites client edits.** `scripts/seed-sanity.ts` uses `createOrReplace`, which replaces whole documents. Re-running after the client has edited content in Sanity will silently clobber their work. The script is idempotent against the *static source*, not against *live edits*. Strengthen the `SANITY_SETUP.md` warning to: "initial population only — never run against a dataset the client has begun editing."

---

## 7. Safe Implementation Plan

Each item below is independently implementable. None requires touching the others. Risk levels reflect blast radius on the running site.

| # | Fix | Files likely involved | Risk | Independent? | Verify with |
|---|---|---|---|---|---|
| C1 | Experiences two-section fidelity | `schemaTypes/experienceItem.ts` (model two headed blocks), `src/lib/sanity/adapter.ts` (`adaptExperiences`), `scripts/seed-sanity.ts` (seed both sections) | **Medium** — schema + adapter + page contract; touches a CMS-able section | Yes | `pnpm lint && pnpm typecheck && pnpm build`; visually diff `/experiences/gastronomy` static vs seeded |
| C2 | Caching/revalidation correctness | `src/lib/sanity/client.ts` (fetch cache opts/tags), `src/data/content/index.ts`, `src/app/api/revalidate/route.ts`, possibly locale handling | **Medium–High** — changes rendering/caching mode; test all content routes | Yes (but verify each route) | `pnpm build` (watch ○/ƒ markers change), manual publish→refresh test |
| S1 | Header-only revalidate secret; drop/curtail GET | `src/app/api/revalidate/route.ts`, `SANITY_SETUP.md` | **Low** | Yes | curl: header 200, query/GET rejected or removed |
| S4 | `import "server-only"` guards | `src/lib/sanity/client.ts` (+ `queries.ts`/`adapter.ts`/`contact.ts`) | **Low** | Yes | `pnpm build` (fails loudly if any client component imports them) |
| C6 | CMS-aware menu labels | `src/components/layout/HeaderContent.tsx`, `HeaderHero.tsx`, `src/data/navigation.ts` | **Medium** — header is shared and currently sync; making it async needs care with the server/client boundary and BrandIntro | Yes | `pnpm build`; visual check menu vs page labels |
| Q1 | TypeGen | `package.json` (already has `sanity:typegen`), new `sanity.types.ts`, `src/lib/sanity/adapter.ts` | **Low** (types only, no runtime) | Yes (needs a connected project) | `pnpm sanity:typegen && pnpm typecheck` |
| C3/C4 | Section caps + merge comment | `schemaTypes/history.ts` (+others), `src/lib/sanity/adapter.ts` | **Low** | Yes | `pnpm typecheck`; add a 4th history item in a scratch dataset and confirm validation blocks it |
| C5 | Alt text: render or remove | `src/lib/sanity/adapter.ts` + page `<Image alt>` props, **or** `schemaTypes/helpers.ts` | **Low** | Yes | `pnpm build`; a11y spot-check |
| Q2 | Remove duplicate contact fetch / split query | `src/lib/sanity/contact.ts`, `src/data/content/index.ts`, `src/lib/sanity/queries.ts` | **Low–Medium** | Yes | `pnpm build`; confirm footer still resolves CMS/static |
| Q3 | Comment/doc refresh | `src/lib/sanity/adapter.ts`, `CMS_IMPLEMENTATION_PLAN.md` | **None** (docs) | Yes | n/a |
| O1 | Strengthen seed warning | `SANITY_SETUP.md` | **None** (docs) | Yes | n/a |
| S3 | HTTPS note | `SANITY_SETUP.md` | **None** (docs) | Yes | n/a |

### Suggested sequencing
1. **Docs-only, zero-risk first:** Q3, O1, S3 (and S1's doc half).
2. **Low-risk code:** S4, C3/C4, C5, Q1 — each a small, isolated change with a cheap verification.
3. **Decide intent, then implement:** C2 (caching model) and C6 (menu freshness) and C1 (experiences) are the three that change real behavior; do them deliberately, one per PR, with a visual check. C1 only matters if experiences go live on CMS at launch.

---

*End of report. No source files were modified; only this report was created.*
