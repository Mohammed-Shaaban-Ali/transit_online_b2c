"use client";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { useSearchHotelsMutation } from "@/redux/features/hotels/hotelsApi";
import {
  getHotelSearchParamsFromUrl,
  getHotelsTestFormDefaultsFromUrl,
} from "@/utils/hotelsTestSearchUrl";
import { useHotelFilterRedux } from "@/hooks/useHotelFilterRedux";

const HotelsTestHotelSearchForm = dynamic(
  () =>
    import("@/components/pages/hotels-test/HotelsTestHero/Form/HotelsTestHotelSearchForm"),
  { ssr: false },
);

const HotelsTestResultsSection = dynamic(
  () => import("@/components/pages/hotels-test/HotelsTestResultsSection"),
  { ssr: false },
);

export default function HotelsTestDetailsContent() {
  const searchParams = useSearchParams();
  const t = useTranslations("HotelsTestPage.HotelSearchForm");
  const [searchHotels, { data, isLoading, isError }] =
    useSearchHotelsMutation();
  const { setHotels } = useHotelFilterRedux();
  const hotelsSetRef = useRef(false);

  const queryString = searchParams.toString();

  const apiParams = useMemo(
    () => getHotelSearchParamsFromUrl(new URLSearchParams(queryString)),
    [queryString],
  );

  const formDefaults = useMemo(
    () => getHotelsTestFormDefaultsFromUrl(new URLSearchParams(queryString)),
    [queryString],
  );

  useEffect(() => {
    if (!apiParams) return;
    hotelsSetRef.current = false;
    void searchHotels(apiParams).unwrap();
  }, [apiParams, searchHotels]);

  const hotels = data?.data;
  const uuid = data?.uuid ?? "";
  const filters = data?.filters;

  useLayoutEffect(() => {
    if (
      hotels &&
      Array.isArray(hotels) &&
      hotels.length > 0 &&
      !hotelsSetRef.current
    ) {
      hotelsSetRef.current = true;
      setHotels(hotels);
    }
  }, [hotels, setHotels]);

  useEffect(() => {
    if (!hotels) {
      hotelsSetRef.current = false;
    }
  }, [hotels]);

  // Calculate nights, adults, children from apiParams
  const nights = apiParams
    ? Math.ceil(
        (new Date(apiParams.checkOut).getTime() -
          new Date(apiParams.checkIn).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : undefined;

  const adults = apiParams
    ? apiParams.rooms.reduce((sum, r) => sum + r.AdultsCount, 0)
    : undefined;

  const children = apiParams
    ? apiParams.rooms.reduce((sum, r) => sum + (r.KidsAges?.length || 0), 0)
    : undefined;

  const roomsCount = apiParams ? apiParams.rooms.length : undefined;

  const showLoading = Boolean(apiParams && isLoading);

  return (
    <section className="mx-auto max-w-[1200px]! container w-full pt-32 sm:pt-20 ">
      {formDefaults ? (
        <>
          <div className="mb-6">
            <HotelsTestHotelSearchForm
              initialValues={formDefaults}
              primaryBorder
              stayOnPage
            />
          </div>
        </>
      ) : (
        <p className="text-muted-foreground">{t("detailsMissingParams")}</p>
      )}

      {!apiParams && !formDefaults && null}

      {apiParams && (
        <HotelsTestResultsSection
          uuid={uuid}
          isLoading={showLoading}
          isError={Boolean(isError && apiParams)}
          filters={filters}
          nights={nights}
          rooms={roomsCount}
          adults={adults}
          children={children}
          apiHotelCount={data?.data?.length ?? 0}
        />
      )}
    </section>
  );
}
