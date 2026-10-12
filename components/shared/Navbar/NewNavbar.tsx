"use client";
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import LocaleSwitcher from "../LocaleSwitcher";
import CountrySwitcher from "../CountrySwitcher";
import logo from "@/public/images/gitalogo.png";
import { Link } from "@/i18n/navigation";
import UserMenu from "./UserMenu";
import { SUPPORTED_COUNTRIES } from "@/config/countries";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NewNavbar = ({ isBgWhite = false }: { isBgWhite?: boolean }) => {
  const t = useTranslations("Components.Navbar");
  const pathname = usePathname();
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    {
      label: t("home"),
      href: "/",
    },
    {
      label: t("hotels"),
      href: "/hotels",
    },
    {
      label: t("flights"),
      href: "/flights",
    },
    {
      label: t("cruises"),
      href: "/cruises",
    },
    {
      label: t("licenses"),
      href: "/licenses",
    },
  ];

  function normalizePathname(pathname: string): string {
    const parts = pathname.split("/").filter(Boolean);
    let start = 0;

    // Strip locale segment
    if (parts.length > start && ["en", "ar"].includes(parts[start])) {
      start++;
    }
    // Strip country segment
    if (
      parts.length > start &&
      SUPPORTED_COUNTRIES.includes(parts[start] as (typeof SUPPORTED_COUNTRIES)[number])
    ) {
      start++;
    }

    return "/" + parts.slice(start).join("/");
  }
  const pathNameWithoutLocale = normalizePathname(pathname);
  const isBlack =
    isBgWhite ||
    (pathNameWithoutLocale.includes("hotels") &&
      pathNameWithoutLocale.includes("details")) ||
    pathNameWithoutLocale.startsWith("/licenses/result") ||
    pathNameWithoutLocale.endsWith("my-booking");

  const linkClass = (isActive: boolean, isBlack: boolean) =>
    `relative text-[15px] font-medium pb-1 transition-colors duration-300 sm:text-[18px]
    ${isBlack ? "text-black/80 hover:text-black" : "text-white/80 hover:text-white"}
    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full
     ${isBlack ? "after:bg-black" : "after:bg-white"}
    after:transition-transform after:duration-300 after:scale-x-0 after:origin-right
    hover:after:scale-x-100 hover:after:origin-left
    ${
      isActive
        ? isBlack
          ? "text-black! after:scale-x-100 after:origin-left"
          : "text-white! after:scale-x-100 after:origin-left"
        : ""
    }`;

  const mobileLinkClass = (isActive: boolean) =>
    `rounded-lg px-4 py-3 text-16 font-semibold transition-colors ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-gray-700 hover:bg-gray-100 hover:text-black"
    }`;

  return (
    <header
      className={`absolute left-0 right-0 z-50 flex w-full items-center justify-between gap-2 px-2 py-3 sm:px-4 sm:py-4
        min-h-0 md:min-h-16 md:h-16 md:py-8
        ${
          isBgWhite
            ? "top-0 max-w-none border-b border-gray-200 bg-white py-3 sm:py-4 md:px-6"
            : "top-2 mx-auto max-w-[95%] sm:max-w-[1450px]"
        }
      `}
    >
      <div className="flex min-w-0 items-center gap-3 sm:gap-6 md:flex-1">
        <Link
          href="/"
          className="relative z-10 flex max-h-10 shrink-0 items-center justify-center rounded-full p-1.5 px-2.5 transition-all duration-300"
        >
          <Image
            src={logo}
            alt="logo"
            width={120}
            height={100}
            className={`h-full max-h-10 w-full object-contain sm:max-h-14
              ${isBlack ? "" : " brightness-0 invert"}
              `}
          />
        </Link>

        <nav className="hidden items-center gap-4 sm:gap-7 md:flex">
          {links.map((link) => {
            const isActive = pathNameWithoutLocale === link.href;
            return (
              <Link
                href={link.href}
                key={link.label}
                className={linkClass(isActive, isBlack)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="relative z-10 flex shrink-0 items-center gap-2.5">
        <CountrySwitcher isBlack={isBlack} />
        <LocaleSwitcher />
        <div className="hidden md:block">
          <UserMenu
            wrapperClassName="relative"
            triggerClassName={`inline-flex items-center gap-2 rounded-md bg-white/15 px-2 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/25
                ${isBlack ? "border text-black!" : "bg-white/15 text-white hover:bg-white/25"}
                `}
            avatarClassName={`inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-primary"
              nameClassName="max-w-[110px] truncate ${isBlack ? "bg-gray-200!" : ""}`}
            signInClassName={`inline-flex items-center rounded px-3 py-2 text-[14px] font-medium transition-colors ${
              isBlack
                ? "bg-primary! text-white! hover:bg-primary/90"
                : "bg-white/15 text-white hover:bg-white/25"
            }`}
          />
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`md:hidden size-9 shrink-0 ${
                isBlack
                  ? "text-black hover:bg-black/5"
                  : "text-white hover:bg-white/15"
              }`}
              aria-label={t("toggleMenu")}
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side={locale === "ar" ? "right" : "left"}
            className="flex w-[min(100vw-2rem,20rem)] flex-col gap-0 p-0"
          >
            <SheetHeader className="border-b border-gray-100 px-5 py-4 text-start">
              <SheetTitle className="sr-only">{t("toggleMenu")}</SheetTitle>
              <Image
                src={logo}
                alt="logo"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </SheetHeader>

            <nav className="flex flex-col gap-1 p-4">
              {links.map((link) => {
                const isActive = pathNameWithoutLocale === link.href;
                return (
                  <Link
                    href={link.href}
                    key={link.label}
                    onClick={() => setMobileOpen(false)}
                    className={mobileLinkClass(isActive)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-gray-100 p-4 md:hidden">
              <UserMenu
                wrapperClassName="relative w-full"
                triggerClassName="inline-flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-black transition-colors hover:bg-gray-50"
                avatarClassName="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
                nameClassName="max-w-[160px] truncate"
                signInClassName="inline-flex w-full items-center justify-center rounded-md bg-primary px-3 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-primary/90"
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default NewNavbar;
