"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpenText, ChevronDown, LogOut } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { logoutUser } from "@/redux/features/auth/authSlice";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface UserMenuProps {
  wrapperClassName?: string;
  triggerClassName?: string;
  avatarClassName?: string;
  nameClassName?: string;
  menuClassName?: string;
  menuItemClassName?: string;
  logoutClassName?: string;
  signInClassName?: string;
}

export default function UserMenu({
  wrapperClassName = "relative ml-1",
  triggerClassName = "inline-flex items-center gap-2 rounded bg-primary/10 px-2 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20",
  avatarClassName = "inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white",
  nameClassName = "max-w-[120px] truncate",
  menuClassName = "absolute end-0 mt-2 w-48 rounded-md border border-gray-200 bg-white p-1 shadow-lg",
  menuItemClassName = "flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100",
  logoutClassName = "flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50",
  signInClassName = "ml-1 inline-flex items-center rounded bg-primary px-2 py-2 text-[14px] font-medium text-white transition-colors hover:bg-primary/90",
}: UserMenuProps) {
  const t = useTranslations("NewPage.navbar");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const locale = useLocale();
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
    router.push(`/${locale}`);
  };

  if (!user) {
    return (
      <Link href="/login" className={signInClassName}>
        {t("signInRegister")}
      </Link>
    );
  }

  return (
    <div className={wrapperClassName} ref={profileMenuRef}>
      <button
        type="button"
        onClick={() => setIsProfileMenuOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isProfileMenuOpen}
        className={triggerClassName}
      >
        <span className={avatarClassName}>{userInitial}</span>
        <span className={nameClassName}>{user.name || t("profile")}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isProfileMenuOpen ? (
        <div role="menu" className={menuClassName}>
          <Link
            href="/my-booking"
            role="menuitem"
            onClick={() => setIsProfileMenuOpen(false)}
            className={menuItemClassName}
          >
            <BookOpenText className="h-4 w-4" />
            {t("myBooking")}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className={logoutClassName}
          >
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </button>
        </div>
      ) : null}
    </div>
  );
}

