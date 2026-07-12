# Sanity Studio Setup

## Status

CMS integration is implemented for History, Vineyards, Wines, Experiences, and Global
Settings/contact text, each with a static fallback when Sanity is empty or unreachable.
Studio is hardened with a singleton structure (Global Settings / History / Vineyards open as
single documents; duplicate-creation is disabled for them). A seed script exists to populate
Sanity from current static content (see below) but has not been run against any project yet.
A revalidation webhook endpoint exists at `/api/revalidate` so Studio publishes can refresh the
live site without waiting for the cache to expire. `/studio` is protected by an outer HTTP Basic
Auth gate (`src/proxy.ts`) — see "Protecting the Studio Route" below.

## Required Environment Variables

Create a `.env.local` file at the project root with these values:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_WRITE_TOKEN=your_write_token_here
SANITY_REVALIDATE_SECRET=your_own_random_string_here
```

- `NEXT_PUBLIC_SANITY_PROJECT_ID` — found in your Sanity project dashboard at sanity.io/manage
- `NEXT_PUBLIC_SANITY_DATASET` — `production` unless you created a custom dataset name
- `NEXT_PUBLIC_SANITY_API_VERSION` — use today's date in `YYYY-MM-DD` format (e.g. `2024-06-18`)
- `SANITY_API_WRITE_TOKEN` — an **Editor**-permission token from sanity.io/manage → API → Tokens.
  Only required to run the real seed script below. **Never** prefix it with `NEXT_PUBLIC_` and
  never commit it — it is a server/script-only secret.
- `SANITY_REVALIDATE_SECRET` — any random string you generate yourself (e.g.
  `openssl rand -hex 32`). Shared between this app and the Sanity webhook config below. **Never**
  prefix it with `NEXT_PUBLIC_` and never commit it.
- `STUDIO_AUTH_USER` / `STUDIO_AUTH_PASSWORD` — a simple username/password pair that gates access
  to `/studio` itself (separate from your Sanity account login). Pick any values, e.g.
  `STUDIO_AUTH_USER=studio` and `STUDIO_AUTH_PASSWORD=` + `openssl rand -hex 16`. **Never** prefix
  either with `NEXT_PUBLIC_`, never commit real values, and never reuse a password from anywhere
  else.

## How to Open the Studio

1. Add the environment variables to `.env.local` (see above)
2. Run the dev server: `pnpm dev`
3. Open `http://localhost:3000/studio`
4. Sign in with your Sanity account when prompted

The Studio is served from the embedded Next.js route at `/studio`. No separate Sanity Studio process is needed.

## Seeding Content from Static Files

`scripts/seed-sanity.ts` is an **initial-population tool**. It writes the site's current static
content (`src/data/content/en.ts`, `ka.ts`, `src/data/site.ts`) and uploads the matching images
from `public/images/` into Sanity using stable, predictable document IDs (`globalSettings`,
`history`, `vineyards`, `vineyardRegion-kakheti`, `wineItem-saperavi`, etc.). It never deletes
anything and never touches a document type it doesn't know about.

> **Note on IDs:** stable document IDs use a hyphen (`wineCategory-wines`), never a dot. Sanity
> treats a dot in a document `_id` as a *private* path (`drafts.`/`versions.` style), and private
> documents are invisible to the token-less published client the frontend uses — so a dotted ID
> would publish "successfully" yet never appear on the site. Keep seed IDs dot-free.

> ⚠️ **The seed uses `createOrReplace`, which overwrites whole documents.** It is idempotent against
> the *static source* (re-running with no static changes reproduces the same documents), but it is
> **destructive to live CMS edits**: re-running after the client has edited content in Studio will
> silently overwrite their work with the static baseline. **Never run `pnpm sanity:seed` against a
> dataset the client has already started editing** — unless you are deliberately resetting that
> content back to the static baseline.

**Dry run (safe, default — writes nothing):**

```
pnpm sanity:seed:dry-run
```

Prints every document that would be created/updated and every image that would be uploaded,
without contacting Sanity's write API at all.

**Real seed (writes to your configured dataset):**

```
pnpm sanity:seed
```

Requires `SANITY_API_WRITE_TOKEN` to be set — the script fails immediately with a clear message
if it's missing. It also fails immediately if `NEXT_PUBLIC_SANITY_PROJECT_ID` or
`NEXT_PUBLIC_SANITY_DATASET` are not set (for both dry run and real run).

