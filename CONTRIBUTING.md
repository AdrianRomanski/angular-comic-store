# Contributing

Guidelines for working in this repository -- whether you're following along with the conference talk, completing homework, or extending the demo.

## Project Overview

This is a **living demo** for the talk **"Accessibility Testing Pyramid in Angular with Nx"**. The application is a comic book store built with Angular, Angular Material, and NgRx inside an Nx monorepo. Every feature is designed to demonstrate accessible UI patterns and a layered testing strategy.

## Development Workflow

### Task Numbering

All work is tracked in [`TASKS.md`](./TASKS.md) with sequential, never-reused task numbers.

1. Find the next available number in `TASKS.md`.
2. Create a branch: `task-{number}-{short-slug}` (e.g., `task-3-comic-card`).
3. Update the task status in `TASKS.md` as you progress.
4. Open a PR referencing the task number.

### Branch Naming

```
task-{number}-{slug}
```

Examples: `task-2-install-material`, `task-5-comic-list-feature`

### Commit Messages

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. Every commit message must use this format:

```
<type>(scope): <subject>

[optional body]

[optional footer]
```

**Types:**

| Type | When to use |
|------|-------------|
| `feat` | New feature or user-facing functionality |
| `fix` | Bug fix |
| `docs` | Documentation only (README, CONTRIBUTING, inline docs) |
| `build` | Build system, dependencies, Nx workspace config |
| `refactor` | Code restructuring with no behavior change |
| `test` | Adding or updating tests |
| `style` | Formatting, whitespace, SCSS changes (no logic) |
| `ci` | CI/CD pipeline configuration |
| `chore` | Tooling, generators, maintenance tasks |
| `a11y` | Accessibility improvement (ARIA, keyboard, focus, contrast) |

**Scope** is optional but encouraged. Use the library or app name, e.g., `feat(comics-data-access)`, `a11y(shared-ui-card)`, `docs(readme)`.

**Rules:**

- Subject line: imperative mood, lowercase, no period, max 72 characters
- Body: wrap at 100 characters, explain *why* not *what*
- Reference the task number in the footer when applicable: `Task: #3`
- Breaking changes must include `BREAKING CHANGE:` in the footer

**Examples:**

```
docs(readme): add accessibility testing pyramid diagram

Task: #1
```

```
feat(comics-ui): add comic card component with keyboard navigation

Implements a fully accessible card using Angular Material CDK focus
utilities. Supports Enter and Space to activate, Escape to deselect.

Task: #5
```

```
a11y(shared-ui): improve contrast ratio on secondary buttons

Adjusts secondary button colors to meet WCAG AA 4.5:1 ratio for
normal text.

Task: #12
```

```
build: install Angular Material and CDK

Task: #2
```

## Architecture Decisions

### Components

- **Standalone only** -- no NgModules for component declarations
- **`changeDetection: OnPush`** on every component
- **Separate files** for template (`.html`) and styles (`.scss`)
- **Signals** for local reactive state (`signal()`, `computed()`, `effect()`)
- **New control flow**: `@if`, `@for`, `@switch`
- **`input()` / `output()`** signal-based APIs (not decorators)
- **`inject()`** function (not constructor injection)

### State Management

- **NgRx SignalStore** for feature-level and shared state
- Keep stores in `data-access` libraries
- Expose selectors as computed signals

### UI

- **Angular Material** for all standard UI elements
- Use CDK utilities (`FocusTrap`, `LiveAnnouncer`, `FocusMonitor`) for custom a11y needs
- Prefer semantic HTML over ARIA workarounds

### Monorepo Libraries

| Type | Purpose | Tag | Example |
|------|---------|-----|---------|
| `feature` | Smart components, pages, routing | `type:feature` | `libs/comics/feature-browse` |
| `ui` | Presentational components | `type:ui` | `libs/shared/ui-card` |
| `data-access` | Stores, API services | `type:data-access` | `libs/comics/data-access` |
| `util` | Pure functions, pipes, helpers | `type:util` | `libs/shared/util-a11y` |

Module boundaries are enforced via ESLint (`@nx/enforce-module-boundaries`).

## Accessibility Checklist

Before submitting any component, verify:

### Semantic HTML
- [ ] Uses appropriate HTML elements (`<button>`, `<nav>`, `<main>`, `<h1>`-`<h6>`, etc.)
- [ ] Headings follow a logical hierarchy with no skipped levels
- [ ] Lists use `<ul>`, `<ol>`, or `<dl>` as appropriate

### ARIA
- [ ] ARIA attributes are only added when semantic HTML is insufficient
- [ ] Interactive elements have accessible names (`aria-label`, `aria-labelledby`, or visible text)
- [ ] Dynamic state changes update `aria-live` regions or use `LiveAnnouncer`

### Keyboard
- [ ] All interactive elements are reachable via Tab / Shift+Tab
- [ ] Custom widgets support expected key patterns (Arrow keys, Enter, Escape, Space)
- [ ] Focus is managed on route changes, dialog open/close, and content updates
- [ ] Focus order matches visual order

### Visual
- [ ] Text meets WCAG AA contrast ratio (4.5:1 normal text, 3:1 large text)
- [ ] UI is functional at 200% zoom
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Color is not the only means of conveying information

### Testing
- [ ] axe-core audit passes with zero violations
- [ ] Component Harness tests cover keyboard interaction and focus behavior
- [ ] Storybook play function includes virtual screen reader phase (content, interactions, spoken output)
- [ ] Real screen reader test (Guidepup + Playwright) validates reading order and announcements where applicable (future/E2E)

## Testing Conventions

### Unit Tests (Vitest + axe-core + Component Harness)

- Every component has a `.spec.ts` file
- Run axe-core on the rendered fixture to catch WCAG violations
- Use Angular Component Harness to test focus management, keyboard navigation, and dynamic ARIA updates
- Test interactive states: disabled, loading, error, empty
- Screen reader assertions run at the integration level (Storybook), not in unit specs

### Integration Tests (Storybook Play + Virtual Screen Reader)

- Every presentational component has a `.stories.ts` file with a play function
- Play function has three phases: content verification, user interactions, virtual screen reader output
- Use `@guidepup/virtual-screen-reader` helpers (`startVirtualScreenReader`, `getSpokenPhrases`, etc.) against `canvasElement`
- Validate screen reader spoken output for component content
- Cover all visual variants: themes, sizes, states

### E2E Tests (Playwright)

- Cover critical user journeys end-to-end
- Include keyboard-only navigation flows
- Test skip-to-content and landmark navigation

## Code Style

- **Prettier** for formatting (config in `.prettierrc`)
- **ESLint** for linting (config in `eslint.config.mjs`)
- **SCSS** for styles -- use Angular Material theming APIs

## Nx Generator Requirement

Once the custom Nx generator is created (in `tools/`), **every new feature must be scaffolded through it**. The generator will produce:

- Component with accessible boilerplate
- Component Harness
- Storybook story with Play Functions
- Unit test with axe-core audit

Do not manually create components that the generator can scaffold.

## Commands Reference

```bash
# Serve the app
npx nx serve angular-comic-store

# Run unit tests
npx nx test angular-comic-store

# Lint
npx nx lint angular-comic-store

# E2E tests
npx nx e2e angular-comic-store-e2e

# Visualize dependency graph
npx nx graph
```
