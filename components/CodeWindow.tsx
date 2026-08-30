"use client";

import { useState, type ReactNode } from "react";
import styles from "./CodeWindow.module.css";

type ScopeName =
  | "comment"
  | "keyword"
  | "function"
  | "property"
  | "string"
  | "number"
  | "constant"
  | "tag"
  | "attribute"
  | "type"
  | "operator"
  | "punct";

function T({ s, children }: { s: ScopeName; children: ReactNode }) {
  return <span className={styles[s]}>{children}</span>;
}

type Language = {
  tab: string;
  filename: string;
  lines: ReactNode[];
};

const languages: Language[] = [
  {
    tab: "TypeScript",
    filename: "theme.ts",
    lines: [
      <>
        <T s="keyword">interface</T> <T s="type">Palette</T> <T s="punct">{"{"}</T>
      </>,
      <>
        {"  "}
        <T s="property">background</T>
        <T s="operator">:</T> <T s="type">string</T>
        <T s="punct">;</T>
      </>,
      <>
        {"  "}
        <T s="property">foreground</T>
        <T s="operator">:</T> <T s="type">string</T>
        <T s="punct">;</T>
      </>,
      <>
        {"  "}
        <T s="property">accent</T>
        <T s="operator">:</T> <T s="type">string</T>
        <T s="punct">;</T>
      </>,
      <>
        <T s="punct">{"}"}</T>
      </>,
      <></>,
      <>
        <T s="keyword">const</T> <T s="property">dark</T>
        <T s="operator">:</T> <T s="type">Palette</T> <T s="operator">=</T>{" "}
        <T s="punct">{"{"}</T>
      </>,
      <>
        {"  "}
        <T s="property">background</T>
        <T s="operator">:</T> <T s="string">&quot;#282c34&quot;</T>
        <T s="punct">,</T>
      </>,
      <>
        {"  "}
        <T s="property">foreground</T>
        <T s="operator">:</T> <T s="string">&quot;#abb2bf&quot;</T>
        <T s="punct">,</T>
      </>,
      <>
        {"  "}
        <T s="property">accent</T>
        <T s="operator">:</T> <T s="string">&quot;#3691ff&quot;</T>
        <T s="punct">,</T>
      </>,
      <>
        <T s="punct">{"}"}</T>
        <T s="punct">;</T>
      </>,
      <></>,
      <>
        <T s="keyword">export function</T> <T s="function">resolve</T>
        <T s="punct">(</T>
        <T s="property">scope</T>
        <T s="operator">:</T> <T s="type">Scope</T>
        <T s="punct">)</T>
        <T s="operator">:</T> <T s="type">string</T> <T s="punct">{"{"}</T>
      </>,
      <>
        {"  "}
        <T s="keyword">return</T> <T s="property">dark</T>
        <T s="punct">[</T>
        <T s="property">scope</T>
        <T s="punct">]</T> <T s="operator">??</T> <T s="property">dark</T>
        <T s="punct">.</T>
        <T s="property">foreground</T>
        <T s="punct">;</T>
      </>,
      <>
        <T s="punct">{"}"}</T>
      </>,
    ],
  },
  {
    tab: "Python",
    filename: "palette.py",
    lines: [
      <>
        <T s="keyword">from</T> <T s="property">dataclasses</T> <T s="keyword">import</T>{" "}
        <T s="type">dataclass</T>
      </>,
      <></>,
      <>
        <T s="constant">@dataclass</T>
      </>,
      <>
        <T s="keyword">class</T> <T s="type">Palette</T>
        <T s="punct">:</T>
      </>,
      <>
        {"  "}
        <T s="comment">{"# Bluloco dark defaults"}</T>
      </>,
      <>
        {"  "}
        <T s="property">background</T>
        <T s="operator">:</T> <T s="type">str</T> <T s="operator">=</T>{" "}
        <T s="string">&quot;#282c34&quot;</T>
      </>,
      <>
        {"  "}
        <T s="property">foreground</T>
        <T s="operator">:</T> <T s="type">str</T> <T s="operator">=</T>{" "}
        <T s="string">&quot;#abb2bf&quot;</T>
      </>,
      <>
        {"  "}
        <T s="property">contrast</T>
        <T s="operator">:</T> <T s="type">float</T> <T s="operator">=</T>{" "}
        <T s="number">7.1</T>
      </>,
      <></>,
      <>
        {"  "}
        <T s="keyword">def</T> <T s="function">resolve</T>
        <T s="punct">(</T>
        <T s="property">self</T>
        <T s="punct">,</T> <T s="property">scope</T>
        <T s="operator">:</T> <T s="type">str</T>
        <T s="punct">)</T> <T s="operator">-&gt;</T> <T s="type">str</T>
        <T s="punct">:</T>
      </>,
      <>
        {"    "}
        <T s="keyword">return</T> <T s="function">getattr</T>
        <T s="punct">(</T>
        <T s="property">self</T>
        <T s="punct">,</T> <T s="property">scope</T>
        <T s="punct">,</T> <T s="property">self</T>
        <T s="punct">.</T>
        <T s="property">foreground</T>
        <T s="punct">)</T>
      </>,
      <></>,
      <>
        <T s="property">theme</T> <T s="operator">=</T> <T s="type">Palette</T>
        <T s="punct">()</T>
      </>,
      <>
        <T s="function">print</T>
        <T s="punct">(</T>
        <T s="property">theme</T>
        <T s="punct">.</T>
        <T s="function">resolve</T>
        <T s="punct">(</T>
        <T s="string">&quot;background&quot;</T>
        <T s="punct">))</T>
      </>,
    ],
  },
  {
    tab: "Rust",
    filename: "palette.rs",
    lines: [
      <>
        <T s="keyword">use</T> <T s="property">std</T>
        <T s="operator">::</T>
        <T s="property">collections</T>
        <T s="operator">::</T>
        <T s="type">HashMap</T>
        <T s="punct">;</T>
      </>,
      <></>,
      <>
        <T s="keyword">struct</T> <T s="type">Palette</T> <T s="punct">{"{"}</T>
      </>,
      <>
        {"  "}
        <T s="property">scopes</T>
        <T s="operator">:</T> <T s="type">HashMap</T>
        <T s="operator">&lt;</T>
        <T s="type">String</T>
        <T s="punct">,</T> <T s="type">String</T>
        <T s="operator">&gt;</T>
        <T s="punct">,</T>
      </>,
      <>
        {"  "}
        <T s="property">contrast</T>
        <T s="operator">:</T> <T s="type">f64</T>
        <T s="punct">,</T>
      </>,
      <>
        <T s="punct">{"}"}</T>
      </>,
      <></>,
      <>
        <T s="keyword">impl</T> <T s="type">Palette</T> <T s="punct">{"{"}</T>
      </>,
      <>
        {"  "}
        <T s="keyword">fn</T> <T s="function">resolve</T>
        <T s="punct">(</T>
        <T s="operator">&amp;</T>
        <T s="property">self</T>
        <T s="punct">,</T> <T s="property">scope</T>
        <T s="operator">:</T> <T s="operator">&amp;</T>
        <T s="type">str</T>
        <T s="punct">)</T> <T s="operator">-&gt;</T> <T s="operator">&amp;</T>
        <T s="type">str</T> <T s="punct">{"{"}</T>
      </>,
      <>
        {"    "}
        <T s="keyword">const</T> <T s="constant">FALLBACK</T>
        <T s="operator">:</T> <T s="operator">&amp;</T>
        <T s="type">str</T> <T s="operator">=</T> <T s="string">&quot;#abb2bf&quot;</T>
        <T s="punct">;</T>
      </>,
      <>
        {"    "}
        <T s="property">self</T>
        <T s="punct">.</T>
        <T s="property">scopes</T>
        <T s="punct">.</T>
        <T s="function">get</T>
        <T s="punct">(</T>
        <T s="property">scope</T>
        <T s="punct">)</T>
        <T s="punct">.</T>
        <T s="function">map</T>
        <T s="punct">(|</T>
        <T s="property">s</T>
        <T s="punct">|</T> <T s="property">s</T>
        <T s="punct">.</T>
        <T s="function">as_str</T>
        <T s="punct">())</T>
        <T s="punct">.</T>
        <T s="function">unwrap_or</T>
        <T s="punct">(</T>
        <T s="constant">FALLBACK</T>
        <T s="punct">)</T>
      </>,
      <>
        {"  "}
        <T s="punct">{"}"}</T>
      </>,
      <>
        <T s="punct">{"}"}</T>
      </>,
    ],
  },
  {
    tab: "HTML",
    filename: "index.html",
    lines: [
      <>
        <T s="operator">&lt;!</T>
        <T s="keyword">DOCTYPE</T> <T s="tag">html</T>
        <T s="operator">&gt;</T>
      </>,
      <>
        <T s="punct">&lt;</T>
        <T s="tag">html</T> <T s="attribute">lang</T>
        <T s="operator">=</T>
        <T s="string">&quot;en&quot;</T> <T s="attribute">data-theme</T>
        <T s="operator">=</T>
        <T s="string">&quot;dark&quot;</T>
        <T s="punct">&gt;</T>
      </>,
      <>
        <T s="punct">&lt;</T>
        <T s="tag">head</T>
        <T s="punct">&gt;</T>
      </>,
      <>
        {"  "}
        <T s="punct">&lt;</T>
        <T s="tag">meta</T> <T s="attribute">charset</T>
        <T s="operator">=</T>
        <T s="string">&quot;utf-8&quot;</T> <T s="punct">/&gt;</T>
      </>,
      <>
        {"  "}
        <T s="punct">&lt;</T>
        <T s="tag">title</T>
        <T s="punct">&gt;</T>
        Bluloco Theme
        <T s="punct">&lt;/</T>
        <T s="tag">title</T>
        <T s="punct">&gt;</T>
      </>,
      <>
        {"  "}
        <T s="punct">&lt;</T>
        <T s="tag">link</T> <T s="attribute">rel</T>
        <T s="operator">=</T>
        <T s="string">&quot;stylesheet&quot;</T> <T s="attribute">href</T>
        <T s="operator">=</T>
        <T s="string">&quot;/style.css&quot;</T> <T s="punct">/&gt;</T>
      </>,
      <>
        <T s="punct">&lt;/</T>
        <T s="tag">head</T>
        <T s="punct">&gt;</T>
      </>,
      <>
        <T s="punct">&lt;</T>
        <T s="tag">body</T>
        <T s="punct">&gt;</T>
      </>,
      <>
        {"  "}
        <T s="comment">{"<!-- 13 syntax scopes, each with a purpose -->"}</T>
      </>,
      <>
        {"  "}
        <T s="punct">&lt;</T>
        <T s="tag">main</T> <T s="attribute">class</T>
        <T s="operator">=</T>
        <T s="string">&quot;editor&quot;</T>
        <T s="punct">&gt;</T>
      </>,
      <>
        {"    "}
        <T s="punct">&lt;</T>
        <T s="tag">h1</T>
        <T s="punct">&gt;</T>
        Bluloco
        <T s="punct">&lt;/</T>
        <T s="tag">h1</T>
        <T s="punct">&gt;</T>
      </>,
      <>
        {"    "}
        <T s="punct">&lt;</T>
        <T s="tag">p</T>
        <T s="punct">&gt;</T>
        A fancy color scheme.
        <T s="punct">&lt;/</T>
        <T s="tag">p</T>
        <T s="punct">&gt;</T>
      </>,
      <>
        {"  "}
        <T s="punct">&lt;/</T>
        <T s="tag">main</T>
        <T s="punct">&gt;</T>
      </>,
      <>
        {"  "}
        <T s="punct">&lt;</T>
        <T s="tag">script</T> <T s="attribute">src</T>
        <T s="operator">=</T>
        <T s="string">&quot;/app.js&quot;</T>
        <T s="punct">&gt;&lt;/</T>
        <T s="tag">script</T>
        <T s="punct">&gt;</T>
      </>,
      <>
        <T s="punct">&lt;/</T>
        <T s="tag">body</T>
        <T s="punct">&gt;</T>
      </>,
      <>
        <T s="punct">&lt;/</T>
        <T s="tag">html</T>
        <T s="punct">&gt;</T>
      </>,
    ],
  },
];

export function CodeWindow() {
  const [activeIdx, setActiveIdx] = useState(0);
  const lang = languages[activeIdx];

  return (
    <div className={styles.window}>
      <div className={styles.titlebar}>
        <span className={styles.lights} aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.filename}>{lang.filename}</span>
      </div>
      <div className={styles.tabs}>
        {languages.map((l, i) => (
          <button
            key={l.tab}
            type="button"
            className={i === activeIdx ? styles.tabActive : styles.tab}
            onClick={() => setActiveIdx(i)}
          >
            {l.tab}
          </button>
        ))}
      </div>
      <pre className={styles.code}>
        <code>
          {lang.lines.map((line, i) => (
            <span key={i} className={styles.line}>
              <span className={styles.gutter} aria-hidden>
                {i + 1}
              </span>
              <span className={styles.content}>{line}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
