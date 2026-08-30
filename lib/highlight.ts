import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  createHighlighter,
  type ShikiTransformer,
  type ThemeRegistrationRaw,
} from "shiki";

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
  {
    tab: "HTML",
    filename: "index.html",
    lang: "html",
    code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bluloco Theme</title>
    <link rel="stylesheet" href="/theme.css" />
  </head>
  <body>
    <header class="hero">
      <h1>Bluloco</h1>
      <p>A fancy but yet sophisticated color scheme.</p>
      <a href="#editors" class="cta">Get Started</a>
    </header>

    <section id="editors">
      <h2>Editors</h2>
      <ul>
        <li data-stars="457">Neovim</li>
        <li data-stars="1000000">VS Code</li>
        <li data-stars="5">Zed</li>
      </ul>
    </section>

    <!-- 23 terminals, 3 CLI tools -->
    <footer>
      <small>&copy; 2024 Bluloco</small>
    </footer>
  </body>
</html>`,
  },
  {
    tab: "Go",
    filename: "palette.go",
    lang: "go",
    code: `package palette

import (
\t"fmt"
\t"strings"
)

// Scope maps a token type to its hex colour.
type Scope struct {
\tName string
\tHex  string
}

// Palette holds both variants of Bluloco.
type Palette struct {
\tVariant  string
\tContrast float64
\tScopes   []Scope
}

// New returns a palette with no scopes.
func New(variant string) *Palette {
\treturn &Palette{
\t\tVariant:  variant,
\t\tContrast: 7.1,
\t}
}

// Resolve finds the hex for a scope name.
func (p *Palette) Resolve(name string) (string, bool) {
\tfor _, s := range p.Scopes {
\t\tif strings.EqualFold(s.Name, name) {
\t\t\treturn s.Hex, true
\t\t}
\t}
\treturn "", false
}

func (p *Palette) String() string {
\treturn fmt.Sprintf("%s (%d scopes)", p.Variant, len(p.Scopes))
}`,
  },
  {
    tab: "Swift",
    filename: "Palette.swift",
    lang: "swift",
    code: `import Foundation

enum Variant: String {
    case dark, light
}

struct Scope {
    let name: String
    let hex: String
}

/// A resolved Bluloco variant with its scopes.
struct Palette: CustomStringConvertible {
    let variant: Variant
    var contrast: Double = 7.1
    var scopes: [Scope] = []

    func resolve(_ name: String) -> String? {
        scopes.first { $0.name.caseInsensitiveCompare(name) == .orderedSame }?.hex
    }

    var description: String {
        "\\(variant.rawValue) (\\(scopes.count) scopes)"
    }
}

let theme = Palette(variant: .dark, scopes: [
    Scope(name: "keyword", hex: "#10b1fe"),
    Scope(name: "function", hex: "#3fc56b"),
])

for scope in theme.scopes {
    print("\\(scope.name.padding(toLength: 10, withPad: " ", startingAt: 0)) \\(scope.hex)")
}`,
  },
  {
    tab: "Kotlin",
    filename: "Palette.kt",
    lang: "kotlin",
    code: `package palette

data class Scope(val name: String, val hex: String)

enum class Variant { Dark, Light }

class Palette(
    val variant: Variant,
    val contrast: Double = 7.1,
    private val scopes: MutableList<Scope> = mutableListOf(),
) {
    /** Returns the hex for a scope, or null if not found. */
    fun resolve(name: String): String? =
        scopes.firstOrNull { it.name.equals(name, ignoreCase = true) }?.hex

    fun add(name: String, hex: String) {
        scopes += Scope(name, hex)
    }

    override fun toString(): String =
        "\${variant.name.lowercase()} (\${scopes.size} scopes)"
}

fun main() {
    val theme = Palette(Variant.Dark).apply {
        add("keyword", "#10b1fe")
        add("function", "#3fc56b")
        add("string", "#f9c859")
    }

    for ((name, hex) in theme.scopes) {
        println("\${name.padEnd(10)} $hex")
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

  const out = samples.map(({ tab, filename, lang, code }) => {
    let html = highlighter.codeToHtml(code, {
      lang,
      themes: { light: "Bluloco Light", dark: "Bluloco Dark" },
      // Emit only CSS variables, no baked-in default colour, so the page
      // stylesheet decides which variant is visible.
      defaultColor: false,
    });

    // Inject a blinking caret at the end of a non-empty line near the middle.
    const lineTag = '<span class="line">';
    const lineClose = "</span>";
    const parts = html.split(lineTag);
    const count = parts.length - 1;
    if (count > 2) {
      const mid = Math.ceil(count / 2);
      // Walk outward from the middle to find a line with visible content.
      let pick = -1;
      for (let d = 0; d <= count; d++) {
        for (const candidate of [mid + d, mid - d]) {
          if (candidate < 1 || candidate > count) continue;
          // parts[candidate] starts right after the opening <span class="line">.
          // An empty line has only "</span>" (possibly with a newline).
          const content = parts[candidate];
          const close = content.indexOf(lineClose);
          const before = content.slice(0, close);
          // Strip tags and whitespace to check for visible text.
          if (before.replace(/<[^>]*>/g, "").trim().length > 0) {
            pick = candidate;
            break;
          }
        }
        if (pick !== -1) break;
      }
      if (pick !== -1) {
        // Find the final </span> that closes this .line (last one in the part).
        const content = parts[pick];
        const close = content.lastIndexOf(lineClose);
        if (close !== -1) {
          parts[pick] =
            content.slice(0, close) +
            '<span class="caret"></span>' +
            content.slice(close);
        }
      }
      html = parts.join(lineTag);
    }

    return { tab, filename, html };
  });

  highlighter.dispose();
  return out;
}

/**
 * Highlight a batch of short code strings (e.g. install snippets) with the
 * Bluloco themes. Returns a Map from the original code string to its HTML.
 * Entries with lang "text" are skipped (no tokens to highlight).
 */
export async function highlightSnippets(
  entries: { code: string; lang: string }[],
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  const skip = new Set(["text", "sh", "ini"]);
  const toHighlight = entries.filter((e) => !skip.has(e.lang));
  if (toHighlight.length === 0) return result;

  const [dark, light] = await Promise.all([
    loadTheme("bluloco-dark.json"),
    loadTheme("bluloco-light.json"),
  ]);

  const langs = [...new Set(toHighlight.map((e) => e.lang))];

  const highlighter = await createHighlighter({
    themes: [dark, light],
    langs,
  });

  for (const { code, lang } of toHighlight) {
    const transformers: ShikiTransformer[] =
      lang === "lua" ? [luaTableTransformer()] : [];
    const html = highlighter.codeToHtml(code, {
      lang,
      themes: { light: "Bluloco Light", dark: "Bluloco Dark" },
      defaultColor: false,
      transformers,
    });
    result.set(code, html);
  }

  highlighter.dispose();
  return result;
}

/**
 * Lua's TextMate grammar scopes table keys as plain `variable.other` and
 * leaves braces/commas unscoped, so they all render as foreground. This
 * transformer re-colors them to match the property and punctuation scopes
 * that Bluloco targets.
 */
function luaTableTransformer(): ShikiTransformer {
  const PROP = { light: "#a05a48", dark: "#ce9887" };
  const PUNCT = { light: "#7a82da", dark: "#7a82da" };

  return {
    span(node) {
      const text = node.children
        .filter((c): c is { type: "text"; value: string } => c.type === "text")
        .map((c) => c.value)
        .join("");

      const trimmed = text.trim();
      if (!trimmed) return;

      // Table keys: identifier followed by ` =` on the same line.
      const isKey =
        /^[a-zA-Z_]\w*$/.test(trimmed) && this.source.includes(`${trimmed} =`);
      // Punctuation: braces and commas that Shiki left as foreground.
      const isPunct = /^[{},]+$/.test(trimmed);

      if (!isKey && !isPunct) return;

      const colors = isKey ? PROP : PUNCT;
      const style = node.properties.style as string | undefined;
      if (!style) return;

      node.properties.style = style
        .replace(/--shiki-light:[^;]+/, `--shiki-light:${colors.light}`)
        .replace(/--shiki-dark:[^;]+/, `--shiki-dark:${colors.dark}`);
    },
  };
}
