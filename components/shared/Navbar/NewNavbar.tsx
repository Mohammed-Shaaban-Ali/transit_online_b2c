"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "../LocaleSwitcher";
import logo from "@/public/transit_logos/transit_logo_q.png";
import { Link } from "@/i18n/navigation";

const NewNavbar = () => {
  const t = useTranslations("Components.Navbar");
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    {
      label: t("home"),
      href: "/",
    },
    {
      label: t("hotels"),
      href: "/hotels-test",
    },
    {
      label: t("flights"),
      href: "/flights-test",
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`absolute top-2 left-0 right-0 w-full z-50 px-2 sm:px-4 py-4 sm:py-8 
            h-14 min-h-14 sm:min-h-16 sm:h-16 flex items-center justify-between gap-2
            max-w-[95%]  sm:max-w-[1450px] mx-auto 
         `}
      >
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center justify-center z-50 transition-all duration-300 p-1.5 px-2.5 rounded-full max-h-10 relative"
            onClick={closeMobileMenu}
          >
            <Image
              src={logo}
              alt="logo"
              width={120}
              height={100}
              className="object-contain w-full h-full max-h-14 brightness-0 invert"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {links.map((link) => {
              const isActive = pathNameWithoutLocale === link.href;
              return (
                <Link
                  href={link.href}
                  key={link.label}
                  className={`relative text-[18px] font-medium pb-1 transition-colors duration-300
                    text-white/80 hover:text-white
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full
                     after:bg-white
                    after:transition-transform after:duration-300 after:scale-x-0 after:origin-right
                    hover:after:scale-x-100 hover:after:origin-left
                    ${isActive ? "text-white! after:scale-x-100 after:origin-left" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop Locale Switcher */}
        <div className=" ms-auto md:ms-0 flex items-center gap-2.5">
          <LocaleSwitcher />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 h-9 w-9 text-primary hover:text-primary/80 transition-colors z-50 cursor-pointer 
          bg-white rounded-md me-2 flex items-center justify-center
          "
          aria-label={t("toggleMenu")}
        >
          {isMobileMenuOpen ? (
            <HiX className="w-6 h-6" />
          ) : (
            <HiMenu className="w-6 h-6" />
          )}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 sm:w-80 bg-white backdrop-blur-md z-9999
          transform transition-transform duration-300 ease-in-out md:hidden
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          shadow-2xl`}
      >
        <div className="flex flex-col h-full  p-6">
          {/* logo */}
          <Link href="/" className="flex items-center gap-2 max-h-14 z-50">
            <Image
              src={logo}
              alt="logo"
              width={1200}
              height={1000}
              className="object-contain w-full h-full max-h-14 brightness-0 invert"
            />
          </Link>
          {/* Mobile Navigation Links */}
          <nav className="flex flex-col gap-4 mt-10">
            {links.map((link) => {
              const isActive = pathNameWithoutLocale === link.href;
              return (
                <Link
                  href={link.href}
                  key={link.label}
                  onClick={closeMobileMenu}
                  className={`text-18 font-bold py-2 px-4 rounded-lg transition-all duration-300
                    ${
                      isActive
                        ? "text-black bg-black/10"
                        : "text-black/60 hover:text-black hover:bg-black/5"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default NewNavbar;
