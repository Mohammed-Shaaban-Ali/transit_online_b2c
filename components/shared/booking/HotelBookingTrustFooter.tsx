"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const TRUST_ICON_PRICE_MATCH =
  "https://ak-d.tripcdn.com/images/0AS5f120008whj34f2145.png";
const TRUST_ICON_SECURE_PAYMENT =
  "https://ak-d.tripcdn.com/images/0AS6b1200090fx7s7F635.png";

export interface HotelBookingTrustFooterLinkProps {
  termsHref?: string;
  privacyHref?: string;
  tripProtectionHref?: string;
}

export default function HotelBookingTrustFooter({
  termsHref = "/terms",
  privacyHref = "/privacy",
  tripProtectionHref = "/travel-protection",
}: HotelBookingTrustFooterLinkProps) {
  const t = useTranslations("BookingForm");

  return (
    <div className="flex flex-col gap-4 pt-1">
      <div
        className="flex flex-wrap items-center  
      gap-x-8 gap-y-3 text-14 text-slate-800 "
      >
        <div className="flex items-center gap-2">
          <Image
            src={TRUST_ICON_PRICE_MATCH}
            alt=""
            width={22}
            height={22}
            className="shrink-0 object-contain"
          />
          <span className="font-medium">{t("trustPriceMatch")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Image
            src={TRUST_ICON_SECURE_PAYMENT}
            alt=""
            width={22}
            height={22}
            className="shrink-0 object-contain"
          />
          <span className="font-medium">{t("trustSecurePayment")}</span>
        </div>
      </div>

      <p className="text-center text-base leading-relaxed text-slate-800 md:text-start">
        {t.rich("bookingAgreement", {
          terms: (chunks) => (
            <Link
              href={termsHref}
              className="font-medium text-primary underline underline-offset-2 hover:opacity-90"
            >
              {chunks}
            </Link>
          ),
          privacy: (chunks) => (
            <Link
              href={privacyHref}
              className="font-medium text-primary underline underline-offset-2 hover:opacity-90"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>

      <p className="text-center text-sm leading-relaxed text-gray-700 md:text-start">
        {t("savedTravelerInfoNote")}
      </p>
    </div>
  );
}
