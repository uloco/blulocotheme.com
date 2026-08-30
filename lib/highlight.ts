import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createHighlighter, type ThemeRegistrationRaw } from "shiki";

/**
 * Syntax highlighting via Shiki, driven by the real Bluloco VSCode theme files
 * in assets/themes. Shiki consumes VSCode themes and TextMate grammars natively,
 * so the colours here are exactly what you get in the editor. Nothing is
 * hand-tokenized or approximated.
 *
 * Runs at build time only. The output is static HTML with per-token CSS
 * variables (--shiki-light / --shiki-dark), so both themes ship in one payload
 * and CSS picks the active one. No highlighting JS reaches the browser.
 */

export type Sample = {
  /** Tab label. */
  tab: string;
  /** Shown in the window title bar. */
  filename: string;
  /** Pre-rendered HTML from Shiki. */
  html: string;
};

const samples: { tab: string; filename: string; lang: string; code: string }[] = [
  {
    tab: "TSX",
    filename: "Editor.tsx",
    lang: "tsx",
    code: `import { useState, useMemo } from "react";

interface Props {
  scopes: readonly string[];
  onPick?: (hex: string) => void;
}

// Thirteen scopes, each with a fixed meaning.
export function Palette({ scopes, onPick }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const total = useMemo(() => scopes.length, [scopes]);

  if (total === 0) return null;

  return (
    <ul className="palette" data-count={total}>
      {scopes.map((scope, i) => (
        <li
          key={scope}
          aria-selected={i === active}
          onClick={() => {
            setActive(i);
            onPick?.(\`#\${scope}\`);
          }}
        >
          {scope}
        </li>
      ))}
    </ul>
  );
}`,
  },
  {
    tab: "Python",
    filename: "palette.py",
    lang: "python",
    code: `from dataclasses import dataclass, field
from typing import Iterator

SCOPES = ("keyword", "function", "string", "number")


@dataclass(frozen=True)
class Palette:
    """A resolved Bluloco variant."""

    name: str
    contrast: float = 7.1
    scopes: dict[str, str] = field(default_factory=dict)

    def resolve(self, scope: str) -> str | None:
        return self.scopes.get(scope)

    def __iter__(self) -> Iterator[tuple[str, str]]:
        for key in SCOPES:
            if (hex_value := self.resolve(key)) is not None:
                yield key, hex_value


theme = Palette("Bluloco Dark", scopes={"keyword": "#10b1fe"})

for scope, hex_value in theme:
    print(f"{scope:<10} {hex_value}")`,
  },
  {
    tab: "Rust",
    filename: "palette.rs",
    lang: "rust",
    code: `use std::collections::HashMap;
use std::fmt;

const FALLBACK: &str = "#abb2bf";

#[derive(Debug, Clone, PartialEq)]
pub enum Variant {
    Dark,
    Light,
}

pub struct Palette {
    scopes: HashMap<String, String>,
    variant: Variant,
    contrast: f64,
}

impl Palette {
    pub fn new(variant: Variant) -> Self {
        Self { scopes: HashMap::new(), variant, contrast: 7.1 }
    }

    /// Returns the hex for a scope, or the foreground as a fallback.
    pub fn resolve(&self, scope: &str) -> &str {
        self.scopes.get(scope).map(String::as_str).unwrap_or(FALLBACK)
    }
}

impl fmt::Display for Palette {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:?} ({} scopes)", self.variant, self.scopes.len())
    }
}`,
  },
  {
    tab: "CSS",
    filename: "theme.css",
    lang: "css",
    code: `:root {
  color-scheme: light dark;

  /* Every token declared once, resolved by color-scheme. */
  --syn-keyword: light-dark(#0098dd, #10b1fe);
  --syn-function: light-dark(#23974a, #3fc56b);
  --syn-string: light-dark(#c5a332, #f9c859);
  --syn-number: light-dark(#ce33c0, #ff78f8);

  --bg: light-dark(#f9f9f9, #282c34);
  --fg: light-dark(#383a42, #abb2bf);
}

.editor {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(26rem, 100%), 1fr));
  gap: 1rem;
  background: var(--bg);
  color: var(--fg);
}

.editor::after {
  content: "";
  inline-size: 2px;
  background: var(--syn-keyword);
  animation: blink 1.2s step-end infinite;
}

@media (prefers-reduced-motion: reduce) {
  .editor::after {
    animation: none;
  }
}`,
  },
];

async function loadTheme(file: string): Promise<ThemeRegistrationRaw> {
  const path = join(process.cwd(), "assets", "themes", file);
  return JSON.parse(await readFile(path, "utf8")) as ThemeRegistrationRaw;
}

export async function getSamples(): Promise<Sample[]> {
  const [dark, light] = await Promise.all([
    loadTheme("bluloco-dark.json"),
    loadTheme("bluloco-light.json"),
  ]);

  const highlighter = await createHighlighter({
    themes: [dark, light],
    langs: samples.map((s) => s.lang),
  });

  const out = samples.map(({ tab, filename, lang, code }) => ({
    tab,
    filename,
    html: highlighter.codeToHtml(code, {
      lang,
      themes: { light: "Bluloco Light", dark: "Bluloco Dark" },
      // Emit only CSS variables, no baked-in default colour, so the page
      // stylesheet decides which variant is visible.
      defaultColor: false,
    }),
  }));

  highlighter.dispose();
  return out;
}
