/**
 * The Bluloco palette, extracted from the VSCode theme sources.
 * Dark:  theme-bluloco-dark/themes/bluloco-dark-color-theme.json
 * Light: theme-bluloco-light/themes/bluloco-light-color-theme.json
 *
 * This is the single source of truth. The website chrome and the syntax
 * samples both read from here, so the site is literally painted in the theme.
 */

export type Scope = {
  /** Display name of the syntax scope. */
  name: string;
  /** Token class used by the code sample renderer. */
  token: string;
  dark: string;
  light: string;
};

/** The 13 syntax scopes documented in both theme READMEs. */
export const scopes: Scope[] = [
  { name: "Background", token: "bg", dark: "#282c34", light: "#f9f9f9" },
  { name: "Foreground", token: "fg", dark: "#abb2bf", light: "#383a42" },
  { name: "Comment", token: "comment", dark: "#636d83", light: "#a0a1a7" },
  { name: "Keyword", token: "keyword", dark: "#10b1fe", light: "#0098dd" },
  { name: "Function", token: "function", dark: "#3fc56b", light: "#23974a" },
  { name: "Property", token: "property", dark: "#ce9887", light: "#a05a48" },
  { name: "String", token: "string", dark: "#f9c859", light: "#c5a332" },
  { name: "Number", token: "number", dark: "#ff78f8", light: "#ce33c0" },
  { name: "Constant", token: "constant", dark: "#9f7efe", light: "#823ff1" },
  { name: "Markup Tag", token: "tag", dark: "#3691ff", light: "#275fe4" },
  { name: "Markup Attribute", token: "attribute", dark: "#ff936a", light: "#df631c" },
  { name: "Class / Type", token: "type", dark: "#ff6480", light: "#d52753" },
  { name: "Operator", token: "operator", dark: "#7a82da", light: "#7a82da" },
];

/**
 * UI chrome colors, taken from the same theme files so the page furniture
 * matches what you see inside the editor.
 */
export const ui = {
  dark: {
    bg: "#282c34", // editor.background
    surface: "#2d333d", // activityBar.background
    sunken: "#22252a", // sideBar.background
    overlay: "#20242a", // dropdown.background
    border: "#3d434f", // panel.border
    borderStrong: "#404753", // titleBar.activeBackground
    fg: "#abb2bf", // editor.foreground
    fgBright: "#cdd3e0", // grey-palette #2
    fgMuted: "#636d83", // editorLineNumber.foreground
    accent: "#3691ff", // focusBorder / textLink.foreground
    accentHover: "#10b1fe", // keyword
    accentContrast: "#ffffff",
    caret: "#ffcc00", // editorCursor.foreground
    selection: "#0084ff4b", // editor.selectionBackground
  },
  light: {
    bg: "#f9f9f9", // editor.background
    surface: "#ffffff",
    sunken: "#f1f1f1", // activityBar.background
    overlay: "#e8e8e8", // dropdown.background
    border: "#d5d7d8", // panel.border
    borderStrong: "#c2c4c7", // titleBar.activeBackground
    fg: "#383a42", // editor.foreground
    fgBright: "#1c1d21",
    fgMuted: "#a0a1a7", // editorLineNumber.foreground
    accent: "#275fe4", // markup tag, best contrast on light
    accentHover: "#0098dd", // keyword
    accentContrast: "#ffffff",
    caret: "#f31459", // editorCursor.foreground
    selection: "#d2ecff", // editor.selectionBackground
  },
} as const;
