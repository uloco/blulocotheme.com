import { scopes } from "@/lib/palette";
import styles from "./GlowRails.module.css";

const colors = scopes.slice(2); // skip bg and fg

/** How many times to tile the pattern. 4 reps of 11 scopes covers ~4x the
 *  viewport height, which is enough for any reasonable scroll depth. */
const REPS = 4;

function Blocks() {
  return (
    <>
      {Array.from({ length: REPS }, (_, r) =>
        colors.map((s) => (
          <div
            key={`${r}-${s.token}`}
            className={styles.block}
            style={{ background: `var(--syn-${s.token})` }}
          />
        )),
      )}
    </>
  );
}

/**
 * Colour rails on both edges. Scroll with the page and tile the palette so
 * the pattern repeats perpetually. Drawn as two aligned layers: a sharp thin
 * strip and a wider blurred copy behind it.
 */
export function GlowRails() {
  return (
    <>
      <div className={`${styles.rail} ${styles.left}`} aria-hidden>
        <div className={styles.glow}>
          <Blocks />
        </div>
        <div className={styles.strip}>
          <Blocks />
        </div>
      </div>
      <div className={`${styles.rail} ${styles.right}`} aria-hidden>
        <div className={styles.glow}>
          <Blocks />
        </div>
        <div className={styles.strip}>
          <Blocks />
        </div>
      </div>
    </>
  );
}
