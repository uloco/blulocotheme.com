import { scopes } from "@/lib/palette";
import styles from "./HeroColorBar.module.css";

const colors = scopes.slice(2);

/** Horizontal row of syntax-colored pills. Sits between the stats and the code window. */
export function HeroColorBar() {
  return (
    <div className={styles.bar} aria-hidden>
      {colors.map((s) => (
        <div key={s.token} className={styles.pill} style={{ background: `var(--syn-${s.token})` }} />
      ))}
    </div>
  );
}
