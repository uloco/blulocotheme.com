"use client";

import { useCallback, useRef, useState } from "react";
import { scopes } from "@/lib/palette";
import styles from "./HeroColorBar.module.css";

const colors = scopes.slice(2); // skip bg and fg

/** How many neighbours on each side are affected by the magnification. */
const REACH = 2;
/** Extra scale at the cursor. 0 = flat, 1 = full boost. */
const MAX_BOOST = 1;

/** Layout constants. Width changes push neighbours aside, Dock style. The bar
 *  has a fixed height, so vertical growth never moves content below it. */
const BASE_W = 44;
const BASE_H = 16;
const MAX_H = 40;
/** Extra width a non-active neighbour gains at full boost. */
const NEIGHBOUR_W_GAIN = 10;
/** Rough px per character at the label font size, plus inner padding. */
const CHAR_W = 6.1;
const LABEL_PAD = 24;

/** Cosine falloff, 1 at the cursor down to 0 past REACH. */
function boostAt(distance: number): number {
  if (distance > REACH) return 0;
  const t = 1 - distance / (REACH + 1);
  return (Math.cos((1 - t) * Math.PI) + 1) / 2;
}

/**
 * macOS Dock-style magnification on the syntax palette pills. The hovered pill
 * grows and widens to fit its scope name, pushing its neighbours aside. The
 * bar keeps a fixed height so the rest of the page never shifts.
 */
export function HeroColorBar() {
  const [active, setActive] = useState<number | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const current = active === null ? null : colors[active];

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!barRef.current) return;
    const mouseX = e.clientX;
    let closestIdx = 0;
    let closestDist = Infinity;

    pillRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dist = Math.abs(mouseX - (r.left + r.width / 2));
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });

    setActive(closestIdx);
  }, []);

  const clear = useCallback(() => setActive(null), []);

  return (
    <div className={styles.wrap}>
      <div
        ref={barRef}
        className={styles.bar}
        onMouseMove={handleMove}
        onMouseLeave={clear}
      >
        {colors.map((s, i) => {
          const boost = active === null ? 0 : boostAt(Math.abs(i - active));
          const isActive = i === active;
          const height = BASE_H + (MAX_H - BASE_H) * boost * MAX_BOOST;
          const width = isActive
            ? Math.max(s.name.length * CHAR_W + LABEL_PAD, BASE_W)
            : BASE_W + NEIGHBOUR_W_GAIN * boost;

          return (
            <button
              key={s.token}
              type="button"
              ref={(el) => { pillRefs.current[i] = el; }}
              className={styles.pill}
              data-active={isActive || undefined}
              style={{
                background: `var(--syn-${s.token})`,
                width: `${width}px`,
                height: `${height}px`,
              }}
              aria-label={s.name}
              onFocus={() => setActive(i)}
              onBlur={clear}
              onClick={() => setActive((prev) => (prev === i ? null : i))}
            >
              <span className={styles.label} data-show={isActive || undefined}>
                {s.name}
              </span>
            </button>
          );
        })}
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
