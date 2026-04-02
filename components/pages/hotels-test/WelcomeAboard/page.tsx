import Image from "next/image";
import { Check, ChevronRight, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import WelcomeAboardIllustration from "@/public/images/hotels/WelcomeAboard1.png";
import WelcomeAboardIllustration2 from "@/public/images/hotels/WelcomeAboard2.png";

type Props = {};

const accentPink = "#D63E63";

function WelcomeAboard({}: Props) {
  const t = useTranslations("HotelsTestPage.WelcomeAboard");

  return (
    <div className="container">
      <div
        className="mx-auto max-w-[1200px]! relative overflow-hidden rounded-xl border
      bg-white flex flex-col gap-4 px-4 py-4 sm:px-5 sm:py-5
      md:flex-row md:items-center md:gap-10 md:h-48 md:px-0 md:py-0"
      >
        {/* Illustration */}
        <div
          className="flex shrink-0 justify-center w-full max-w-[220px] mx-auto relative h-36
        sm:h-40 md:mx-0 md:w-[min(100%,240px)] md:max-w-none md:h-full"
        >
          <Image
            src={WelcomeAboardIllustration2}
            alt="Magician with coupon and discount offer"
            width={260}
            height={200}
            className="absolute top-0 left-0 w-full h-full object-fill"
          />
          <Image
            src={WelcomeAboardIllustration}
            alt="Magician with coupon and discount offer"
            width={260}
            height={200}
            className=" w-full max-w-[240px] object-contain mt-auto"
            priority
          />
        </div>

        {/* Copy */}
        <div className="min-w-0 flex-1 text-center md:text-start py-2 md:py-0">
          <h2
            className="font-bold leading-snug text-[20px] sm:text-[22px] text-primary mb-2
          md:text-[24px] md:mb-3"
          >
            {t("title", { discount: 10 })}
          </h2>
          <ul
            className="space-y-2 text-start text-[14px] sm:text-[15px] text-black/60
          md:text-[16px]"
          >
            <li className="flex gap-2">
              <Check
                className="mt-0.5 h-[18px] w-[18px] shrink-0 text-primary"
                strokeWidth={2.5}
                aria-hidden
              />
              <span>{t("perk1")}</span>
            </li>
            <li className="flex gap-2">
              <Check
                className="mt-0.5 h-[18px] w-[18px] shrink-0 text-primary"
                strokeWidth={2.5}
                aria-hidden
              />
              <span>{t("perk2")}</span>
            </li>
          </ul>
          <button
            type="button"
            className="mt-2 inline-flex items-center justify-center gap-2 text-[15px] sm:text-[16px]
          font-medium transition-opacity hover:opacity-80 text-primary md:justify-start"
          >
            <Plus
              className="size-5 text-primary"
              strokeWidth={2.5}
              aria-hidden
            />
            {t("usePromoCode")}
          </button>
        </div>

        {/* CTA */}
        <div className="flex shrink-0 w-full justify-center p-2 md:w-auto md:justify-end md:p-4">
          <button
            type="button"
            className="inline-flex w-full max-w-sm items-center justify-center gap-1 rounded-full
          px-7 py-3 text-sm font-semibold text-white bg-primary md:w-auto md:max-w-none"
          >
            {t("claimDiscount")}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeAboard;
