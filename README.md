# wine_project

Phase 1 foundation for the Mgaloblishvili wine estate site.

Implementation of pages and design analysis happen in later, separately approved phases.

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript (strict)
- Tailwind CSS v4 (PostCSS plugin)
- ESLint (`eslint-config-next`, flat config)
- Prettier + `prettier-plugin-tailwindcss`
- Local fonts: Inter (sans), Noto Serif (serif), loaded via `next/font/local`
- pnpm

## Folder layout

```
src/
  app/
    fonts/                # local .ttf source (Inter, Noto Serif)
    layout.tsx            # root layout, font variables
    page.tsx              # placeholder home
    globals.css           # Tailwind + theme tokens
  components/
    ui/                   # primitives (empty)
    features/             # domain components (empty)
    layout/               # shell, nav (empty)
  lib/
    fonts.ts              # next/font/local config
public/
  images/  icons/  og/
design-source/            # original design assets (PDF, .ai, report)
Fonts/                    # authoritative font sources
```

## Scripts

```bash
pnpm dev            # start dev server on http://localhost:3000
pnpm build          # production build
pnpm start          # serve production build
pnpm lint           # ESLint
pnpm lint:fix       # ESLint --fix
pnpm typecheck      # tsc --noEmit
pnpm format         # Prettier write
pnpm format:check   # Prettier check
```

## Run locally

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Not yet wired (deferred to later phases)

- Playwright E2E (config + tests)
- shadcn/ui primitives (`cn()` helper, components)
- Animation library (e.g. `motion`)
- Form stack (`react-hook-form`, `zod`)
- Design tokens beyond the placeholder background/foreground
- Actual page implementation based on `TASK_Mgaloblishvili.md` and `design-source/`

## Conventions

See `CLAUDE.md` and `.claude/rules/*.md` for project standards (TypeScript, React,
Tailwind, accessibility, security, testing, workflow).
