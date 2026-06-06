"use client";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchHotelsMutation } from "@/redux/features/hotels/hotelsApi";
import {
  getHotelSearchParamsFromUrl,
  getHotelsTestFormDefaultsFromUrl,
} from "@/utils/hotelsTestSearchUrl";
import { useHotelFilterRedux } from "@/hooks/useHotelFilterRedux";
import { useCountry } from "@/hooks/useCountry";

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
  const country = useCountry();

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
  }, [apiParams, searchHotels, country]);

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

  const [formBarHeight, setFormBarHeight] = useState(0);
  const formBarRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (spacerRef.current) {
        spacerRef.current.style.height = isScrolled ? "0px" : "80px";
      }
      if (wrapperRef.current) {
        if (isScrolled) {
          wrapperRef.current.style.background = "white";
          wrapperRef.current.style.padding = "8px 0";
          wrapperRef.current.style.boxShadow = "0 6px 18px rgba(15,23,42,0.12)";
        } else {
          wrapperRef.current.style.background = "transparent";
          wrapperRef.current.style.padding = "0 0 8px";
          wrapperRef.current.style.boxShadow = "none";
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (formBarRef.current) {
        setFormBarHeight(formBarRef.current.getBoundingClientRect().height);
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    if (formBarRef.current) observer.observe(formBarRef.current);

    const t1 = setTimeout(measure, 100);
    const t2 = setTimeout(measure, 500);

    return () => {
      observer.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [formDefaults]);

  return (
    <>
      {formDefaults ? (
        <div ref={formBarRef} className="sticky top-0 z-30 w-full">
          <div ref={spacerRef} style={{ height: "80px" }} />
          <div
            ref={wrapperRef}
            className="w-full"
            style={{ background: "transparent", padding: "0 0 8px" }}
          >
            <div className="mx-auto max-w-[1200px]! container w-full">
              <HotelsTestHotelSearchForm
                initialValues={formDefaults}
                primaryBorder
                stayOnPage
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-[1200px] container w-full pt-32 sm:pt-20">
          <p className="text-muted-foreground">{t("detailsMissingParams")}</p>
        </div>
      )}

      <section className="mx-auto max-w-[1200px]! container w-full ">
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
            stickyTop={formBarHeight + 16}
          />
        )}
      </section>
    </>
  );
}
