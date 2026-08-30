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
/** Rough px per character at the label font size, plus inner padding. Iosevka
 *  is a monospace with a 0.5em advance, so at 10px this is a tight estimate. */
const CHAR_W = 5;
const LABEL_PAD = 26;

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

  const nearestIndex = useCallback((clientX: number) => {
    let closestIdx = 0;
    let closestDist = Infinity;
    pillRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dist = Math.abs(clientX - (r.left + r.width / 2));
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });
    return closestIdx;
  }, []);

  const trackTo = useCallback(
    (clientX: number) => {
      if (!barRef.current) return;
      setActive(nearestIndex(clientX));
    },
    [nearestIndex],
  );

  /**
   * One handler for mouse and touch. `buttons > 0` is true while a finger is
   * down, so a swipe across the row tracks exactly like a hover.
   */
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === "mouse" || e.buttons > 0) trackTo(e.clientX);
    },
    [trackTo],
  );

  const handlePointerLeave = useCallback((e: React.PointerEvent) => {
    // Touch has no hover to leave; clearing here would collapse on lift.
    if (e.pointerType === "mouse") setActive(null);
  }, []);

  /** Fallback for the swipe: touch events are dependable on iOS even where
   *  pointermove during a drag is not. */
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const t = e.touches[0];
      if (t) trackTo(t.clientX);
    },
    [trackTo],
  );

  /**
   * Taps are handled on the whole row rather than per pill. A pill is only
   * 14px tall, far under the 44px minimum touch target, so requiring a direct
   * hit made it feel broken. Anywhere in the row selects the nearest colour.
   * Where hover exists the pointer tracking already owns selection.
   */
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (window.matchMedia("(hover: hover)").matches) return;
      const idx = nearestIndex(e.clientX);
      setActive((prev) => (prev === idx ? null : idx));
    },
    [nearestIndex],
  );

  return (
    <div className={styles.wrap}>
      <div
        ref={barRef}
        className={styles.bar}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onTouchMove={handleTouchMove}
        onClick={handleClick}
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
              // Only keyboard focus should select. A tap also fires focus, and
              // that combined with a toggle on click is what made touch need
              // two taps: the first set it, then the click cleared it again.
              onFocus={(e) => {
                if (e.currentTarget.matches(":focus-visible")) setActive(i);
              }}
              // Guarded so blurring a pill that is no longer the active one
              // cannot clear the selection a new tap just made.
              onBlur={() => setActive((prev) => (prev === i ? null : prev))}
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
          <span className={styles.hint}>
            Every color carries one meaning, used consistently across every language and tuned for
            contrast and readability.
          </span>
        )}
      </p>
    </div>
  );
}
