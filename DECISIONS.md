# Decisions

Running record of every decision made while building blulocotheme.com, so a new
session can pick up without re-litigating anything. Read this first.

Owner: Umut Topuzoğlu (`uloco`). Branch: `new-start`.

---

## 1. Product intent

A single landing page for the Bluloco color scheme. Its job is to be the place
people find every Bluloco port, the way draculatheme.com is for Dracula.

Not a docs site. Not a blog. One page.

---

## 2. Locked decisions

These were answered explicitly. Do not revisit without asking.

| Decision | Choice |
| --- | --- |
| Structure | Single scrolling page. No per-editor subpages. |
| Main visual | Live-rendered code, not screenshots. |
| Styling | Plain CSS Modules. **No Tailwind** — it was deliberately removed before this work started. |
| Install info | Copy-paste snippet per editor, with a copy button. |
| Community ports | Listed, in their own section, attributed to the author. |
| Donate links | Subtle, footer only. No banner, no section. |
| Editor logos | Allowed. Monochrome, from simple-icons. |
| Palette table | Full 13 scopes, dark + light hex, click to copy. |
| Star counts | Live from GitHub at build time. |
| Deploy | Vercel. Config committed. |
| Copy tone | Short, plain, no marketing language. Written to sound like the owner, not like an LLM. |

### Visual identity

| Element | Decision |
| --- | --- |
| Hero | The combined **yin-yang banner** from `bluloco.nvim/screenshots/banner-{dark,light}.svg`. Replaces a text `<h1>`. The real `<h1>` is visually hidden for SEO. |
| Header + footer icon | The **variant-specific** face: dark mascot (yellow eyes) in dark mode, light mascot (pink eyes) in light mode. From `theme-bluloco-{dark,light}/icon.svg`. |
| Favicon | The **yin-yang** face, extracted from the banner (see §6). One file, works in both modes. |
| Colour on the page | The page was too calm and grey. Fixed with three additions, all requested: glow rails, hero colour bar, coloured section eyebrows. |

### Colour treatments, as requested

1. **Glow rails** — fixed strips on both viewport edges. Two aligned layers: a
   sharp 5px strip at the very edge and a wide blurred copy behind it, so the
   glow reads as the strip bleeding outward. Both requested together and they
   must stay aligned. `components/GlowRails.tsx`.
2. **Hero colour bar** — row of pills below the stats. Hover or tap grows a pill
   and names the scope in a caption below it, showing the hex for the active
   variant only. `components/HeroColorBar.tsx`.
3. **Coloured section eyebrows** — each section label in its own syntax colour.

Rejected: scroll-parallax strips that move at different speeds. Explicitly
disliked. Do not bring it back.

---

## 3. Architecture

Next.js 16 App Router, React 19, CSS Modules, TypeScript. Fully static.

| Path | Role |
| --- | --- |
| `lib/palette.ts` | The 13 scopes and UI chrome colours, taken from the VSCode theme sources. **Single source of truth** for anything colour-related. |
| `lib/ports.ts` | Every port, install snippet, community entry, external link. Edit this to add a target. |
| `lib/highlight.ts` | Shiki setup and the four code samples. Runs at build time only. |
| `lib/github.ts` | Star counts with hardcoded fallbacks. |
| `lib/logo-paths.ts` | Editor logos as single SVG paths, generated from simple-icons. |
| `lib/use-mode.ts` | `useMode()` returns the resolved `light`/`dark` for components that need to swap an asset rather than a colour. |
| `app/globals.css` | Design tokens. |
| `app/page.module.css` | Page layout and section chrome. |
| `app/opengraph-image.tsx` | Social card, generated from the palette at build time. |
| `assets/themes/` | Vendored copies of the real Bluloco VSCode themes, fed to Shiki. |
| `assets/fonts/` | Inter woff for the social card. Satori cannot read woff2. |

Server/client split: `page.tsx` is a server component and does all data work
(stars, Shiki). `CodeWindow`, `HeroColorBar`, `ThemeToggle`, `PaletteTable`,
`Snippet` and `ThemedImage` are client components and own only interaction
state. No highlighting or grammar payload reaches the browser.

---

## 4. Theming

Every token is declared **once** as `light-dark(light, dark)` in
`app/globals.css`, resolved through `color-scheme`:

- no `data-theme` attribute → follows the OS
- `data-theme="light"` / `"dark"` → forced, persisted in `localStorage`

An inline script in `app/layout.tsx` applies the stored value before first
paint, so the palette never flashes. The toggle is a 3-way radio group
(system / light / dark) built on `useSyncExternalStore`.

