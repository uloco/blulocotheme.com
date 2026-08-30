import { scopes } from "@/lib/palette";
import styles from "./GlowRails.module.css";

const colors = scopes.slice(2); // skip bg and fg

/**
 * Fixed vertical strips on both viewport edges. Each strip is a syntax color
 * with a heavy blur, so the hard rail and the soft glow merge into one effect.
 */
export function GlowRails() {
  return (
    <>
      <div className={`${styles.rail} ${styles.left}`} aria-hidden>
        {colors.map((s) => (
          <div key={s.token} className={styles.block} style={{ background: `var(--syn-${s.token})` }} />
        ))}
      </div>
      <div className={`${styles.rail} ${styles.right}`} aria-hidden>
        {[...colors].reverse().map((s) => (
          <div key={s.token} className={styles.block} style={{ background: `var(--syn-${s.token})` }} />
        ))}
      </div>
    </>
  );
}