> ⚠️ **Only run `pnpm sanity:seed` against the dataset you actually intend to populate.**
> Double-check `NEXT_PUBLIC_SANITY_DATASET` in `.env.local` before running it — it will write to
> whatever project/dataset your env vars point at. There is no separate "production"
> confirmation prompt.

**Known limitations of the seed script:**

- The winery experience's text sections are deliberately left empty by the seed. The frontend
  shows gastronomy's text on the winery page until winery's own CMS sections are populated; seeding
  winery's static text would silently change that behavior. Gastronomy is seeded with both of its
  text sections (see "Experience text sections" below).
- Several images (region photos, wine bottle/hero photos, experience photos) are the *same*
  file attached to every document in that collection, matching what the static site renders
  today 1:1. Each underlying file is uploaded once and reused, not duplicated per document.
- `globalSettings.contact.phone`/`email` and `experienceItem.mapUrl` are left unset — there is no
  static source value for them today.

### Experience text sections

Each experience page (`/experiences/gastronomy`, `/experiences/winery`) renders **two** editorial
text blocks beside the photos. The `experienceItem` schema models this directly: a **Text Sections**
array where each entry has its own bilingual **Heading** and **Body Paragraphs**. Add up to two
sections — the first fills the upper text cell, the second the lower one.

- **Gastronomy** is seeded with both of its sections, so a seeded Gastronomy page renders exactly
  like the static one.
- **Winery** is seeded with **no** sections on purpose. While Winery has no sections, the page falls
  back to showing **Gastronomy's** text (the original design). The moment an editor adds one or more
  sections to the Winery document in Studio, the page switches to Winery's own text. To revert,
  delete Winery's sections again.

**Schema correction note:** earlier drafts stored experience text as a single flat `bodyBlocks`
paragraph list, which the page could only render as one block (leaving the second cell empty). That
field has been replaced by the structured `sections` array. The adapter still *reads* the old
`bodyBlocks` shape as a fallback so nothing crashes, but any old test content should be **reseeded**
(`pnpm sanity:seed`) or re-entered using the new Text Sections field to get the correct two-block
layout.

## Revalidation Webhook

When content is published in Studio, Sanity can call `/api/revalidate` so the live site picks up
the change immediately instead of waiting for the page's normal cache lifetime.

**Endpoint:** `POST /api/revalidate`. A `GET` form and a `?secret=` query param are also accepted,
but **only for convenience during local testing** — see the security note below.

**Auth:** requires `SANITY_REVALIDATE_SECRET`.

> **Production: use `POST` with the secret in the `x-sanity-revalidate-secret` header.**
> Do **not** put the secret in the URL (`?secret=`) in production — secrets in URLs leak into
> server access logs, proxy logs, browser history, and `Referer` headers. The query-param and
> `GET` forms exist only to make local `curl` testing quick; treat them as local-only.

The Sanity fetch layer (`src/lib/sanity/client.ts`) calls the Sanity client directly and doesn't
attach Next.js cache tags, so this endpoint uses `revalidatePath` rather than `revalidateTag`. It
ignores the webhook payload's contents and simply revalidates every known CMS-driven path on
every call — `/history`, `/vineyards`, `/wines`, `/experiences`, every vineyard region, wine
category, wine item, and experience page (paths come from the static fallback content, not a live
CMS fetch, so this works even if Sanity is down).

### Configuring the webhook in Sanity

1. Go to sanity.io/manage → your project → API → Webhooks → **Create webhook**
2. **Name:** e.g. "Next.js revalidate"
3. **URL:** `https://your-deployed-domain.com/api/revalidate` — **no secret in the URL.**
4. **Dataset:** the dataset this app reads from (e.g. `production`)
5. **Trigger on:** Create, Update, Delete (all three — so unpublishing/deleting content also
   refreshes the site back to its static fallback)
6. **HTTP method:** POST
7. **HTTP Headers:** add `x-sanity-revalidate-secret: YOUR_SANITY_REVALIDATE_SECRET` (this is how
   the secret is passed in production — not the URL)
