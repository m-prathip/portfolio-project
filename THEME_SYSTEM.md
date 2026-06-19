# Theme & Colour System (Phase 7)

A dynamic, 10-palette theme engine with light/dark mode, live switching,
animated transitions, persistence, and preview cards.

## The 10 themes
OpenAI · Apple · Cyberpunk · Royal Purple · Ocean Blue · Emerald · Black Gold ·
Midnight · Neon Future · Glass

## How it works (no component rewrites needed)
- `src/index.css` defines each palette as CSS variables (`--c-primary-50…900`,
  `--c-accent`) inside `:root` (default = OpenAI) and `[data-theme="…"]` blocks.
- `tailwind.config.js` maps Tailwind's `primary`/`accent` colours to those
  variables via `rgb(var(--c-primary-600) / <alpha-value>)`.
- Because every existing class like `bg-primary-600`, `text-primary-400`,
  `from-primary-50`, `focus:ring-primary-500`, `.badge`, `.btn-primary` already
  uses the `primary` scale, **the entire app re-colours instantly** when the
  `data-theme` attribute on `<html>` changes. Zero per-component edits.

## Files
| File | Role |
|---|---|
| `src/context/ThemeContext.jsx` | State for `mode` (light/dark) + `theme` (palette); persists to localStorage; applies `data-theme` + `dark` class; brief `theme-anim` transition class |
| `src/components/common/ThemeSwitcher.jsx` | Droplet button → panel with light/dark segmented toggle + 10 preview cards (live swatches) |
| `src/index.css` | Palette variable definitions + smooth-transition rule |
| `tailwind.config.js` | `primary`/`accent` → CSS variables |

## Where the switcher appears
Portfolio Navbar, admin Dashboard header, the  Landing header, and all
auth screens (login/signup/verify/forgot/reset).

## Persistence
- `localStorage.colorMode` → `light` | `dark`
- `localStorage.themePalette` → one of the 10 theme ids
Defaults to the OS colour-scheme preference + the OpenAI palette.

## Back-compat
`useTheme()` still exposes `{ dark, toggle }`, so the pre-existing sun/moon
toggles keep working alongside the new switcher.
