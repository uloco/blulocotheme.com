import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const title = "Bluloco — a fancy and sophisticated color scheme";
const description =
  "Dark and light color scheme for Neovim, VS Code, Zed, JetBrains and 20+ terminals.";

export const metadata: Metadata = {
  metadataBase: new URL("https://blulocotheme.com"),
  title: { default: title, template: "%s — Bluloco" },
  description,
  keywords: [
    "bluloco",
    "color scheme",
    "theme",
    "neovim",
    "vscode",
    "zed",
    "jetbrains",
    "syntax highlighting",
    "dark theme",
    "light theme",
  ],
  authors: [{ name: "Umut Topuzoğlu", url: "https://github.com/uloco" }],
  creator: "Umut Topuzoğlu",
  alternates: { canonical: "/" },
  // Icons and the OG/Twitter image come from the file conventions:
  // app/icon.svg, app/apple-icon.png and app/opengraph-image.tsx.
  openGraph: {
    type: "website",
    url: "https://blulocotheme.com",
    siteName: "Bluloco",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f9f9" },
    { media: "(prefers-color-scheme: dark)", color: "#282c34" },
  ],
};

/**
 * Applies the stored theme before first paint so the page never flashes the
 * wrong palette. No stored value means the OS setting wins, which is why the
 * attribute is removed rather than set to a default.
 */
const themeScript = `
try {
  var t = localStorage.getItem('theme');
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
