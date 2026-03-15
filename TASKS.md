# Tasks

Numbered task index for the Angular Comic Store accessibility demo.

## Convention

- Each task gets the **next sequential integer** -- numbers are never reused or reordered.
- Every task has a **type** that matches the commit type convention (see below).
- Branch name: `task-{number}-{slug}` (e.g., `task-1-foundational-docs`).
- Update the status column as work progresses.
- Statuses: `planned` | `in-progress` | `done`

### Task Types

| Type | Description |
|------|-------------|
| `feat` | New feature or user-facing functionality |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `build` | Build system, dependencies, Nx config |
| `refactor` | Code restructuring with no behavior change |
| `test` | Adding or updating tests |
| `style` | Formatting, whitespace, SCSS (no logic change) |
| `ci` | CI/CD pipeline configuration |
| `chore` | Tooling, generators, maintenance |
| `a11y` | Accessibility improvement (ARIA, keyboard, focus) |

## Index

| # | Type | Title | Description | Status | Branch |
|---|------|-------|-------------|-------|--------|
| 1 | docs | Foundational docs and context | README, CONTRIBUTING, Cursor rules, task tracking system | done  | `task-1-foundational-docs` |
| 2 | chore | UI library Nx generator | Workspace plugin with ui-library generator that scaffolds Angular UI libs with component and harness | done  | `task-2-ui-library-generator` |
| 3 | chore | Generator axe-core WCAG compliance helpers | Split axe-core helper into per-level functions (A, AA, AAA, best-practice) with shared `runAxe`, update generator template and specs, add `@angular-comic-store/test-helpers` util library | done  | `task-3-generator-axe-con-wcag-compliance` |
| 4 | docs | Agentic development workflow | Document the 3-phase development workflow (Analysis, Planning, Implementation) in project context rule and MCP config for Cursor-driven agentic development | done  | `task-4-agentic-development-workflow` |
| 5 | chore | Generator Guidepup support | Add Guidepup virtual screen reader to ui-library generator for unit testing and wire Playwright integration test template | done  | `task-9-generator-guidepup` |
| 6 | chore | Generator POUR Vitest structure | Add POUR-categorized unit test structure to ui-library generator spec template; document in TESTING.md; refs #6 | todo | `task-6-pour-vitest-structure` |
