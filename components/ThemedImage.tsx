"use client";

import Image from "next/image";
import { useMode } from "@/lib/use-mode";

type Props = {
  darkSrc: string;
  lightSrc: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
};

/**
 * Renders the dark or light variant of an image based on the current theme.
 * Falls back to dark on the server (matches the inline script default).
 */
export function ThemedImage({ darkSrc, lightSrc, alt, width, height, priority, className }: Props) {
  const mode = useMode();
  return (
    <Image
      src={mode === "light" ? lightSrc : darkSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      unoptimized // SVGs don't need the image optimizer
    />
  );
}
