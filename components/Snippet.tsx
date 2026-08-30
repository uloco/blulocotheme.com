"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Snippet.module.css";

type Props = {
  code: string;
  /** Shown in the header bar, e.g. "lua" or "sh". */
  lang: string;
  /** Steps rather than code. Skips the header bar and copy button. */
  plain?: boolean;
};

export function Snippet({ code, lang, plain = false }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Without this the timer can fire after the card unmounts.
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      return; // No clipboard permission. Nothing useful to say.
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className={styles.block} data-plain={plain || undefined}>
      {plain ? null : (
        <div className={styles.header}>
          <span className={styles.lang}>{lang}</span>
          <button
            type="button"
            className={styles.copy}
            data-copied={copied || undefined}
            onClick={copy}
            aria-label={copied ? "Copied" : `Copy ${lang} snippet`}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        </div>
      )}
      <pre className={styles.pre}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
