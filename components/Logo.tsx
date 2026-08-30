import { logoPaths, type LogoName } from "@/lib/logo-paths";

/** Editor and tool logos, rendered monochrome so they sit inside the palette. */
export function Logo({ name, size = 22 }: { name: LogoName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={logoPaths[name]} />
    </svg>
  );
}

/**
 * Stroke glyphs for targets with no logo in simple-icons: bat, lazygit,
 * opencode, Yazi, Mintty, Geany, yeet and friends. Drawn here rather than
 * guessed at as brand paths, so nothing renders as a garbled outline. Each one
 * hints at what the tool does instead of trying to be its logo.
 */
const glyphPaths = {
  /** Terminal. Fallback for shells and emulators, e.g. kitty, Mintty. */
  terminal: "M2 3h20v18H2zM7 9l3 3-3 3M13 15h4",
  /** Branching lines. Git tooling, e.g. lazygit. */
  git: "M6 3v12a3 3 0 0 0 3 3h6M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
  /** Page with lines. File viewers, e.g. bat. */
  file: "M14 3H6v18h12V7zM14 3v4h4M9 12h6M9 16h6",
  /** Spark. Agents and generated things, e.g. opencode. */
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4",
  /** Two panes. File managers, e.g. Yazi. */
  panes: "M3 4h18v16H3zM10 4v16",
  /** Angle brackets. Generic editors, e.g. Geany, yeet, Notepad++. */
  code: "M9 8l-4 4 4 4M15 8l4 4-4 4",
} as const;

export type GlyphName = keyof typeof glyphPaths;

export function Glyph({ name, size = 22 }: { name: GlyphName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={glyphPaths[name]} />
    </svg>
  );
}

/** Kept as a named export because the terminal cards reach for it directly. */
export function TerminalGlyph({ size = 22 }: { size?: number }) {
  return <Glyph name="terminal" size={size} />;
}

/** Renders whichever of the two an entry declares. */
export function PortIcon({
  logo,
  glyph,
  size = 22,
}: {
  logo?: LogoName | null;
  glyph?: GlyphName | null;
  size?: number;
}) {
  if (logo) return <Logo name={logo} size={size} />;
  if (glyph) return <Glyph name={glyph} size={size} />;
  return <Glyph name="terminal" size={size} />;
}
