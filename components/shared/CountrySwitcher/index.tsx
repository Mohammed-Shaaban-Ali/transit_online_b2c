"use client";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCookie } from "cookies-next";
import { baseApi, baseApi2 } from "@/redux/app/baseApi";
import { COUNTRY_COOKIE } from "@/constants";
import { SUPPORTED_COUNTRIES, Country } from "@/config/countries";
import { useCountry } from "@/hooks/useCountry";

type Props = {
  isBlack?: boolean;
};

const COUNTRY_LABELS: Record<
  Country,
  { ar: string; en: string; flag: string }
> = {
  eg: { ar: "مصر", en: "Egypt", flag: "🇪🇬" },
  sa: { ar: "السعودية", en: "Saudi Arabia", flag: "🇸🇦" },
};

export default function CountrySwitcher({ isBlack = false }: Props) {
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useDispatch();
  const currentCountry = useCountry();

  const handleCountryChange = (newCountry: Country) => {
    if (newCountry === currentCountry) return;

    setCookie(COUNTRY_COOKIE, newCountry, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    });

    // Real browser URL keeps /[locale]/[country]/... (middleware rewrite is transparent)
    const browserPath = window.location.pathname;
    const escaped = currentCountry.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const newPath = browserPath.replace(
      new RegExp(`(/${locale}/)${escaped}(/|$)`),
      `$1${newCountry}$2`,
    );

    const targetPath =
      newPath !== browserPath ? newPath : `/${locale}/${newCountry}`;

    // Soft nav like LocaleSwitcher — no full reload
    router.push(targetPath + window.location.search);

    dispatch(baseApi.util.resetApiState());
    dispatch(baseApi2.util.resetApiState());
  };

  const isRTL = locale === "ar";
  const label = COUNTRY_LABELS[currentCountry];
  const displayName = locale === "ar" ? label.ar : label.en;

  return (
    <DropdownMenu dir={isRTL ? "rtl" : "ltr"}>
      <DropdownMenuTrigger
        className={`inline-flex h-9 items-center gap-1.5 rounded-md border px-2 py-1 text-sm font-medium outline-none transition-colors sm:h-10 sm:px-3
          ${
            isBlack
              ? "border-gray-300 bg-white text-black hover:bg-gray-50"
              : "border-white/30 bg-white/15 text-white hover:bg-white/25"
          }`}
      >
        <span className="sm:hidden inline font-bold text-base leading-none">
          {label.flag}
        </span>
        <span className="hidden sm:inline font-bold">{displayName}</span>
        <ChevronDownIcon className="size-3.5 opacity-60" />
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={8} className="min-w-[160px]">
        {SUPPORTED_COUNTRIES.map((country) => {
          const info = COUNTRY_LABELS[country];
          const name = locale === "ar" ? info.ar : info.en;
          return (
            <DropdownMenuItem
              key={country}
              onClick={() => handleCountryChange(country)}
              className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10"
            >
              <div className="flex w-full items-center gap-2">
                <span className="flex-1">{name}</span>
                {country === currentCountry && (
                  <CheckIcon className="size-4 text-primary" />
                )}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