8. Leave **Filter**/**Projection** empty — the endpoint doesn't read the payload
9. Save, then use Sanity's "Send test trigger" button to confirm it returns `200`

### Testing locally with curl

Start the dev server (`pnpm dev`), then:

```bash
# Missing/invalid secret — should fail with 401
curl -i -X POST "http://localhost:3000/api/revalidate"
curl -i -X POST "http://localhost:3000/api/revalidate" -H "x-sanity-revalidate-secret: wrong"

# Valid secret — should succeed with 200 and a list of revalidated paths
curl -i -X POST "http://localhost:3000/api/revalidate" \
  -H "x-sanity-revalidate-secret: YOUR_SANITY_REVALIDATE_SECRET"

# Local testing only — the query-param / GET forms (never use these in production,
# the secret ends up in logs and history):
curl -i -X POST "http://localhost:3000/api/revalidate?secret=YOUR_SANITY_REVALIDATE_SECRET"
```

A successful response looks like:

```json
{ "success": true, "revalidated": ["/history", "/vineyards", "..."] }
```

> This webhook is purely an optimization. The site never depends on it: every CMS-driven page
> already falls back to static content if Sanity is unreachable, and pages still revalidate
> naturally over time even if the webhook is never configured or temporarily fails.

## Protecting the Studio Route

`src/proxy.ts` (Next.js 16's middleware convention — see its file header) adds an outer HTTP
Basic Auth gate in front of `/studio` and every path beneath it (`/studio/structure`, etc.). This
is **not** a replacement for Sanity's own login — it's a simple extra lock on the front door so
the Studio shell isn't publicly reachable at all. After Basic Auth passes, Sanity Studio loads
normally and you still sign in with your Sanity account exactly as before.

**Routes affected:** only `/studio` and `/studio/*`. Every other route — the public website
pages, `/api/revalidate`, images, and Sanity's own CDN — is untouched and stays public.

**Behavior:**
- **Both `STUDIO_AUTH_USER` and `STUDIO_AUTH_PASSWORD` set:** `/studio` requires Basic Auth.
  Missing or wrong credentials get a `401` with a `WWW-Authenticate` header (your browser will
  show its native login prompt). Correct credentials let the request through to Studio.
- **Vars missing, `NODE_ENV=development`:** `/studio` is left open so local setup isn't blocked.
- **Vars missing, `NODE_ENV=production`:** `/studio` returns a `500` explaining the auth vars are
  missing — it is never silently exposed in production.

> ⚠️ **Serve `/studio` over HTTPS in production.** HTTP Basic Auth sends the username and password
> base64-encoded (not encrypted), so over plain HTTP they can be read in transit. Any real
> deployment (Vercel and similar default to HTTPS) is fine; just don't expose `/studio` over
> bare HTTP. Remember this gate is only the **outer** lock — after it passes, Sanity Studio still
> requires its own Sanity account login.

### How to test

```bash
# Dev, no STUDIO_AUTH_* vars set — should load without a prompt
pnpm dev
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/studio"   # 200

# With STUDIO_AUTH_USER / STUDIO_AUTH_PASSWORD set in .env.local, restart pnpm dev, then:

# No credentials — should be rejected
curl -s -i "http://localhost:3000/studio" | grep -E "HTTP|WWW-Authenticate"   # 401 + WWW-Authenticate

# Wrong credentials — should be rejected
curl -s -o /dev/null -w "%{http_code}\n" -u "studio:wrongpass" "http://localhost:3000/studio"   # 401

# Correct credentials — should load
curl -s -o /dev/null -w "%{http_code}\n" -u "studio:YOUR_PASSWORD" "http://localhost:3000/studio"   # 200

# Normal pages stay public, unaffected
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/history"   # 200, no auth needed

# /api/revalidate keeps using its own secret, unaffected by Basic Auth
curl -s "http://localhost:3000/api/revalidate"
```

> Testing the production (`NODE_ENV=production`) branches requires `pnpm build && pnpm start`
> (`next dev` always runs as development). A production build with no `STUDIO_AUTH_*` vars set
> should return `500` for `/studio` rather than exposing it.

## Known Limitations (to fix in later phases)

- The site's root layout (`BrandIntro` overlay, Tailwind global styles) wraps the studio route.
  The BrandIntro plays briefly when navigating to `/studio`. This will be addressed when
  the studio route gets its own layout segment.
