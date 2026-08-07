"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { DEFAULT_COUNTRY, type Country } from "@/config/countries";
import { useCountryContext } from "@/providers/country-provider";
import { getClientCountry } from "@/utils/countryPath";

/**
 * Active country: browser URL first, then cookie-seeded provider, else eg.
 */
export function useCountry(): Country {
  const ctx = useCountryContext();
  const intlPathname = usePathname();
  const [country, setCountry] = useState<Country>(
    () => ctx ?? DEFAULT_COUNTRY,
  );

  useEffect(() => {
    setCountry(getClientCountry());
  }, [intlPathname, ctx]);

  return country;
}
