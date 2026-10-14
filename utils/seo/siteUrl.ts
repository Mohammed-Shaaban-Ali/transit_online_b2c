/** Public frontend origin used for sitemap, robots, and canonical URLs. */
export const PRODUCTION_SITE_URL = "https://gitaota.com";

function normalizeSiteUrl(raw: string): string {
  return raw
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/(en|ar)$/i, "");
}

function isLocalHost(url: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(url);
}

/** Public site origin (no trailing slash, no locale suffix). Never returns localhost. */
export function getSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    PRODUCTION_SITE_URL,
  ];

  for (const candidate of candidates) {
    if (!candidate?.trim()) continue;
    const normalized = normalizeSiteUrl(candidate);
    if (!isLocalHost(normalized)) return normalized;
  }

  return PRODUCTION_SITE_URL;
}

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function localizedPath(locale: string, path = "/"): string {
  const normalized =
    !path || path === "/"
      ? ""
      : path.startsWith("/")
        ? path
        : `/${path}`;
  return `/${locale}${normalized}`;
}
