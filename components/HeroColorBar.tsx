"use client";

import { useState } from "react";
import { scopes } from "@/lib/palette";
import styles from "./HeroColorBar.module.css";

const colors = scopes.slice(2); // skip bg and fg

/**
 * The syntax palette as a row of pills. Hovering or focusing one grows it and
 * names the scope in the caption below. A shared caption is used instead of
 * per-pill tooltips so the same interaction works on touch, where there is no
 * hover: the pills are real buttons, so a tap focuses them.
 */
export function HeroColorBar() {
  const [active, setActive] = useState<number | null>(null);
  const current = active === null ? null : colors[active];

  return (
    <div className={styles.wrap}>
      <div className={styles.bar} onMouseLeave={() => setActive(null)}>
        {colors.map((s, i) => (
          <button
            key={s.token}
            type="button"
            className={styles.pill}
            data-active={i === active || undefined}
            style={{ background: `var(--syn-${s.token})` }}
            aria-label={s.name}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
      <p className={styles.caption} aria-live="polite">
        {current ? (
          <>
            <span className={styles.name}>{current.name}</span>
            <span className={styles.hexDark}>{current.dark}</span>
            <span className={styles.hexLight}>{current.light}</span>
          </>
        ) : (
          <span className={styles.hint}>Thirteen scopes, one meaning each</span>
        )}
      </p>
    </div>
  );
}
