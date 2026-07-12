# TASK.md - Mgaloblishvili Winery Website

## 1. Project Goal

Build a production-quality website for **Wine Mgaloblishvili LLC**.

The website should use the **Antinori Villa Antinori page** as the interaction/content-structure reference, but it must visually follow the supplied **Mgaloblishvili Illustrator design**.

Reference site:
- https://www.antinori.it/it/tenuta/tenute-antinori/villa-antinori/

Important: do **not** copy Antinori copyrighted images, brand assets, or long-form text. Use the reference site only for layout behavior, page rhythm, navigation model, section sequencing, and interaction ideas. The final site should use Mgaloblishvili brand content, typography, colors, and assets.

---

## 2. Source Design Files

Uploaded design package:

- `Mgaloblishvili-Web.ai`
- `Mgaloblishvili-Web Report.txt`
- `Inter-VariableFont_opsz,wght(1).ttf`
- `NotoSerif-VariableFont_wdth,wght(1).ttf`

Design document facts:

- Color mode: RGB
- Color profile: sRGB IEC61966-2.1
- Ruler units: pixels
- Artboard size: 1440px x 900px
- Missing fonts: none
- Linked images: none
- Fonts used:
  - Inter Regular
  - Inter Medium
  - Inter SemiBold
  - Noto Serif Regular
  - Noto Serif Light
  - Noto Serif Medium

The Illustrator file contains 5 artboards/screens:

1. Hero / landing screen
2. Expanded navigation/menu screen
3. History tab - `The Encounter`
4. History tab - `The Crossroads`
5. History tab - `The Symbol`

---

## 3. Tech Stack

Use this stack unless the user approves changes:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui only if useful and not visually intrusive
- Zod/react-hook-form only for forms when forms are implemented
- Playwright for E2E testing

Follow the project `.claude` rules strictly:

- Server Components by default
- Push `use client` boundaries down
- No unsafe `any`
- Accessible semantic HTML
- Mobile-first responsive design
- No package installs without approval
- Do not read or expose `.env*` files

---

## 4. Visual Direction From Illustrator

### General Style

The website should feel premium, restrained, editorial, and winery/luxury oriented.

Visual characteristics:

- Dark cinematic hero
- Large centered serif brand wordmark
- Minimal navigation
- Thin divider lines
- Lots of whitespace in content sections
- Serif headings
- Small uppercase navigation labels
- Muted beige/off-white backgrounds for interior pages
- Black/dark header on content pages
- Elegant tabbed storytelling sections

### Typography

Use local fonts from the supplied files:

- Serif/display: `Noto Serif`
- Sans/UI: `Inter`

Suggested usage:

- Brand / major headings: Noto Serif
- Section headings: Noto Serif
- Navigation, buttons, metadata, body helper text: Inter
- Body text can use Inter or Noto Serif depending on final visual match

### Colors

Extract exact colors from the Illustrator file where possible. Approximate design tokens:

- Background dark: near-black / deep green-black
- Header dark: near-black
- Main page background: off-white / warm light gray
- Text dark: charcoal
- Text light: white / muted white
- Accent: muted gold/olive tone used for active nav items
- Divider lines: soft gray / muted black at low opacity

Claude should inspect the design/artboards and define CSS variables or Tailwind theme tokens before implementation.

---

## 5. Page Structure

The initial scope is a single polished website/page with sections and interactions inspired by Antinori.

### 5.1 Header / Navigation

Header requirements:

- Left: hamburger menu icon
- Center: `Mgaloblishvili` wordmark/logo
- Main nav items:
  - History
  - Vineyards
  - Wines
  - Experiences
- Right: language switcher
  - `ENG`
  - `GEO`
- Active navigation item should use the muted accent color.
- Header should be transparent/dark on hero and dark sticky/fixed on content sections if appropriate.

### 5.2 Fullscreen Hero

Hero design based on artboard 1.

Content:

- Dark full-screen background image/video feel
- Centered wordmark/title: `Mgaloblishvili`
- Navigation links under the wordmark:
  - History
  - Vineyards
  - Wines
  - Experiences
- Footer/contact line near the bottom:
  - `Wine Mgaloblishvili LLC`
  - `Village Martkopi, 1320, Gardabani, Georgia`

Behavior:

- If a video/background motion is used, include a reduced-motion fallback.
- CTA/nav clicks should scroll to or route to the relevant section.
- Hero should be responsive and preserve visual hierarchy on mobile.

