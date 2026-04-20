"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

function CoinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle
        cx="10"
        cy="10"
        r="9"
        fill="url(#coinGrad)"
        stroke="#B8860B"
        strokeWidth="1"
      />
      <ellipse cx="10" cy="10" rx="6" ry="2.5" fill="#FFD54F" opacity="0.45" />
      <defs>
        <linearGradient
          id="coinGrad"
          x1="4"
          y1="3"
          x2="16"
          y2="17"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFE082" />
          <stop offset="1" stopColor="#F9A825" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function HexBadge({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M7 1L12.196 4V10L7 13L1.804 10V4L7 1Z"
        fill="#E8E8E8"
        stroke="#BDBDBD"
        strokeWidth="0.6"
      />
    </svg>
  );
}

/** Slim full-width bar (Trip.com–style) for showfarefirst booking flow */
export default function ShowFareFirstBookingNavbar() {
  const t = useTranslations("FlightBooking.bookingNav");
  const tNewNav = useTranslations("NewPage.navbar");

  const points = 0;

  return (
    <header
      className="sticky top-0 z-50 flex h-[58px] w-full shrink-0 items-center justify-between  px-4 text-white shadow-[0_1px_0_rgba(0,0,0,0.06)] sm:px-6"
      role="banner"
    >
      <Link
        href="/new"
        className="flex items-center gap-0 font-bold text-[17px] leading-none tracking-tight text-white sm:text-[18px]"
      >
        <Image src={logo} alt="Transit" width={100} height={100} />
      </Link>

      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href="/new"
          className="max-w-[38vw] truncate text-xs font-normal text-white/95 hover:text-white sm:max-w-none sm:text-[15px]"
        >
          {tNewNav("customerSupport")}
        </Link>

        <div
          className="flex items-center gap-1.5"
          aria-label={t("pointsAria", { count: points })}
        >
          <CoinIcon className="shrink-0" />
          <span className="text-[15px] font-semibold tabular-nums sm:text-base">
            {points}
          </span>
        </div>

        <button
          type="button"
          className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-200 outline-none ring-offset-2 ring-offset-[#3662f4] focus-visible:ring-2 focus-visible:ring-white/80 sm:size-10"
          aria-label={t("accountAria")}
        >
          <span className="flex size-[30px] items-center justify-center overflow-hidden rounded-full bg-sky-100 sm:size-[34px]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <circle cx="12" cy="9" r="4" fill="#37474F" />
              <path
                d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6"
                stroke="#37474F"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="absolute -bottom-0.5 -end-0.5 flex size-[18px] items-center justify-center rounded-sm bg-[#3662f4]">
            <HexBadge className="drop-shadow-sm" />
          </span>
        </button>
      </div>
    </header>
  );
}
