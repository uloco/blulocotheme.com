"use client";

/**
 * DEBUG COMPONENT. Multiple color strip experiments rendered side by side so
 * you can compare and pick. Delete this file once you've decided.
 */

import { useEffect, useRef, useState } from "react";
import { scopes } from "@/lib/palette";
import styles from "./ColorExperiments.module.css";

const syntaxColors = scopes.slice(2); // skip bg and fg

export function ColorExperiments() {
  return (
    <div className={styles.wrap}>
      <h2 className={styles.heading}>Color experiments — pick one (or none)</h2>

      <div className={styles.experiment}>
        <h3 className={styles.label}>A — Edge rails: fixed vertical strips on left and right</h3>
        <p className={styles.desc}>
          Two thin columns of syntax colors, fixed to the viewport edges. Always visible while
          scrolling. Like a permanent palette reminder.
        </p>
        <EdgeRails />
      </div>

      <div className={styles.experiment}>
        <h3 className={styles.label}>B — Scroll parallax strips: move at different speeds</h3>
        <p className={styles.desc}>
          Colored bars on both edges that scroll at varying rates. Creates a subtle parallax depth
          effect. Each color moves at its own speed.
        </p>
        <ParallaxStrips />
      </div>

      <div className={styles.experiment}>
        <h3 className={styles.label}>C — Hero color bar: horizontal swatch row</h3>
        <p className={styles.desc}>
          A single row of the 11 syntax colors between the stats and the code window. Rounded pill
          shapes, like the mascot&apos;s teeth.
        </p>
        <HeroBar />
      </div>

      <div className={styles.experiment}>
        <h3 className={styles.label}>D — Gradient glow edges: blurred color on viewport sides</h3>
        <p className={styles.desc}>
          Soft blurred blobs of syntax colors along the edges. Fixed position, fades into the
          background. More atmospheric, less geometric.
        </p>
        <GlowEdges />
      </div>

      <div className={styles.experiment}>
        <h3 className={styles.label}>E — Section-colored eyebrows</h3>
        <p className={styles.desc}>
          Each section gets its own syntax color for the eyebrow label. No structural change, just
          tints the existing layout. Preview below.
        </p>
        <EyebrowPreview />
      </div>
    </div>
  );
}

/* ── A: Edge rails ───────────────────────────────────────────────── */

function EdgeRails() {
  const [on, setOn] = useState(false);
  return (
    <>
      <button className={styles.toggle} onClick={() => setOn(!on)}>
        {on ? "Hide" : "Show"} edge rails
      </button>
      {on && (
        <>
          <div className={`${styles.rail} ${styles.railLeft}`}>
            {syntaxColors.map((s) => (
              <div key={s.token} className={styles.railBlock} style={{ background: `var(--syn-${s.token})` }} />
            ))}
          </div>
          <div className={`${styles.rail} ${styles.railRight}`}>
            {[...syntaxColors].reverse().map((s) => (
              <div key={s.token} className={styles.railBlock} style={{ background: `var(--syn-${s.token})` }} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

/* ── B: Parallax strips ──────────────────────────────────────────── */

function ParallaxStrips() {
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!on) return;
    const el = ref.current;
    if (!el) return;
    function onScroll() {
      const y = window.scrollY;
      const strips = el!.querySelectorAll<HTMLElement>("[data-speed]");
      strips.forEach((strip) => {
        const speed = parseFloat(strip.dataset.speed ?? "1");
        strip.style.transform = `translateY(${y * speed}px)`;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [on]);

  return (
    <>
      <button className={styles.toggle} onClick={() => setOn(!on)}>
        {on ? "Hide" : "Show"} parallax strips
      </button>
      {on && (
        <div ref={ref}>
          <div className={`${styles.parallaxCol} ${styles.parallaxLeft}`}>
            {syntaxColors.map((s, i) => (
              <div
                key={s.token}
                data-speed={(0.02 + i * 0.015).toFixed(3)}
                className={styles.parallaxBar}
                style={{ background: `var(--syn-${s.token})` }}
              />
            ))}
          </div>
          <div className={`${styles.parallaxCol} ${styles.parallaxRight}`}>
            {[...syntaxColors].reverse().map((s, i) => (
              <div
                key={s.token}
                data-speed={(0.02 + i * 0.015).toFixed(3)}
                className={styles.parallaxBar}
                style={{ background: `var(--syn-${s.token})` }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ── C: Hero bar ─────────────────────────────────────────────────── */

function HeroBar() {
  return (
    <div className={styles.heroBar}>
      {syntaxColors.map((s) => (
        <div
          key={s.token}
          className={styles.heroBarPill}
          style={{ background: `var(--syn-${s.token})` }}
          title={s.name}
        />
      ))}
    </div>
  );
}

/* ── D: Glow edges ───────────────────────────────────────────────── */

function GlowEdges() {
  const [on, setOn] = useState(false);
  return (
    <>
      <button className={styles.toggle} onClick={() => setOn(!on)}>
        {on ? "Hide" : "Show"} glow edges
      </button>
      {on && (
        <>
          <div className={`${styles.glowCol} ${styles.glowLeft}`}>
            {syntaxColors.slice(0, 6).map((s) => (
              <div
                key={s.token}
                className={styles.glowBlob}
                style={{ background: `var(--syn-${s.token})` }}
              />
            ))}
          </div>
          <div className={`${styles.glowCol} ${styles.glowRight}`}>
            {syntaxColors.slice(5).map((s) => (
              <div
                key={s.token}
                className={styles.glowBlob}
                style={{ background: `var(--syn-${s.token})` }}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

/* ── E: Eyebrow preview ─────────────────────────────────────────── */

const eyebrowColors = [
  { label: "EDITORS", color: "var(--syn-keyword)" },
  { label: "TERMINALS", color: "var(--syn-function)" },
  { label: "COMMAND LINE", color: "var(--syn-string)" },
  { label: "COMMUNITY", color: "var(--syn-constant)" },
  { label: "PALETTE", color: "var(--syn-type)" },
];

function EyebrowPreview() {
  return (
    <div className={styles.eyebrowRow}>
      {eyebrowColors.map(({ label, color }) => (
        <span key={label} className={styles.eyebrowSample} style={{ color }}>
          {label}
        </span>
      ))}
    </div>
  );
}