### 5.3 Expanded Menu Overlay

Based on artboard 2.

Menu behavior:

- Clicking hamburger opens a fullscreen dark overlay.
- Overlay has close `X`.
- Menu columns:

History:
- The Encounter
- The Crossroads
- The Symbol

Vineyards:
- Kakheti
- Kartli
- Imereti
- Racha-Lechkhumi
- Guria-Samegrelo

Wines:
- Saperavi
- Tavkveri Rose
- Rkatsiteli Amber
- Rkatsiteli
- Kindzmarauli
- Kisi
- Kakhuri Mtsvane
- Saperavi Reserve
- Rkatsiteli Bâtonnage
- Krakhuna
- Tvishi
- Tsolikouri
- Tsinandali

Experiences:
- Gastronomy
- Winery

Footer/contact line:
- `Wine Mgaloblishvili LLC`
- `Village Martkopi, 1320, Gardabani, Georgia`

Accessibility:

- Trap focus while menu is open.
- Close with `Escape`.
- Restore focus to hamburger after close.
- Menu items should be keyboard reachable.

### 5.4 History Section

This section is the first detailed implementation priority.

It should use tabbed content matching artboards 3-5.

Tabs:

1. `The Encounter`
2. `The Crossroads`
3. `The Symbol`

#### Tab 1 - The Encounter

Layout:

- Image on the left
- Text on the right
- Large whitespace
- Bottom tab navigation

Content:

```text
The Encounter

This story begins on the pages of an ampelography book, where two Mgaloblishvilis unexpectedly met each other. A red grapevine variety “Mgaloblishvili” was discovered by its namesake while she was exploring Georgian vines.

Whether this meeting was chance or destiny, it did not pass without a trace. The discovery of a vine bearing their own surname inspired the family to embark on a true Georgian endeavor.

And so, Wine Mgaloblishvili was born. A vibrant, experimental wine from Georgia, crafted as a tribute to encounters: the planned and the spontaneous, the longed-for and the unexpected, the farewell and the inevitable.
```

#### Tab 2 - The Crossroads

Layout:

- Text on the left
- Image/map/photo on the right
- Bottom tab navigation

Content:

```text
The Crossroads

Mgaloblishvili Winery sits on a symbolic location in Gardabani, at the crossroads of Kartli and Kakheti, where two of Georgia's great wine regions meet.
```

#### Tab 3 - The Symbol

Layout:

- Text on the left
- Symbol/image on the right
- Bottom tab navigation

Content:

```text
The Symbol

The identity of the brand is rooted in crossed roads, as a symbol where cultures meet, experiences are shared, and diverse histories intertwine.
```

Behavior:

- Tabs update content without full page reload.
- Active tab has a thin underline.
- Keyboard accessible tabs with arrow-key support if implemented as ARIA tabs.
- On mobile, stack image and text vertically.

---

## 6. Antinori Reference Structure To Adapt

Use the Antinori page as a structural reference, not as a copied asset source.

Relevant Antinori patterns to adapt:

- Hero page with title and media background
- Language switcher
- Main sections under the estate/wine story
- Story blocks with images and headings
- Estate/history narrative sections
- Product/wine listing section
- Footer with estate/contact/navigation links

Suggested future sections after History:

### Vineyards

Use Mgaloblishvili regions:

- Kakheti
- Kartli
- Imereti
- Racha-Lechkhumi
- Guria-Samegrelo

Possible layout:

- Intro section about Georgian terroir
- Region cards or horizontal section carousel
- Each region can have title, short text, and image

### Wines

Use wines from menu:

- Saperavi
- Tavkveri Rose
- Rkatsiteli Amber
- Rkatsiteli
- Kindzmarauli
- Kisi
- Kakhuri Mtsvane
- Saperavi Reserve
- Rkatsiteli Bâtonnage
- Krakhuna
- Tvishi
- Tsolikouri
- Tsinandali

Possible layout:

- Editorial wine grid
- Wine cards with image placeholder, name, region/type, short description
- Optional detail page later

### Experiences

Use menu items:

- Gastronomy
- Winery

Possible layout:

- Two premium cards or split sections
- Contact/booking CTA if user provides behavior later

---

## 7. Responsive Requirements

Desktop target:

- Primary design width: 1440px
- Artboard height: 900px

