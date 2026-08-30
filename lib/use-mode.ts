"use client";

import { useSyncExternalStore } from "react";

type Mode = "light" | "dark";

/**
 * Resolves the effective mode (light or dark) by checking:
 * 1. The explicit data-theme attribute (set by the toggle)
 * 2. The system preference via matchMedia
 *
 * Returns a stable string so components can key images/classes on it.
 */

function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const ob = new MutationObserver(onChange);
  ob.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  mq.addEventListener("change", onChange);
  return () => {
    ob.disconnect();
    mq.removeEventListener("change", onChange);
  };
}

function getSnapshot(): Mode {
  const attr = document.documentElement.dataset.theme;
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getServerSnapshot(): Mode {
  return "dark"; // safe default, the inline script fixes it before paint anyway
}

export function useMode(): Mode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
