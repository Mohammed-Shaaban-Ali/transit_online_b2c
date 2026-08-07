"use client";

import { ComponentProps } from "react";
import { IntlLink } from "./intl-navigation";
import { useCountry } from "@/hooks/useCountry";
import { withCountryHref } from "@/utils/countryPath";

type IntlLinkProps = ComponentProps<typeof IntlLink>;

/**
 * next-intl Link that keeps /[country]/ in the browser URL.
 * Without this, clicks go to /ar/hotels and middleware re-injects country
 * from a (sometimes stale) cookie redirect — which drops SA back to EG.
 */
export function Link({ href, prefetch, ...rest }: IntlLinkProps) {
  const country = useCountry();
  const countryHref = withCountryHref(href as string | { pathname?: string }, country);

  return (
    <IntlLink
      href={countryHref as IntlLinkProps["href"]}
      // Prefetch without country hits the cookie-redirect path and can cache EG.
      prefetch={prefetch ?? false}
      {...rest}
    />
  );
}
