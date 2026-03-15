# @angular-comic-store/styles

Shared scaling styles architecture — design tokens, color palette, typography, spacing, and motion.

## Overview

- **Design tokens**: CSS custom properties exposed via `:root`
- **`prefers-color-scheme`**: Light and dark themes
- **`prefers-reduced-motion`**: Animation durations collapse to 0 when reduced motion is preferred
- **WCAG AA**: Color contrast tuned for text and focus indicators

## Usage

### In app styles

Import the main entry in `apps/angular-comic-store /src/styles.scss`:

```scss
@use 'index' as styles;
```

### In Storybook

Import in `libs/storybook-host/.storybook/preview.ts`:

```ts
import '../../util/styles/src/index.scss';
```

### In components

Use mixins and CSS variables:

```scss
@use 'mixins' as *;

:host {
  padding: var(--space-4);
  background: var(--color-surface);
  border-radius: var(--radius-md);

  &:focus-visible {
    @include focus-ring;
  }
}
```

## Token reference

| Token | Purpose |
|-------|---------|
| `--color-*` | Background, text, border, accent (semantic) |
| `--font-size-*` | xs, sm, base, md, lg, xl, 2xl, 3xl |
| `--line-height-*` | tight, normal, relaxed |
| `--font-weight-*` | normal, medium, semibold, bold |
| `--space-*` | 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16 |
| `--radius-*` | sm, md, lg, full |
| `--duration-*` | instant, fast, normal, slow (0 when prefers-reduced-motion) |

## Mixins

- `focus-ring` — WCAG-visible focus indicator
- `transition($property)` — Uses `--duration-normal`, disabled when reduced motion
- `fluid-font-size($min, $preferred, $max)` — Clamp-based fluid typography
