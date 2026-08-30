/**
 * Star counts, fetched at build time and revalidated daily.
 *
 * Unauthenticated GitHub allows 60 requests an hour, which a busy build host
 * can exhaust. Every failure path therefore falls back to a known count instead
 * of hiding the badge, and a GITHUB_TOKEN in the environment lifts the limit.
 */

/** Counts recorded on 2026-08-30. Only used when the API call fails. */
const fallback: Record<string, number> = {
  "uloco/bluloco.nvim": 457,
  "uloco/theme-bluloco-dark": 115,
  "uloco/theme-bluloco-light": 112,
  "uloco/webstorm-bluloco-scheme": 13,
  "uloco/bluloco-zed": 5,
  "uloco/bluloco-opencode": 0,
};

const repos = Object.keys(fallback);

export type Stars = Record<string, number>;

async function fetchStars(repo: string): Promise<number> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return fallback[repo];
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number" ? data.stargazers_count : fallback[repo];
  } catch {
    return fallback[repo];
  }
}

export async function getStars(): Promise<Stars> {
  const counts = await Promise.all(repos.map(fetchStars));
  return Object.fromEntries(repos.map((repo, i) => [repo, counts[i]]));
}

/** Rounded down to the nearest hundred so the hero stat reads as an estimate. */
export function totalStars(stars: Stars): string {
  const sum = Object.values(stars).reduce((a, b) => a + b, 0);
  return `${Math.floor(sum / 100) * 100}+`;
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}
