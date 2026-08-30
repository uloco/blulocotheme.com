import type { GlyphName } from "@/components/Logo";
import type { LogoName } from "./logo-paths";

export type Port = {
  /** Display name of the editor or tool. */
  name: string;
  /** One line, plain. */
  blurb: string;
  logo: LogoName | null;
  /** Stroke glyph, for targets with no logo in simple-icons. */
  glyph?: GlyphName;
  /** owner/repo on GitHub, used for the star count. */
  repo: string | null;
  /** Where the button sends you. */
  href: string;
  /** Label for the primary button. */
  hrefLabel: string;
  /** Copy-paste install snippet. */
  install: { lang: string; code: string } | null;
  /** Extra note shown under the snippet. */
  note?: string;
};

/** Ports maintained by uloco. These carry the site. */
export const editors: Port[] = [
  {
    name: "Neovim",
    blurb: "Written in Lua with lush.nvim, and it follows your system light or dark mode on its own.",
    logo: "neovim",
    repo: "uloco/bluloco.nvim",
    href: "https://github.com/uloco/bluloco.nvim",
    hrefLabel: "View on GitHub",
    install: {
      lang: "lua",
      code: `{
  'uloco/bluloco.nvim',
  lazy = false,
  priority = 1000,
  dependencies = { 'rktjmp/lush.nvim' },
  opts = {},
}`,
    },
    note: "A lazy.nvim spec, with 40+ plugin integrations, treesitter and LSP semantic tokens.",
  },
  {
    name: "VS Code",
    blurb: "Where Bluloco started, with dark and light variants and an italic version of each.",
    logo: "vscode",
    repo: "uloco/theme-bluloco-dark",
    href: "https://marketplace.visualstudio.com/items?itemName=uloco.theme-bluloco-dark",
    hrefLabel: "Get on Marketplace",
    install: {
      lang: "sh",
      code: `code --install-extension uloco.theme-bluloco-dark
code --install-extension uloco.theme-bluloco-light`,
    },
    note: "Works the same in Cursor, Windsurf and VSCodium.",
  },
  {
    name: "Zed",
    blurb: "All four variants bundled into a single extension.",
    logo: "zed",
    repo: "uloco/bluloco-zed",
    href: "https://github.com/uloco/bluloco-zed",
    hrefLabel: "View on GitHub",
    install: {
      lang: "json",
      code: `{
  "theme": {
    "mode": "system",
    "light": "Bluloco Light",
    "dark": "Bluloco Dark"
  }
}`,
    },
    note: "Open zed: extensions first and search for Bluloco.",
  },
  {
    name: "JetBrains IDEs",
    blurb: "Color schemes for IntelliJ, WebStorm, PyCharm and the rest of the family.",
    logo: "jetbrains",
    repo: "uloco/webstorm-bluloco-scheme",
    href: "https://github.com/uloco/webstorm-bluloco-scheme",
    hrefLabel: "Download the schemes",
    install: {
      lang: "text",
      code: `1. Download Bluloco Dark.icls and Bluloco Light.icls
2. Settings > Editor > Color Scheme
3. Click the gear icon > Import Scheme…
4. Select the .icls file`,
    },
    note: "Import the .icls files manually for now, an official plugin is coming.",
  },
];

/** Terminal emulators that already ship Bluloco. Nothing to download. */
export const terminals: Port[] = [
  {
    name: "Ghostty",
    blurb: "Built in, with both variants and optional switching alongside your system appearance.",
    logo: "ghostty",
    repo: null,
    href: "https://ghostty.org/docs/config/reference#theme",
    hrefLabel: "Ghostty docs",
    install: {
      lang: "ini",
      code: `theme = dark:Bluloco Dark,light:Bluloco Light`,
    },
  },
  {
    name: "WezTerm",
    blurb: "Also built in, so you only need to name the scheme.",
    logo: "wezterm",
    repo: null,
    href: "https://wezterm.org/colorschemes/b/index.html",
    hrefLabel: "WezTerm schemes",
    install: {
      lang: "lua",
      code: `config.color_scheme = 'BlulocoDark'`,
    },
  },
  {
    name: "kitty",
    blurb: "Bundled through kitty-themes and applied with a single command.",
    logo: null,
    glyph: "terminal",
    repo: null,
    href: "https://github.com/kovidgoyal/kitty-themes",
    hrefLabel: "kitty-themes",
    install: {
      lang: "sh",
      code: `kitten themes BlulocoDark`,
    },
  },
];

