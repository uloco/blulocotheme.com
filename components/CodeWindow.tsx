import type { ReactNode } from "react";
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

/** A single syntax token. Short name because the sample below is dense with them. */
function T({ s, children }: { s: ScopeName; children: ReactNode }) {
  return <span className={styles[s]}>{children}</span>;
}

/**
 * The sample is hand tokenized rather than run through a highlighter. It is the
 * one place on the site where every scope must be exactly right, and a real
 * grammar would pull in a parser for sixteen lines of code.
 */
const lines: ReactNode[] = [
  <>
    <T s="keyword">import</T> <T s="punct">{"{"}</T> useTheme <T s="punct">{"}"}</T>{" "}
    <T s="keyword">from</T> <T s="string">&quot;@bluloco/react&quot;</T>
    <T s="punct">;</T>
  </>,
  <></>,
  <>
    {/* Braces required: a bare // in JSX children trips react/jsx-no-comment-textnodes. */}
    <T s="comment">{"// Thirteen scopes. Every one of them earns its place."}</T>
  </>,
  <>
    <T s="keyword">export function</T> <T s="function">Editor</T>
    <T s="punct">(</T>
    <T s="punct">{"{ "}</T>
    <T s="property">scope</T>
    <T s="punct">{" }"}</T>
    <T s="operator">:</T> <T s="type">EditorProps</T>
    <T s="punct">)</T> <T s="punct">{"{"}</T>
  </>,
  <>
    {"  "}
    <T s="keyword">const</T> <T s="punct">{"{ "}</T>
    <T s="property">palette</T>
    <T s="punct">, </T>
    <T s="property">isDark</T>
    <T s="punct">{" }"}</T> <T s="operator">=</T> <T s="function">useTheme</T>
    <T s="punct">()</T>
    <T s="punct">;</T>
  </>,
  <>
    {"  "}
    <T s="keyword">const</T> <T s="property">contrast</T> <T s="operator">=</T>{" "}
    <T s="number">7.1</T>
    <T s="punct">;</T>
  </>,
  <></>,
  <>
    {"  "}
    <T s="keyword">if</T> <T s="punct">(</T>
    <T s="property">palette</T> <T s="operator">===</T> <T s="constant">null</T>
    <T s="punct">)</T> <T s="keyword">return</T> <T s="constant">null</T>
    <T s="punct">;</T>
  </>,
  <></>,
  <>
    {"  "}
    <T s="keyword">return</T> <T s="punct">(</T>
  </>,
  <>
    {"    "}
    <T s="punct">&lt;</T>
    <T s="tag">pre</T> <T s="attribute">className</T>
    <T s="operator">=</T>
    <T s="string">&quot;bluloco&quot;</T> <T s="attribute">data-dark</T>
    <T s="operator">=</T>
    <T s="punct">{"{"}</T>
    <T s="property">isDark</T>
    <T s="punct">{"}"}</T>
    <T s="punct">&gt;</T>
  </>,
  <>
    {"      "}
    <T s="punct">{"{"}</T>
    <T s="property">scope</T>
    <T s="punct">.</T>
    <T s="property">tokens</T>
    <T s="punct">.</T>
    <T s="function">map</T>
    <T s="punct">((</T>
    <T s="property">token</T>
    <T s="punct">) </T>
    <T s="operator">=&gt;</T>
    <T s="punct"> (</T>
  </>,
  <>
    {"        "}
    <T s="punct">&lt;</T>
    <T s="tag">span</T> <T s="attribute">style</T>
    <T s="operator">=</T>
    <T s="punct">{"{"}</T>
    <T s="property">palette</T>
    <T s="punct">.</T>
    <T s="function">resolve</T>
    <T s="punct">(</T>
    <T s="property">token</T>
    <T s="punct">)</T>
    <T s="punct">{"}"}</T>
    <T s="punct">&gt;</T>
  </>,
  <>
    {"          "}
    <T s="punct">{"{"}</T>
    <T s="property">token</T>
    <T s="punct">.</T>
    <T s="property">text</T>
    <T s="punct">{"}"}</T>
  </>,
  <>
    {"        "}
    <T s="punct">&lt;/</T>
    <T s="tag">span</T>
    <T s="punct">&gt;</T>
  </>,
  <>
    {"      "}
    <T s="punct">))</T>
    <T s="punct">{"}"}</T>
  </>,
  <>
    {"    "}
    <T s="punct">&lt;/</T>
    <T s="tag">pre</T>
    <T s="punct">&gt;</T>
  </>,
  <>
    {"  "}
    <T s="punct">)</T>
    <T s="punct">;</T>
  </>,
  <>
    <T s="punct">{"}"}</T>
  </>,
];

/** Zero-based index of the line the fake cursor sits on. */
const activeLine = 5;

export function CodeWindow() {
  return (
    <div className={styles.window}>
      <div className={styles.titlebar}>
        <span className={styles.lights} aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.filename}>Editor.tsx</span>
      </div>
      <div className={styles.tabs} aria-hidden>
        <span className={styles.tabActive}>Editor.tsx</span>
        <span className={styles.tab}>palette.ts</span>
        <span className={styles.tab}>theme.json</span>
      </div>
      <pre className={styles.code}>
        <code>
          {lines.map((line, i) => (
            <span key={i} className={styles.line} data-active={i === activeLine || undefined}>
              <span className={styles.gutter} aria-hidden>
                {i + 1}
              </span>
              <span className={styles.content}>
                {line}
                {i === activeLine ? <span className={styles.caret} aria-hidden /> : null}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
