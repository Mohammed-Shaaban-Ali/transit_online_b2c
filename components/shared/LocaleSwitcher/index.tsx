"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// flags
import enFlag from "@/public/images/en_flag.webp";
import arFlag from "@/public/images/ar_flag.webp";
import { Locale, useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useDispatch } from "react-redux";
import { baseApi, baseApi2 } from "@/redux/app/baseApi";
import { GoGlobe } from "react-icons/go";

function LocaleSwitcher() {
  const t = useTranslations("Components.LocaleSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [currentLang, setCurrentLang] = useState<Locale>(locale as Locale);
  const isRTL = locale === "ar";

  const Languages = [
    { code: "ar", name: t("arabic"), flag: arFlag },
    { code: "en", name: t("english"), flag: enFlag },
  ];

  // Refetch queries when locale changes
  useEffect(() => {
    // Reset API state to clear cache and trigger refetch with new locale
    // This ensures all active queries will refetch with the new language
    dispatch(baseApi.util.resetApiState());
    dispatch(baseApi2.util.resetApiState());
  }, [locale, dispatch]);

  // Sync currentLang with locale when it changes externally
  useEffect(() => {
    setCurrentLang(locale as Locale);
  }, [locale]);

  const handleLanguageChange = (newLang: string) => {
    setCurrentLang(newLang as Locale);
    // Navigate to the same path with the new locale
    router.replace(pathname, { locale: newLang as Locale });
  };

  const currentLanguage = Languages.find((lang) => lang.code === currentLang)!;

  return (
    <div className="flex items-center gap-4 relative">
      <DropdownMenu>
        <DropdownMenuTrigger
          className="w-9 h-9 sm:w-auto sm:min-w-fit sm:min-h-10 gap-2 rounded-full border
         border-gray-300 text-black font-medium bg-white/60 
         cursor-pointer hover:bg-white/80 transition-all duration-300
         flex items-center justify-center p-1 sm:px-3 sm:py-2 outline-none
         
       "
        >
          <GoGlobe className="size-[20px] text-primary md:hidden shrink-0" />
          <div className="hidden md:flex items-center gap-2">
            <Image
              alt={currentLanguage.name}
              src={currentLanguage.flag}
              width={20}
              height={20}
              className="shrink-0"
            />
            <span>{currentLanguage.name}</span>
            <ChevronDownIcon
              className={`size-4 opacity-50 transition-transform `}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={isRTL ? "start" : "end"}
          className="min-w-[140px] w-auto"
          sideOffset={8}
        >
          {Languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="cursor-pointer focus:bg-primary/10"
            >
              <div className="flex items-center gap-2 w-full">
                <Image
                  alt={language.name}
                  src={language.flag}
                  width={20}
                  height={20}
                  className="shrink-0"
                />
                <span className="flex-1">{language.name}</span>
                {language.code === currentLang && (
                  <CheckIcon className="size-4 text-primary" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
export default LocaleSwitcher;
