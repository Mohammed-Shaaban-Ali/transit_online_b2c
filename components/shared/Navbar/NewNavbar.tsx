"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "../LocaleSwitcher";
import logo from "@/public/transit_logos/transit_logo_q.png";
import { Link } from "@/i18n/navigation";

const NewNavbar = () => {
  const t = useTranslations("Components.Navbar");
  const pathname = usePathname();

  const links = [
    {
      label: t("home"),
      href: "/new",
    },
    {
      label: t("hotels"),
      href: "/new/hotels",
    },
    {
      label: t("flights"),
      href: "/new/flights",
    },
  ];

  function normalizePathname(pathname: string): string {
    const parts = pathname.split("/").filter(Boolean);

    if (parts.length > 0 && ["en", "ar"].includes(parts[0] as "en" | "ar")) {
      return "/" + parts.slice(1).join("/");
    }

    return pathname.startsWith("/") ? pathname : "/" + pathname;
  }
  const pathNameWithoutLocale = normalizePathname(pathname);
  const isBlack =
    (pathNameWithoutLocale.includes("hotels") &&
      pathNameWithoutLocale.includes("details")) ||
    pathNameWithoutLocale.includes("booking");

  const linkClassDesktop = (isActive: boolean, isBlack: boolean) =>
    `relative text-[18px] font-medium pb-1 transition-colors duration-300
    ${isBlack ? "text-black/80 hover:text-black" : "text-white/80 hover:text-white"}
    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full
     ${isBlack ? "after:bg-black" : "after:bg-white"}
    after:transition-transform after:duration-300 after:scale-x-0 after:origin-right
    hover:after:scale-x-100 hover:after:origin-left
    ${isActive ? "text-white! after:scale-x-100 after:origin-left" : ""}`;

  const linkClassMobile = (isActive: boolean, isBlack: boolean) =>
    `relative text-[15px] sm:text-[16px] font-medium pb-0.5 whitespace-nowrap transition-colors duration-300
    ${isBlack ? "text-black/80 hover:text-black" : "text-white/80 hover:text-white"}
    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full ${isBlack ? "after:bg-black" : "after:bg-white"}
    after:transition-transform after:duration-300 after:scale-x-0 after:origin-right
    hover:after:scale-x-100 hover:after:origin-left
    ${isActive ? "text-white! after:scale-x-100 after:origin-left" : ""}`;

  return (
    <header
      className={`absolute top-2 left-0 right-0 w-full z-50 px-2 sm:px-4 py-3 sm:py-8 
        flex flex-col gap-1 sm:gap-4 md:flex-row md:items-center md:justify-between md:gap-2 md:py-8
        min-h-0 md:min-h-16 md:h-16
        max-w-[95%] sm:max-w-[1450px] mx-auto
      `}
    >
      <div className="flex w-full items-center justify-between gap-3 md:flex-1 md:min-w-0">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            href="/"
            className="relative z-50 flex max-h-10 items-center justify-center rounded-full p-1.5 px-2.5 transition-all duration-300"
          >
            <Image
              src={logo}
              alt="logo"
              width={120}
              height={100}
              className={`h-full max-h-10 w-full object-contain brightness-0 sm:max-h-14
              ${isBlack ? "invert-0" : "invert"}
              `}
            />
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {links.map((link) => {
              const isActive = pathNameWithoutLocale === link.href;
              return (
                <Link
                  href={link.href}
                  key={link.label}
                  className={linkClassDesktop(isActive, isBlack)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <LocaleSwitcher />
        </div>
      </div>

      <nav className="flex w-full  items-center justify-center gap-x-4 gap-y-1 md:hidden">
        {links.map((link) => {
          const isActive = pathNameWithoutLocale === link.href;
          return (
            <Link
              href={link.href}
              key={link.label}
              className={linkClassMobile(isActive, isBlack)}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default NewNavbar;
