# blulocotheme.com

Landing page for [Bluloco](https://github.com/uloco/bluloco.nvim), a dark and
light color scheme for editors and terminals.

## Running it

```sh
npm install
npm run dev
```

Then open http://localhost:3000.

```sh
npm run build   # production build
npm run lint    # eslint
```

## How it is put together

Next.js App Router, plain CSS Modules, no UI dependencies.

| Path | What it holds |
| --- | --- |
| `lib/palette.ts` | The palette, extracted from the VSCode theme sources. Single source of truth. |
| `lib/ports.ts` | Every port, install snippet and community link. Edit this to add a target. |
| `lib/github.ts` | Star counts, fetched at build time with hardcoded fallbacks. |
| `lib/logo-paths.ts` | Editor logos as single SVG paths, generated from simple-icons. |
| `app/globals.css` | Design tokens. |
| `app/opengraph-image.tsx` | Social card, rendered at build time from the palette. |
| `assets/fonts/` | Inter woff files for the social card. Satori cannot read woff2. |

### Theming

Every token is declared once as `light-dark(light, dark)` and resolved through
`color-scheme`:

- no `data-theme` attribute: follows the OS setting
- `data-theme="light"` or `"dark"`: forced, persisted in `localStorage`

An inline script in `app/layout.tsx` applies the stored value before first
paint, so the page never flashes the wrong palette.

### Two deliberate choices

**Contrast inside the code sample.** The hero code block uses the theme's real
values. Comments and line numbers sit at 2.69:1 and markup tags at 4.43:1, which
fails WCAG AA. That is how the theme actually looks in an editor, where comments
are meant to recede, so brightening them here would misrepresent the product.
Site chrome outside the code window uses the accessible `--fg-muted` instead.
This is the only reason the Lighthouse accessibility score is 97 and not 100.

**Star counts.** Unauthenticated GitHub allows 60 requests an hour. Set
`GITHUB_TOKEN` in the environment for live counts. Without it the build falls
back to the numbers recorded in `lib/github.ts`.

## Adding a port

Add an entry to `editors`, `terminals`, `tools` or `community` in
`lib/ports.ts`. For a new logo, add the path to `lib/logo-paths.ts`. If the
target has a repo you want a star count for, add it to the `fallback` map in
`lib/github.ts`.
