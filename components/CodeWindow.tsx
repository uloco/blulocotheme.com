"use client";

import { useState } from "react";
import type { Sample } from "@/lib/highlight";
import styles from "./CodeWindow.module.css";

/**
 * The samples arrive pre-highlighted from the server (see lib/highlight.ts).
 * This component only owns which tab is open, so no highlighting code or
 * grammar payload reaches the browser.
 */
export function CodeWindow({ samples }: { samples: Sample[] }) {
  const [active, setActive] = useState(0);
  const sample = samples[active];

  return (
    <div className={styles.window}>
      <div className={styles.titlebar}>
        <span className={styles.lights} aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.filename}>{sample.filename}</span>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Language">
        {samples.map((s, i) => (
          <button
            key={s.tab}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={i === active ? styles.tabActive : styles.tab}
            onClick={() => setActive(i)}
          >
            {s.tab}
          </button>
        ))}
      </div>

      <div
        className={styles.code}
        // Shiki output, generated at build time from our own theme files.
        dangerouslySetInnerHTML={{ __html: sample.html }}
      />
    </div>
  );
}
