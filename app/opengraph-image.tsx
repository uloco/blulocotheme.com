import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { scopes } from "@/lib/palette";

export const alt = "Bluloco — a fancy and sophisticated color scheme";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated at build time so there is no binary asset to keep in sync with the
 * palette. Satori only supports flexbox, so no grid here. The fonts are
 * vendored in assets/ rather than fetched, because Satori cannot read woff2 and
 * a build should not depend on a CDN being up. The banner is pre-rendered to
 * PNG because Satori cannot handle the complex SVG paths.
 */
export default async function OpengraphImage() {
  const assetsDir = join(process.cwd(), "assets");
  const fontDir = join(assetsDir, "fonts");
  const [regular, bold, bannerPng] = await Promise.all([
    readFile(join(fontDir, "inter-400.woff")),
    readFile(join(fontDir, "inter-700.woff")),
    readFile(join(assetsDir, "banner-dark.png")),
  ]);

  const bannerSrc = `data:image/png;base64,${bannerPng.toString("base64")}`;

  // Drop background and foreground: they are chrome, not palette.
  const swatches = scopes.slice(2);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#282c34",
          padding: "60px 80px",
          fontFamily: "Inter",
          gap: 36,
        }}
      >
        <img src={bannerSrc} alt="" width={560} height={171} />

        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#9aa4b6",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          A fancy and sophisticated color scheme for your favorite editors and terminals.
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          {swatches.map((scope) => (
            <div
              key={scope.token}
              style={{
                width: 72,
                height: 18,
                borderRadius: 999,
                background: scope.dark,
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", fontSize: 22, color: "#696b74", marginTop: 4 }}>
          Neovim · VS Code · Zed · JetBrains · 23 terminals
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