Two gotchas already hit and solved:

- `light-dark()` takes exactly two comma-separated arguments, so a multi-layer
  `box-shadow` cannot go inside it. Shadow colours are separate tokens.
- The React Compiler lint rejects `setState` inside `useEffect`. Anything that
  reads `localStorage` or the DOM must use `useSyncExternalStore`.

---

## 5. Syntax highlighting

**Shiki, driven by the real Bluloco VSCode theme files.** Not hand-tokenized.

`assets/themes/bluloco-{dark,light}.json` are copies of
`theme-bluloco-{dark,light}/themes/bluloco-{dark,light}-color-theme.json`.
Shiki consumes VSCode themes and TextMate grammars natively, so the colours on
the page are exactly what the editor produces.

Output uses `defaultColor: false`, which emits `--shiki-light` and
`--shiki-dark` per token. CSS in `CodeWindow.module.css` picks the live one, so
both variants ship in one payload and switch instantly.

Tabs: **TSX, Python, Rust, CSS.** Real, self-contained snippets. The earlier
version implied a `@bluloco/react` library that does not exist — do not write
samples that imply an API the project does not ship.

Gotcha: Shiki separates `.line` spans with real newline text nodes. Inside a
`<pre>` those already break the line, so the spans must stay `display: inline`.
Making them block renders every row at double height. Line numbers come from a
CSS counter, not extra markup.

If the themes change upstream, re-copy the two JSON files. Nothing else.

---

## 6. Assets

| File | Origin |
| --- | --- |
| `public/banner-{dark,light}.svg` | `bluloco.nvim/screenshots/`, optimised with svgo. |
| `public/icon-{dark,light}.svg` | `theme-bluloco-{dark,light}/icon.svg`. |
| `public/icon-yinyang.svg`, `app/icon.svg`, `app/apple-icon.png` | Extracted from the banner. |

### How the yin-yang icon was extracted

There is no standalone yin-yang file anywhere. It lives inside the banner SVG as
a group with `id="both"`. The process:

