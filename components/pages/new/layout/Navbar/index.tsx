"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  BookOpenText,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Smartphone,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import logo from "@/public/transit_logos/transit_logo_q.png";
import { useSidebarMini } from "@/components/pages/new/layout/sidebar-mini-context";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/shared/LocaleSwitcher";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { logoutUser } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";

/** Top blue bar + light gray rounded background on hover (Trip-style nav items). */
const navItemHover =
  "relative inline-flex items-center gap-1.5 whitespace-nowrap rounded px-3 py-2 text-[14px]  text-gray-900 transition-colors " +
  "hover:bg-gray-100 ";

type Props = {};

function Navbar({}: Props) {
  const { isMini, toggleMini } = useSidebarMini();
  const t = useTranslations("NewPage.navbar");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsProfileMenuOpen(false);
    router.push("/new/login");
  };

  return (
    <header
      className="absolute top-0 left-0 z-50 flex h-[68px] w-full items-center gap-3
     border-b border-gray-200 bg-white px-5 lg:gap-6 "
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 lg:gap-4">
        <button
          type="button"
          aria-label={isMini ? t("expandSidebar") : t("collapseSidebar")}
          aria-pressed={isMini}
          onClick={toggleMini}
          className="relative inline-flex items-center justify-center rounded-md p-1.5 text-gray-900 transition-all hover:bg-gray-100"
        >
          <Menu className="size-5" strokeWidth={1} />
        </button>

        <Link href="/" className="relative z-0 flex shrink-0 items-center py-1">
          <Image
            src={logo}
            alt={t("logoAlt")}
            width={120}
            height={40}
            className="h-8 w-auto max-w-[120px] object-contain sm:h-9"
            priority
          />
        </Link>

        <div
          className="mx-1 hidden min-w-0 flex-1 items-center rounded-md border border-gray-200 bg-white
         py-1 ps-3 pe-1 md:flex md:max-w-[320px] h-10"
        >
          <input
            type="search"
            placeholder={t("searchPlaceholder")}
            className="min-w-0 flex-1 border-0 bg-transparent text-sm text-neutral-800 outline-none
             placeholder:text-gray-400"
            aria-label={t("search")}
          />
          <button
            type="button"
            aria-label={t("search")}
            className="flex size-8 shrink-0 items-center justify-center rounded bg-primary
             text-white transition-colors hover:bg-primary/90"
          >
            <Search className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <nav
        aria-label={t("accountAndTools")}
        className="hidden shrink-0 items-center gap-0.5 lg:flex xl:gap-1"
      >
        <Link href="/" className={navItemHover}>
          <Smartphone className="size-4 shrink-0" />
          {t("app")}
        </Link>
        <Link href="/" className={navItemHover}>
          {t("listProperty")}
        </Link>
        <LocaleSwitcher variant="navbar" />
        <Link href="/" className={navItemHover}>
          {t("customerSupport")}
        </Link>
        <Link href="/" className={navItemHover}>
          {t("findBookings")}
        </Link>
        {user ? (
          <div className="relative ml-1" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={isProfileMenuOpen}
              className="inline-flex items-center gap-2 rounded bg-primary/10 px-2 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                {userInitial}
              </span>
              <span className="max-w-[120px] truncate">
                {user.name || t("profile")}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {isProfileMenuOpen ? (
              <div
                role="menu"
                className="absolute end-0 mt-2 w-48 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
              >
                <Link
                  href="/new/my-booking"
                  role="menuitem"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <BookOpenText className="h-4 w-4" />
                  {t("myBooking")}
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  {t("logout")}
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <Link
            href="/new/login"
            className="ml-1 inline-flex items-center rounded bg-primary px-2 py-2 text-[14px] font-medium text-white transition-colors hover:bg-primary/90"
          >
            {t("signInRegister")}
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
