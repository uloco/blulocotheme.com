"use client";

import { useSyncExternalStore } from "react";
import styles from "./ThemeToggle.module.css";

type Theme = "light" | "dark" | "system";

const order: Theme[] = ["system", "light", "dark"];

const labels: Record<Theme, string> = {
  system: "Match system",
  light: "Light",
  dark: "Dark",
};

/** Fired on same-tab changes. The storage event only reaches other tabs. */
const CHANGE_EVENT = "bluloco:themechange";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function getSnapshot(): Theme {
  try {
    const stored = localStorage.getItem("theme");
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

/**
 * The server cannot read localStorage, so it always renders "system". React
 * calls getSnapshot right after hydration and re-renders if the real value
 * differs. The palette itself is already correct by then: the inline script in
 * layout.tsx sets the html attribute before first paint, so only the button
 * highlight settles late, and it never flashes the wrong colours.
 */
function getServerSnapshot(): Theme {
  return "system";
}

function apply(theme: Theme) {
  if (theme === "system") {
    delete document.documentElement.dataset.theme;
    localStorage.removeItem("theme");
  } else {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div className={styles.group} role="radiogroup" aria-label="Color theme">
      {order.map((option) => {
        const active = theme === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={labels[option]}
            title={labels[option]}
            className={styles.button}
            data-active={active || undefined}
            onClick={() => apply(option)}
          >
            <Icon theme={option} />
          </button>
        );
      })}
    </div>
  );
}

function Icon({ theme }: { theme: Theme }) {
  const common = {
    width: 15,
    height: 15,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (theme === "system") {
    return (
      <svg {...common}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8m-4-4v4" />
      </svg>
    );
  }

  if (theme === "light") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}