/**
 * The remaining targets in bluloco.nvim/terminal-themes. Together with the
 * three featured above this is the full set of 23, which is the number the
 * hero stat quotes. Keep the two in step.
 */
export const otherTerminals = [
  "iTerm2",
  "Apple Terminal",
  "Alacritty",
  "Konsole",
  "Windows Terminal",
  "PuTTY",
  "Terminator",
  "termite",
  "Tilda",
  "xfce4-terminal",
  "LXTerminal",
  "MobaXterm",
  "Pantheon",
  "electerm",
  "Remmina",
  "Royal TS",
  "FreeBSD vt",
  "dynamic-colors",
  "Xresources",
  "xrdb",
];

/** Featured terminals plus the rest. Used by the hero stat. */
export const terminalCount = 3 + otherTerminals.length;

/** Tools with a Bluloco theme. Not editors, not terminals: the things around
 *  them. Browsers and similar will land here too. */
export const tools: {
  name: string;
  blurb: string;
  href: string;
  logo?: LogoName;
  glyph?: GlyphName;
}[] = [
  {
    name: "bat",
    blurb: "Syntax themes for the file previewer",
    href: "https://github.com/uloco/bluloco.nvim/tree/main/extra/bat",
    glyph: "file",
  },
  {
    name: "lazygit",
    blurb: "Matching dark and light configs",
    href: "https://github.com/uloco/bluloco.nvim/tree/main/extra/lazygit",
    glyph: "git",
  },
  {
    name: "opencode",
    blurb: "For the terminal coding agent",
    href: "https://github.com/uloco/bluloco-opencode",
    glyph: "spark",
  },
];

export type CommunityPort = {
  name: string;
  author: string;
  repo: string;
  variants: string;
  logo?: LogoName;
  glyph?: GlyphName;
};

/** Ports by other people. Verified to contain real theme files. */
export const community: CommunityPort[] = [
  { name: "Helix", author: "DeviousStoat", repo: "DeviousStoat/bluloco.helix", variants: "dark, light", logo: "helix" },
  { name: "Vim", author: "DanBradbury", repo: "DanBradbury/bluloco.vim", variants: "dark, light", logo: "vim" },
  { name: "Yazi", author: "hankertrix", repo: "hankertrix/bluloco-yazi", variants: "dark, light", glyph: "panes" },
  { name: "Replit", author: "hankertrix", repo: "hankertrix/bluloco.replit", variants: "dark, light", logo: "replit" },
  { name: "Mintty, Git Bash", author: "userhiren", repo: "userhiren/mintty-bluloco", variants: "dark, light", glyph: "terminal" },
  { name: "Notepad++", author: "Fatal1tyBarucco", repo: "Fatal1tyBarucco/Bluloco-Dark-Theme-for-Notepad-Plus-Plus", variants: "dark", glyph: "code" },
  { name: "Geany", author: "wibare", repo: "wibare/bluloco-dark-geany", variants: "dark", glyph: "code" },
  { name: "yeet", author: "aserowy", repo: "aserowy/yeet-bluloco-theme", variants: "dark, light", glyph: "panes" },
];

export const links = {
  github: "https://github.com/uloco",
  author: "https://github.com/uloco",
  buyMeACoffee: "https://www.buymeacoffee.com/umipaloomi",
  paypal: "https://www.paypal.com/donate/?hosted_button_id=YSDKWM2D66GZJ",
  samples: "https://github.com/uloco/syntax-highlighting-samples",
};
