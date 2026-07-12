# Typography System

This project uses semantic typography utilities in `src/app/globals.css`.
The utilities define only typography metrics: font family, weight, size, line
height, letter spacing, and uppercase behavior. They must not define colors.

## Designer Specs

| Role | Family | Weight | Size | Line Height | Letter Spacing |
| --- | --- | --- | --- | --- | --- |
| Menu | Inter | 600 | 12px | 1.4 | 0.5px |
| Submenu | Noto Serif | 300 | 18px | 2.4 | default |
| Headline | Noto Serif | 500 | 36px | 1.2 | default |
| Body Text | Noto Serif | 400 | 14px | 1.6 | 0.02em |

## Semantic Utilities

- `type-menu`: primary navigation labels, menu column titles, small uppercase action labels.
- `type-submenu`: menu submenu links, wine lists, vineyard region links, serif subtitles.
- `type-headline`: editorial section headings and content page headings.
- `type-body-editorial`: serif editorial body paragraphs.
- `type-display-hero`: large image-overlay hero titles.
- `type-category-large`: large category selectors such as Wines, Brandy, Chacha, Gastronomy, Winery.
- `type-meta`: small footer and metadata text.
- `type-language`: language switcher labels.

## Usage Examples

- `src/components/ui/NavLink.tsx` uses `type-menu`.
- `src/components/layout/MenuOverlay.tsx` uses `type-menu` and `type-submenu`.
- `src/components/features/WinesView.tsx` and `ExperiencesView.tsx` use `type-category-large`.
- `src/components/features/HistoryTabs.tsx` uses `type-headline` and `type-body-editorial`.
- Detail pages use `type-display-hero` for hero titles and `type-body-editorial` for body copy.
- `SiteFooterMinimal.tsx` uses `type-meta`.
- `LanguageSwitcher.tsx` uses `type-language`.

## Rules

- Keep colors, opacity, hover, active, and focus states in components.
- Keep layout and spacing classes in components.
- Use these semantic utilities before adding new arbitrary typography classes.
- Add a new typography utility only when a repeated role does not fit the existing set.
