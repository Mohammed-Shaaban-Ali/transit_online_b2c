import Image from "next/image";
import { useTranslations } from "next-intl";

type Props = Record<string, never>;

function PriceMatch({}: Props) {
  const t = useTranslations("HotelsTestPage.PriceMatch");

  const ratingPlatforms = [
    {
      id: "app-store",
      icon: "https://ak-d.tripcdn.com/images/05S4g12000cqdx0yc54ED.png",
      alt: t("appStoreAlt"),
      rating: t("appStoreRating"),
      reviews: t("appStoreReviews"),
    },
    {
      id: "google-play",
      icon: "https://ak-d.tripcdn.com/images/05S4212000cqdwzbb83F0.png",
      alt: t("googlePlayAlt"),
      rating: t("googlePlayRating"),
      reviews: t("googlePlayReviews"),
    },
  ];

  const perks = [
    {
      id: "price-match",
      icon: "https://ak-d.tripcdn.com/images/0AS5f120008whj34f2145.png",
      alt: t("priceMatchIconAlt"),
      title: t("pricMatchTitle"),
      description: t("priceMatchDesc"),
    },
    {
      id: "rewards",
      icon: "https://aw-s.tripcdn.com/modules/ibu/flight-online-web/font/rewards.659f252ca5.svg",
      alt: t("rewardsIconAlt"),
      title: t("rewardsTitle"),
      description: t("rewardsDesc"),
    },
  ];

  return (
    <section className="container mx-auto w-full max-w-[1200px]! py-6 md:py-8">
      <div className="grid gap-6 md:grid-cols-[1.05fr_1fr_1fr] md:items-center md:gap-0">
        <div className="space-y-4 ">
          {ratingPlatforms.map((platform) => (
            <div key={platform.id} className="flex items-center gap-3">
              <Image
                src={platform.icon}
                alt={platform.alt}
                className="h-10 w-10 shrink-0 object-contain"
                loading="lazy"
                width={40}
                height={40}
              />
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[16px] leading-none text-black/75">
                <span className="font-semibold text-black">
                  {platform.rating}
                </span>
                <span
                  className="text-[16px] tracking-[0.14em] text-yellow-500"
                  aria-label="5 star rating"
                >
                  ★★★★★
                </span>
                <span className="text-[14px] text-black/50">
                  {platform.reviews}
                </span>
              </div>
            </div>
          ))}
        </div>

        {perks.map((perk) => (
          <article key={perk.id} className="flex h-full items-start gap-3">
            <img
              src={perk.icon}
              alt={perk.alt}
              className="mt-0.5 h-10 w-10 shrink-0 object-contain"
              loading="lazy"
            />
            <div className="min-w-0">
              <h3 className="text-[18px] font-semibold leading-tight text-black">
                {perk.title}
              </h3>
              <p className="mt-1.5 text-[14px] leading-5 text-black/50">
                {perk.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PriceMatch;
