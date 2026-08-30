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
 * a build should not depend on a CDN being up.
 */
export default async function OpengraphImage() {
  const fontDir = join(process.cwd(), "assets", "fonts");
  const [regular, bold] = await Promise.all([
    readFile(join(fontDir, "inter-400.woff")),
    readFile(join(fontDir, "inter-700.woff")),
  ]);

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
          justifyContent: "space-between",
          background: "#282c34",
          padding: "72px 80px",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#9aa4b6" }}>
            BLULOCOTHEME.COM
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", marginTop: 24 }}>
            <div style={{ fontSize: 132, fontWeight: 700, color: "#cdd3e0", lineHeight: 1 }}>
              Bluloco
            </div>
            {/* The editor caret, same detail as the site hero. */}
            <div
              style={{
                width: 9,
                height: 100,
                background: "#ffcc00",
                marginLeft: 12,
                marginBottom: 8,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              color: "#9aa4b6",
              marginTop: 28,
              maxWidth: 900,
            }}
          >
            A fancy and sophisticated color scheme. Dark and light.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {swatches.map((scope) => (
              <div
                key={scope.token}
                style={{
                  width: 78,
                  height: 20,
                  borderRadius: 999,
                  background: scope.dark,
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#9aa4b6", marginTop: 30 }}>
            Neovim · VS Code · Zed · JetBrains · 23 terminals
          </div>
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
