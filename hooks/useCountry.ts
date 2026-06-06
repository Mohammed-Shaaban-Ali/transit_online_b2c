"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  SUPPORTED_COUNTRIES,
  DEFAULT_COUNTRY,
  Country,
} from "@/config/countries";

function parseCountryFromPath(pathname: string): Country {
  // URL structure: /[locale]/[country]/rest
  // e.g. /ar/sa/flights → parts[1] = "sa"
  const parts = pathname.split("/").filter(Boolean);
  if (
    parts.length >= 2 &&
    SUPPORTED_COUNTRIES.includes(parts[1] as Country)
  ) {
    return parts[1] as Country;
  }
  return DEFAULT_COUNTRY;
}

/**
 * Returns the active country read directly from the browser URL.
 * Re-evaluates on every client-side navigation.
 */
export function useCountry(): Country {
  // usePathname triggers re-renders on navigation so we stay in sync
  const intlPathname = usePathname();

  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);

  useEffect(() => {
    // window.location.pathname always holds the real browser URL
    // (the middleware rewrite is transparent – the browser keeps /ar/sa/...)
    setCountry(parseCountryFromPath(window.location.pathname));
  }, [intlPathname]);

  return country;
}
