"use client";

import { useMemo } from "react";
import { useIntlRouter } from "./intl-navigation";
import { useCountry } from "@/hooks/useCountry";
import { withCountryHref } from "@/utils/countryPath";

type IntlRouter = ReturnType<typeof useIntlRouter>;

/**
 * next-intl router that prefixes push/replace hrefs with the active country.
 */
export function useRouter(): IntlRouter {
  const router = useIntlRouter();
  const country = useCountry();

  return useMemo(() => {
    const push: IntlRouter["push"] = (href, options) => {
      return router.push(
        withCountryHref(href as string | { pathname?: string }, country) as typeof href,
        options,
      );
    };

    const replace: IntlRouter["replace"] = (href, options) => {
      return router.replace(
        withCountryHref(href as string | { pathname?: string }, country) as typeof href,
        options,
      );
    };

    return { ...router, push, replace };
  }, [router, country]);
}
