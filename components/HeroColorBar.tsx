"use client";

import { useCallback, useRef, useState } from "react";
import { scopes } from "@/lib/palette";
import styles from "./HeroColorBar.module.css";

const colors = scopes.slice(2); // skip bg and fg

/** How many neighbours on each side are affected by the magnification. */
const REACH = 2;
/** Maximum extra scale applied to the hovered pill. */
const MAX_BOOST = 1.8;

/**
 * macOS Dock-style magnification on the syntax palette pills. Each pill grows
 * based on how close the cursor is, with neighbours scaling proportionally.
 * The scope name is shown inside the active pill.
 */
export function HeroColorBar() {
  const [active, setActive] = useState<number | null>(null);
  const [scales, setScales] = useState<number[]>(() => colors.map(() => 1));
  const barRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const current = active === null ? null : colors[active];

  const handleMove = useCallback((e: React.MouseEvent) => {
    const bar = barRef.current;
    if (!bar) return;

    const mouseX = e.clientX;
    let closestIdx = 0;
    let closestDist = Infinity;

    pillRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const dist = Math.abs(mouseX - cx);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });

    setActive(closestIdx);

    const next = colors.map((_, i) => {
      const dist = Math.abs(i - closestIdx);
      if (dist > REACH) return 1;
      // Cosine falloff: 1 at center, 0 at REACH+1
      const t = 1 - dist / (REACH + 1);
      return 1 + MAX_BOOST * (Math.cos((1 - t) * Math.PI) + 1) / 2;
    });

    setScales(next);
  }, []);

  const handleLeave = useCallback(() => {
    setActive(null);
    setScales(colors.map(() => 1));
  }, []);

  return (
    <div className={styles.wrap}>
      <div
        ref={barRef}
        className={styles.bar}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {colors.map((s, i) => (
          <button
            key={s.token}
            type="button"
            ref={(el) => { pillRefs.current[i] = el; }}
            className={styles.pill}
            data-active={i === active || undefined}
            style={{
              background: `var(--syn-${s.token})`,
              transform: `scaleY(${scales[i]}) scaleX(${1 + (scales[i] - 1) * 0.15})`,
            }}
            aria-label={s.name}
            onFocus={() => setActive(i)}
            onBlur={() => { setActive(null); setScales(colors.map(() => 1)); }}
            onClick={() => setActive(i)}
          >
            <span
              className={styles.label}
              style={{ opacity: i === active && scales[i] > 2 ? 1 : 0 }}
            >
              {s.name}
            </span>
          </button>
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