Mobile/tablet:

- Header should stay usable.
- Hero title should scale down cleanly.
- Navigation should collapse into hamburger overlay.
- Story sections should stack image and text.
- Tabs should remain accessible and not overflow badly.
- Do not hide important content on mobile.

---

## 8. Accessibility Requirements

- Use semantic landmarks: `header`, `nav`, `main`, `section`, `footer`.
- All interactive elements must be real `button` or `a` elements.
- Hamburger menu must have accessible label and expanded state.
- Overlay menu must close with Escape.
- Maintain visible focus states.
- Ensure color contrast is acceptable.
- Images must have meaningful `alt` text or be decorative with empty alt.
- Respect `prefers-reduced-motion`.

---

## 9. Implementation Phases

### Phase 1 - Discovery / Architecture

Before coding, Claude should:

1. Inspect the repository.
2. Inspect `.claude` rules and follow them.
3. Inspect available assets and design files.
4. Confirm framework/tooling already installed.
5. Propose final architecture.
6. Propose component structure.
7. List unclear requirements.
8. Wait for approval.

### Phase 2 - Design Tokens / Assets

Implement:

- Font loading with supplied Inter and Noto Serif files
- CSS variables or Tailwind theme tokens
- Basic layout primitives
- Image asset handling strategy
- Header/navigation shell

### Phase 3 - Core Page

Implement:

- Hero screen
- Header
- Fullscreen menu overlay
- History section with tabs
- Responsive layout

### Phase 4 - Future Sections

Implement after approval:

- Vineyards section
- Wines section
- Experiences section
- Footer

### Phase 5 - Testing / Polish

Implement:

- Accessibility checks
- Playwright smoke tests
- Responsive checks
- Keyboard navigation checks
- Reduced-motion behavior

---

## 10. Suggested Component Structure

Claude should adapt to the actual project structure, but preferred direction:

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    layout/
      SiteHeader.tsx
      MenuOverlay.tsx
      SiteFooter.tsx
    sections/
      HeroSection.tsx
      HistorySection.tsx
      VineyardsSection.tsx
      WinesSection.tsx
      ExperiencesSection.tsx
    ui/
      Tabs.tsx
      Container.tsx
  data/
    navigation.ts
    history.ts
    wines.ts
    vineyards.ts
  lib/
    fonts.ts
```

Rules:

- Keep content data separate from presentation where practical.
- Avoid overengineering.
- Do not create a CMS abstraction unless requested.
- Do not introduce global state unless necessary.
- Keep client components small and isolated.

---

## 11. Playwright Test Plan

Minimum E2E tests:

1. Homepage loads and displays `Mgaloblishvili`.
2. Header navigation is visible on desktop.
3. Hamburger opens fullscreen menu.
4. Escape closes fullscreen menu.
5. Menu contains History, Vineyards, Wines, Experiences columns.
6. History tabs switch between:
   - The Encounter
   - The Crossroads
   - The Symbol
7. Keyboard navigation works for menu and tabs.
8. Mobile viewport does not have horizontal overflow.
9. Main sections render without console errors.

---

## 12. Claude Code Working Instructions

When Claude starts:

1. Read this `TASK.md` fully.
2. Read `.claude` rules and follow them.
3. Do not edit files immediately.
4. First produce an implementation plan.
5. Ask before installing dependencies.
6. Ask before changing package manager/config files.
7. Do not touch `.env*` files.
8. Do not copy Antinori assets or long-form content.
9. Use the Illustrator design as visual source of truth.
10. Keep implementation production-quality but not overengineered.

Initial Claude prompt:

```text
Read TASK.md and inspect the project.
Do not edit yet.

First provide:
1. product goal summary
2. pages/sections to build
3. proposed architecture
4. proposed component structure
5. design-token plan
6. implementation phases
7. Playwright test plan
8. unclear requirements/questions

Wait for my approval before editing files.
```

---

## 13. Open Questions For User

Before final implementation, clarify:

1. Should the site be English only first, or English + Georgian from the start?
2. Should menu items route to separate pages or scroll to sections on one page?
3. Do we have final vineyard/wine/experience photos?
4. Should the hero background be image or video?
5. Do we need contact/booking form now?
6. Should Wines have detail pages now or later?
7. Should the site use exact pixel-matching from Illustrator or responsive approximation?
8. Should animations mimic Antinori or stay minimal?
