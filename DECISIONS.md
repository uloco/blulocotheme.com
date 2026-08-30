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

### Copy rules

The owner's `AGENTS.md` voice (blunt, clipped, fragments) applies to **messages
and commits, not to the site copy**. Site copy should be natural and flowing.

- Sentences stay simple and short, but **not choppy**. Avoid stacking two- and
  three-word fragments: "Built in. Both variants. Nothing to install." was
  explicitly rejected. Join them into one readable sentence.
- Section names must stay generic enough to grow. "Command line" became
  **"Tools"** because browser and other non-CLI ports will land there.
- The colour bar caption describes the design philosophy, adapted from the
  `bluloco.nvim` README ("comprehensive usage of syntax scopes and color
  consistency, with due regards to aesthetics, contrast and readability").
- **Leave the Community and Palette copy alone.** The owner likes both.


### Visual identity

| Element | Decision |
| --- | --- |
| Hero | The combined **yin-yang banner** from `bluloco.nvim/screenshots/banner-{dark,light}.svg`. Replaces a text `<h1>`. The real `<h1>` is visually hidden for SEO. |
| Hero layout | Banner, tagline and editor picker sit in a **card on `--sunken`**, the same panel colour the install snippets use, with a rounded border. Stats and the colour bar sit below it on the page background. |
| Editor picker | **No editor is promoted.** A 4-across grid (2 on mobile) of Neovim / VS Code / Zed / JetBrains, each jumping to that editor's card via a `slug(name)` anchor. This replaced a "Get it for VS Code" primary button, which was removed on purpose — do not reintroduce a single-editor CTA. |
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

Tabs: **TSX, Python, Rust, CSS, HTML, Go, Swift, Kotlin.** Real, self-contained
snippets. The earlier version implied a `@bluloco/react` library that does not
exist — do not write samples that imply an API the project does not ship. Swift
and Kotlin are tabs 7 and 8 and are **hidden below 640px** via
`nth-child(n + 7)`, because eight tabs will not fit a phone without scrolling.

Gotcha: Shiki separates `.line` spans with real newline text nodes. Inside a
`<pre>` those already break the line, so the spans must stay `display: inline`.
Making them block renders every row at double height. Line numbers come from a
CSS counter, not extra markup.

If the themes change upstream, re-copy the two JSON files. Nothing else.

### Fonts

- Sans is **Inter** via `next/font/google`.
- Mono is **Iosevka**, self-hosted through `@fontsource/iosevka` (400, 400-italic
  and 700). It is not on Google Fonts, so `next/font` cannot fetch it. Italic is
  included because the theme's italic variants make Shiki emit `font-style` on
  token spans.
- Because there is no `next/font` variable for it, `--font-mono` is declared by
  hand in `globals.css` and already carries its fallbacks. Do not write
  `var(--font-mono), monospace`.
- **Ligatures are on** (`font-variant-ligatures: contextual`, `"liga" 1,
  "calt" 1`). This was previously switched off for JetBrains Mono and has been
  deliberately reversed: the code window is meant to look like a real editor.
  `=>` renders as `⇒`, `===` as a single glyph.
- Every code-ish surface resolves to `--font-mono`: the code window, snippets,
  palette hexes, terminal chips, star badges and the colour-bar pill labels. The
  one exception is the JetBrains numbered install steps, which are prose.

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
| Tools | property | 7.44 | 5.64 |
| Community | constant | 7.64 | 4.59 |
| Palette | type | 7.17 | 4.92 |

The Tools eyebrow was originally the string yellow and only reached 3.82:1 in
light mode. Yellow does not work as text on white; it was swapped to the
property tan.

When measuring contrast in the browser, note that `getComputedStyle().color`
returns `oklab(...)` for `color-mix` values. Parsing that as RGB gives nonsense.
Paint it to a 1×1 canvas and read the pixel back.

### The star badge is a deliberate split

The GitHub star count on each card: the **star glyph** is `--syn-string` yellow,
the **number** stays `--fg-muted`. At 11px the raw yellow only reaches ~2.8:1 on
`--sunken`, and the number is the part that has to be readable. Do not colour the
number yellow without also darkening it.

---

## 7a. Touch behaviour

The hero colour bar caused a long back-and-forth. What is true:

- Pills are **20×14px** on mobile. That is far under the 44px minimum touch
  target. **Taps are therefore handled on the whole 56px-tall bar**, not on the
  pill: `onClick` on the bar maps the tap's x to the nearest pill and toggles it.
  Do not move the toggle back onto the pill.
- Swipe across the row tracks like hover. Two handlers on purpose:
  `onPointerMove` (guarded by `pointerType === "mouse" || buttons > 0`) and
  `onTouchMove` as a fallback, because iOS is not dependable about delivering
  `pointermove` during a drag.
- `touch-action: pan-y` on the bar so vertical scrolling still works while
  horizontal drags are ours.
- Mouse vs touch is decided by `window.matchMedia("(hover: hover)")` **read at
  event time**, not by remembering the last `pointerType`. An earlier version
  defaulted a `lastPointer` ref to `"mouse"`, so any device that never delivered
  `pointerdown` had taps blocked forever.
- `onFocus` only selects when `:focus-visible` matches, so keyboard works but a
  tap's incidental focus does not fight the click. `onBlur` is guarded with
  `prev === i ? null : prev` so blurring an old pill cannot clear a fresh tap.

### Two iOS-specific gotchas, both fixed

1. **Sticky `:hover`.** iOS keeps hover state after a tap, which left tool and
   community icons stuck `--accent` blue while others stayed grey — it looked
   like "some icons are coloured and some are not". **Every `:hover` rule in the
   project is wrapped in `@media (hover: hover)`.** Keep it that way when adding
   new ones.
2. **Tap highlight.** iOS paints a translucent blue box on tap that flickers
   during a drag. `-webkit-tap-highlight-color: transparent` is set globally on
   `a`, `button` and `[role="tab"]` in `globals.css`, plus `user-select: none`
   on the pills so a swipe cannot start a text selection.

### Testing on the simulator

An iPhone 13 simulator runs Safari against the dev server. Use it **only for
touch-specific checks** — it burns a lot of context. Lessons learned:

- Estimating tap coordinates from screenshots is unreliable and cost several
  wasted rounds. The pills sit around y≈365 after loading `/#top` and swiping up
  120px from y=400, but verify before trusting it.
- iOS momentum scrolling overshoots badly; small swipes from a low start point
  are more predictable than large ones.
- Chrome with `390x844x3,mobile,touch` emulation reports `(hover: none)` and is
  fine for verifying the *logic*. Use it first, then confirm on the simulator.
- Screenshots come back at 195×422 for a 390×844 screen, so **multiply image
  coordinates by 2** to get tap coordinates.

### OPEN BUG: colour bar does not respond to touch in the simulator

**Status: unresolved. This is where the next session should start.**

The logic is verified correct in Chrome. With `390x844x3,mobile,touch` emulation:
tapping inside the bar but *below* a pill selects the nearest pill and expands it
to 100px, a second tap collapses it, and tapping a different pill moves the
selection. All measured, all passing.

On the iOS simulator, nothing happens: no tap response, no swipe response.

Hypotheses **already ruled out**:

| Ruled out | How |
| --- | --- |
| Hydration or JS broken | The theme toggle works on the simulator. |
| Wrong tap coordinates | The theme toggle at (352, 60) responds; the pill row was located from a screenshot and tapped dead centre. |
| Tiny touch target | Fixed anyway — the handler is on the 56px bar now, and Chrome confirms a below-the-pill tap works. |
| Stale cached JS | Reproduced against `next start -p 3100`, whose chunk filenames are content-hashed. |
| `GlowRails` overlay intercepting | `.rail` sets `pointer-events: none`, which the `.glow` children inherit. |

Leading hypothesis: the simulator reports **`(hover: hover)` as true** (its
pointer is trackpad-driven), so `handleClick` early-returns, while no real hover
movement occurs to drive the `pointermove` path. That would explain the click
doing nothing. It does **not** explain `onTouchMove` failing during a horizontal
swipe, so something else may also be wrong.

Next step, and do this **before** changing any more code: instrument instead of
guessing. Add a temporary readout inside `HeroColorBar` showing
`matchMedia("(hover: hover)").matches` plus counters for `pointermove`,
`touchmove` and `click`, then screenshot it on the simulator. That distinguishes
"events never arrive" from "events arrive and the guard rejects them" in one shot.
A draft of this instrumentation was written and then reverted to keep the tree
clean; rewrite it rather than hunting for it.

If it turns out to be a simulator artifact, verify on a real iPhone and consider
replacing the `matchMedia` guard with a `pointerup`-based check on
`e.pointerType`, which reflects the actual input device rather than the display's
capabilities.

---

## 8. Content decisions

Everything listed was verified to exist and contain real theme files.

**Official, listed:** Neovim, VS Code, Zed, JetBrains (`.icls` import), plus bat,
lazygit and opencode under Tools.

**Terminals:** Ghostty, WezTerm and kitty are featured because Bluloco ships with
them. 20 more are listed as chips. The hero stat says 23 = 3 featured + 20 chips,
matching the `terminal-themes/` directory count in `bluloco.nvim`. **If you edit
one, edit the other** — `terminalCount` in `lib/ports.ts` derives from the array.

**Community:** Helix, Vim (DanBradbury), Yazi, Replit, Mintty, Notepad++, Geany,
yeet.

### Icons

Real brand paths exist in `lib/logo-paths.ts` for vscode, neovim, zed,
jetbrains, ghostty, wezterm, helix, vim and replit only. Everything else uses a
**hand-drawn stroke glyph** from `glyphPaths` in `components/Logo.tsx`
(`terminal`, `git`, `file`, `spark`, `panes`, `code`). These are deliberately not
attempts at brand logos: guessing simple-icons path data from memory produces
garbled outlines. `<PortIcon logo glyph>` picks whichever an entry declares.

Known cosmetic inconsistency: brand logos are filled, glyphs are stroked, so they
carry slightly different visual weight. Not yet resolved.

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
| DNS | The domain is added in Vercel. At netcup: delete the old A record `46.38.243.234`, add `A @ 76.76.21.21`, and `CNAME www cname.vercel-dns.com` if www is wanted. Vercel issues the TLS cert once it resolves. |
| `GITHUB_TOKEN` | Not set on Vercel. Without it the build falls back to the counts hardcoded in `lib/github.ts`. Unauthenticated GitHub is 60 req/hour. |
| Open VSX | Published Bluloco is v3.6.0 vs v3.10.0 on the VS Code marketplace, ~4 years stale. Affects VSCodium, Gitpod, Cursor, Windsurf users. Upstream fix, not a site fix. |
| `bluloco-zed/extension.toml` | `repository` points at `github.com/bluloco/bluloco-zed`, an org with no public repos. Dead link. Upstream fix. |
| Hero stat "1M+ installs" | Marketplace shows 527k dark + 500k light. Open question whether to keep the combined figure or split it per variant. |
| JetBrains plugin | Owner intends to publish an official one. The card copy should change when that lands. |
| Icon weight | Brand logos are filled, hand-drawn glyphs are stroked, so they read at slightly different weights in the Tools and Community rows. Unresolved. |
| Colour bar on touch | The tap-anywhere-on-the-bar fix is **not yet verified on the simulator**. See §7a. |

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
13. **Do not size an image with `max-width` alone.** `.banner` had
    `max-width: 580px` and no `width: 100%`, so the SVG rendered at its intrinsic
    580px on a 390px screen. That gave the document 208px of horizontal overflow
    and mobile Chrome shrink-to-fit the **entire page**, which read as "the site
    is not mobile optimised at all".
14. **Do not offset the glow rails outward with a negative `left`/`right`.** The
    outward half is invisible (the body clips it) but `scrollWidth` still counts
    it, which keeps the same shrink-to-fit bug alive. Anchor at `0`; `filter:
    blur` does not affect layout, so it still bleeds softly.
15. **Do not animate the colour pills with `transform: scale()`.** Transforms do
    not affect layout, so scaled pills overlap their neighbours instead of
    pushing them aside. Animate real `width`/`height` inside a **fixed-height**
    bar: the fixed height is what stops the page below from jumping.
16. **Do not write a `:hover` rule outside `@media (hover: hover)`.** See §7a.
17. **Do not put the pill tap handler back on the pill.** See §7a.
18. **Do not append `, monospace` after `var(--font-mono)`.** The variable
    already carries its fallbacks.
19. **Do not re-disable code ligatures.** They are on deliberately. See §5.
20. **Do not invent simple-icons path data from memory.** Use a stroke glyph
    instead. See §8.

---

## 11. Verification

```sh
npm run lint      # must be clean
npm run build     # must be clean
npm run dev       # http://localhost:3000
npx next start -p 3100   # production, hashed chunks, for simulator tests
```

Before calling anything done, check in a browser:

- both themes, via the 3-way toggle, and with the OS preference
- reload with a stored theme, confirm no flash of the wrong palette
- 390px viewport, confirm `documentElement.scrollWidth === clientWidth`; any
  horizontal overflow makes mobile Chrome shrink-to-fit the whole page
- all eight code tabs, and that only six show below 640px
- hover a colour pill: neighbours move aside, and neither the caption nor the
  code window shifts vertically
- console clean
- Lighthouse: accessibility should be 97 with failures only inside the code window

---

## 12. Next session: start here

1. **Open bug**: the colour bar does not respond to touch on the iOS simulator.
   Full diagnosis and the ruled-out list are in §7a. Instrument before editing.
2. **Verify on a real iPhone** once the simulator question is settled.
3. Optional polish, in rough priority order:
   - Unify icon weight; brand logos are filled, glyphs are stroked (§8).
   - Decide the "1M+ installs" stat: combined, or split per variant (§9).
4. Infrastructure still outstanding: set `GITHUB_TOKEN` on Vercel, and point the
   netcup DNS at Vercel (§9 has the exact records).

