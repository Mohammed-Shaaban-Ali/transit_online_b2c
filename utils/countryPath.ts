import {
  SUPPORTED_COUNTRIES,
  DEFAULT_COUNTRY,
  type Country,
} from "@/config/countries";
import { COUNTRY_COOKIE } from "@/constants";

export function isCountry(value: string | undefined | null): value is Country {
  return !!value && SUPPORTED_COUNTRIES.includes(value as Country);
}

/**
 * Read country from a browser pathname: /[locale]/[country]/...
 * Returns null when the country segment is missing.
 */
export function parseCountryFromPath(pathname: string): Country | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length >= 2 && isCountry(parts[1])) {
    return parts[1];
  }
  return null;
}

export function parseCountryCookie(
  value: string | undefined | null,
): Country | null {
  return isCountry(value) ? value : null;
}

/** Resolve country from path, then cookie, then default. */
export function resolveCountry(
  pathname?: string | null,
  cookieValue?: string | null,
): Country {
  const fromPath = pathname ? parseCountryFromPath(pathname) : null;
  if (fromPath) return fromPath;
  return parseCountryCookie(cookieValue) ?? DEFAULT_COUNTRY;
}

function readCookieClient(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : undefined;
}

/** Client-only: path first, then cookie. */
export function getClientCountry(): Country {
  if (typeof window === "undefined") return DEFAULT_COUNTRY;
  return resolveCountry(
    window.location.pathname,
    readCookieClient(COUNTRY_COOKIE),
  );
}

type HrefInput =
  | string
  | {
      pathname?: string | null;
      [key: string]: unknown;
    };

/**
 * Prefix a next-intl href with /{country} so the browser URL keeps the
 * country segment (middleware rewrites it away for the App Router).
 * next-intl still adds the locale → /ar/sa/hotels
 */
export function withCountryHref<T extends HrefInput>(
  href: T,
  country: Country,
): T {
  if (typeof href === "string") {
    return prefixPath(href, country) as T;
  }

  if (href && typeof href === "object" && "pathname" in href) {
    const pathname = href.pathname;
    if (typeof pathname === "string") {
      return { ...href, pathname: prefixPath(pathname, country) } as T;
    }
  }

  return href;
}

function prefixPath(path: string, country: Country): string {
  if (!path.startsWith("/")) return path;
  // External or already absolute with protocol
  if (path.startsWith("//")) return path;

  const parts = path.split("/").filter(Boolean);
  // Already has a country segment
  if (parts.length > 0 && isCountry(parts[0])) {
    return path;
  }

  if (path === "/") return `/${country}`;
  return `/${country}${path}`;
}
