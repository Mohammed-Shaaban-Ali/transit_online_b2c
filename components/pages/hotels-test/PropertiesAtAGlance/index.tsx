import { useTranslations } from "next-intl";

type Props = Record<string, never>;

function PropertiesAtAGlance({}: Props) {
  const t = useTranslations("HotelsTestPage.PropertiesAtAGlance");

  const stats = [
    { label: t("totalProperties"), value: t("totalPropertiesValue") },
    { label: t("numberOfReviews"), value: t("numberOfReviewsValue") },
    { label: t("lowestPrice"), value: t("lowestPriceValue") },
    { label: t("highestPrice"), value: t("highestPriceValue") },
  ];

  return (
    <section className="container mx-auto w-full min-w-0 max-w-[1200px]! py-10">
      <h2 className="mb-5 text-[22px] font-bold leading-tight sm:text-[28px]">
        {t("title")}
      </h2>

      <div className="rounded-xl border border-gray-300 ">
        <div className="grid grid-cols-2 divide-x divide-y divide-gray-300 sm:grid-cols-4 sm:divide-y-0">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-1 p-4 text-center"
            >
              <span className="text-[16px] text-black/70">{stat.label}</span>
              <span className="text-[16px] font-semibold text-black/70">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PropertiesAtAGlance;
