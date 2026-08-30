"use client";

import { useEffect, useRef, useState } from "react";
import { scopes } from "@/lib/palette";
import styles from "./PaletteTable.module.css";

export function PaletteTable() {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      return;
    }
    setCopied(hex);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 1200);
  }

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Scope</th>
            <th scope="col">Dark</th>
            <th scope="col">Light</th>
          </tr>
        </thead>
        <tbody>
          {scopes.map((scope) => (
            <tr key={scope.token}>
              <th scope="row" className={styles.scope}>
                {scope.name}
              </th>
              {(["dark", "light"] as const).map((variant) => {
                const hex = scope[variant];
                return (
                  <td key={variant}>
                    <button
                      type="button"
                      className={styles.swatch}
                      onClick={() => copy(hex)}
                      title={`Copy ${hex}`}
                    >
                      <span className={styles.chip} style={{ background: hex }} aria-hidden />
                      <span className={styles.hex}>{copied === hex ? "copied" : hex}</span>
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