1. Parse the **original** banner (not the svgo'd one — svgo strips the ids) with
   ElementTree, find `#both`, re-emit it with its ancestor transform chain into a
   fresh SVG.
2. Run svgo. This collapses transforms and **changes the coordinate space**, so
   any viewBox computed before this step is wrong.
3. Measure the optimised file's content bbox in the browser via `svg.getBBox()`.
   It came out `200 200 1000 1000`.
4. Set `viewBox="196 196 1008 1008"` (small padding for the stroke).

If the banner artwork ever changes, redo steps 1–4. Do not guess the viewBox.

---

## 7. Accessibility

Target: WCAG AA. Current Lighthouse: **Accessibility 97, Best Practices 100,
SEO 100.** LCP ~64ms, CLS 0.

### The one deliberate failure

The remaining contrast failures are **all inside the code window**, and they are
the theme's real values: comments and line numbers at 2.69:1, markup tags at
4.43:1, and similar for other scopes once Shiki started using the full set.

This is intentional. The code sample exists to show what Bluloco actually looks
like in an editor, where comments are meant to recede. Brightening them would
misrepresent the product. Documented in `CodeWindow.module.css`.

**Do not "fix" this.** 97 is the intended score.

### Site chrome, which does have to pass

Three places where the raw theme colours were wrong for UI text:

| Token | Problem | Fix |
| --- | --- | --- |
| Body copy | Used the comment grey `#636d83` → 2.69:1 | `--fg-muted` is a lifted grey: `#696b74` light, `#9aa4b6` dark. `--fg-faint` keeps the original for decoration. |
| Accent / links | Dark-mode `#3691ff` → 4.43:1, just short | `#4d9cff` in dark mode. Visually near-identical. |
| Filled buttons | White on light blue fails in dark mode | `--accent-contrast` is `light-dark(#ffffff, #20242a)`, so dark mode uses dark text on the light blue. |

`--fg-muted` was raised twice: first pass cleared 4.5:1 on `--bg` but cards use
`--surface`, which is lighter, and it dropped to 4.47.

### Section eyebrows — read this before touching them

The eyebrow colours went wrong once already. The raw syntax colours pass AA on
the dark background at 11px but only reach ~3:1 on the light background.

First attempt mixed every eyebrow toward `--fg` in both modes. That passed the
audit and **washed the colour out completely** — the eyebrows read as grey and
the whole point was lost.

Current approach, asymmetric:

- dark mode: raw syntax colour, untouched, stays vivid
- light mode: `color-mix(in oklab, var(--eyebrow) 82%, #000)`

All ten combinations now measure ≥ 4.59:1. Measured values:

| Section | Colour | Light | Dark |
| --- | --- | --- | --- |
| Editors | keyword | 4.90 | 5.83 |
| Terminals | function | 5.62 | 6.27 |
| Command line | property | 7.44 | 5.64 |
| Community | constant | 7.64 | 4.59 |
| Palette | type | 7.17 | 4.92 |

Command line was originally the string yellow and only reached 3.82:1 in light
mode. Yellow does not work as text on white; it was swapped to the property tan.

When measuring contrast in the browser, note that `getComputedStyle().color`
returns `oklab(...)` for `color-mix` values. Parsing that as RGB gives nonsense.
Paint it to a 1×1 canvas and read the pixel back.

---

## 8. Content decisions

Everything listed was verified to exist and contain real theme files.

**Official, listed:** Neovim, VS Code, Zed, JetBrains (`.icls` import), plus bat,
lazygit and opencode under command line.

**Terminals:** Ghostty, WezTerm and kitty are featured because Bluloco ships with
them. 20 more are listed as chips. The hero stat says 23 = 3 featured + 20 chips,
matching the `terminal-themes/` directory count in `bluloco.nvim`. **If you edit
one, edit the other** — `terminalCount` in `lib/ports.ts` derives from the array.

**Community:** Helix, Vim (DanBradbury), Yazi, Neovim-without-lush, Replit,
Mintty, Notepad++, Geany, yeet.

### Deliberately excluded

| Thing | Why |
| --- | --- |
| `uloco/vim-bluloco-dark` | Archived. README says "no longer maintained" and "pls don't install yet". |
| `uloco/vim-bluloco-light` | Stub. No `colors/` directory. Non-functional. |
| Atom ports | Atom is sunset, atom.io redirects. |
| Paid third-party JetBrains plugin | Was briefly noted on the page. **Removed at the owner's request** — he has contacted them to take it down and will publish his own. The JetBrains card now reads "Official plugin coming soon". Do not re-add any mention of it. |

---

## 9. Known issues, not yet done

| Item | Notes |
| --- | --- |
| DNS | `blulocotheme.com` is still a German domain-parking page (`46.38.243.234`, no TLS listener). Needs repointing at Vercel. |
| `GITHUB_TOKEN` | Not set on Vercel. Without it the build falls back to the counts hardcoded in `lib/github.ts`. Unauthenticated GitHub is 60 req/hour. |
| Open VSX | Published Bluloco is v3.6.0 vs v3.10.0 on the VS Code marketplace, ~4 years stale. Affects VSCodium, Gitpod, Cursor, Windsurf users. Upstream fix, not a site fix. |
| `bluloco-zed/extension.toml` | `repository` points at `github.com/bluloco/bluloco-zed`, an org with no public repos. Dead link. Upstream fix. |
| Hero stat "1M+ installs" | Marketplace shows 527k dark + 500k light. Open question whether to keep the combined figure or split it per variant. |
| JetBrains plugin | Owner intends to publish an official one. The card copy should change when that lands. |

---

## 10. Do not regress

Mistakes already made and fixed. Re-introducing any of these is a regression.

1. **Do not desaturate the section eyebrows.** See §7.
2. **Do not use the comment grey for body text.** It is 2.69:1.
3. **Do not "fix" the code window contrast.** See §7.
4. **Do not set `display: block` on Shiki's `.line`.** Doubles row height. See §5.
5. **Do not write code samples that imply a `@bluloco/*` library.** None exists.
6. **Do not put a multi-layer `box-shadow` inside `light-dark()`.** See §4.
7. **Do not compute an SVG viewBox before running svgo.** See §6.
8. **Do not use `minmax(26rem, 1fr)` without `min()`** in a grid track — it
   forces horizontal overflow on narrow screens. Use
   `minmax(min(26rem, 100%), 1fr)`.
9. **Do not add Tailwind.**
10. **Do not re-add the parallax strips.**
11. **Do not mention the paid JetBrains plugin.**
12. **Do not use `:first-of-type` to target one of several sibling spans** with
    the same class when other span types are present. It counts element type,
    not class. Bit the hero bar caption.

---

## 11. Verification

```sh
npm run lint     # must be clean
npm run build    # must be clean
npm run dev      # http://localhost:3000
```

Before calling anything done, check in a browser:

- both themes, via the 3-way toggle, and with the OS preference
- reload with a stored theme, confirm no flash of the wrong palette
- 390px viewport, confirm no horizontal overflow
- all four code tabs
- hover and tap a hero colour pill
- console clean
- Lighthouse: accessibility should be 97 with failures only inside the code window
