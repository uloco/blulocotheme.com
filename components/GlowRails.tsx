import { scopes } from "@/lib/palette";
import styles from "./GlowRails.module.css";

const colors = scopes.slice(2); // skip bg and fg

function Blocks() {
  return (
    <>
      {colors.map((s) => (
        <div key={s.token} className={styles.block} style={{ background: `var(--syn-${s.token})` }} />
      ))}
    </>
  );
}

/**
 * Fixed colour rails on both viewport edges, drawn as two aligned layers: a
 * sharp thin strip and a wider blurred copy behind it. Both use the same flex
 * distribution, so every colour boundary lines up and the glow reads as the
 * strip bleeding outward rather than as a separate gradient.
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
