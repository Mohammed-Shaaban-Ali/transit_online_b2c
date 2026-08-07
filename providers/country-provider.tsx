"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { type Country } from "@/config/countries";
import { getClientCountry } from "@/utils/countryPath";

const CountryContext = createContext<Country | null>(null);

type Props = {
  country: Country;
  children: React.ReactNode;
};

/**
 * Seeds country from the server cookie (set by proxy when URL has /sa|/eg),
 * then keeps it in sync with the real browser URL on client navigations.
 */
export function CountryProvider({ country: initialCountry, children }: Props) {
  const intlPathname = usePathname();
  const [country, setCountry] = useState<Country>(initialCountry);

  useEffect(() => {
    setCountry(getClientCountry());
  }, [intlPathname, initialCountry]);

  return (
    <CountryContext.Provider value={country}>{children}</CountryContext.Provider>
  );
}

export function useCountryContext(): Country | null {
  return useContext(CountryContext);
}
