import { logoPaths, type LogoName } from "@/lib/logo-paths";

/** Editor and tool logos, rendered monochrome so they sit inside the palette. */
export function Logo({ name, size = 22 }: { name: LogoName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={logoPaths[name]} />
    </svg>
  );
}

/** Fallback for targets with no logo in simple-icons, e.g. kitty. */
export function TerminalGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <path d="m7 9 3 3-3 3m6 0h4" />
    </svg>
  );
}
