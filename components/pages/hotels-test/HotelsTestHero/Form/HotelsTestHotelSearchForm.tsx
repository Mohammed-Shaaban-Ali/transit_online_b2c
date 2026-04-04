"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { useMemo, useState } from "react";
import { localStorageHotelSearchKey } from "@/constants";
import {
  pushHotelRecentSearch,
  type HotelRecentSearchItem,
} from "@/utils/hotelRecentSearches";
import { cn } from "@/lib/utils";
import { createSearchFormSchema } from "@/components/shared/HotelSearchBox";
import WhereToPopover from "./WhereToPopover";
import StayDateRangePopover from "./StayDateRangePopover";
import OccupancySteppersPopover from "./OccupancySteppersPopover";
import SegmentDivider from "./SegmentDivider";

export type HotelsTestFormValues = {
  country: string;
  checkIn: string;
  checkOut: string;
  location?: { latitude: number; longitude: number };
  radiusInMeters?: number;
  rooms?: { AdultsCount: number; KidsAges: number[] }[];
  searchValue?: string;
  locationId?: number;
  locationCode?: string;
  storedLocale?: string;
};

function toYmd(dateStr: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toISOString().split("T")[0];
}

function HotelsTestHotelSearchForm() {
  const router = useRouter();
  const tv = useTranslations("Components.HotelSearchBox");
  const t = useTranslations("HotelsTestPage.HotelSearchForm");

  const getTodayDate = () => new Date().toISOString().split("T")[0];
  const getNextDayDate = () => {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    return tmr.toISOString().split("T")[0];
  };

  const schema = useMemo(() => createSearchFormSchema(tv), [tv]);

  const form = useForm<HotelsTestFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      country: "US",
      checkIn: getTodayDate(),
      checkOut: getNextDayDate(),
      location: { latitude: 0, longitude: 0 },
      radiusInMeters: 10000,
      rooms: [{ AdultsCount: 2, KidsAges: [] }],
      searchValue: "",
    },
  });

  const applyRecent = (item: HotelRecentSearchItem) => {
    if (item.searchValue) form.setValue("searchValue", item.searchValue);
    form.setValue("location", item.location);
    form.setValue("checkIn", item.checkIn);
    form.setValue("checkOut", item.checkOut);
    form.setValue("rooms", item.rooms);
    form.setValue("country", item.country);
    form.setValue("radiusInMeters", item.radiusInMeters ?? 10000);
    if (item.locationId) form.setValue("locationId", item.locationId);
    if (item.locationCode) form.setValue("locationCode", item.locationCode);
    form.setValue("storedLocale", item.storedLocale || "");
    form.clearErrors();
    void form.trigger();
  };

  const onSubmit = async (data: HotelsTestFormValues) => {
    try {
      console.log("onSubmit", data);
      const all = form.getValues();
      const params = new URLSearchParams();
      if (data.country) params.append("country", data.country);
      if (data.checkIn) params.append("checkIn", toYmd(data.checkIn));
      if (data.checkOut) params.append("checkOut", toYmd(data.checkOut));
      if (data.location?.latitude != null)
        params.append("lat", String(data.location.latitude));
      if (data.location?.longitude != null)
        params.append("lng", String(data.location.longitude));
      const rooms = data.rooms || all.rooms;
      if (rooms) params.append("rooms", JSON.stringify(rooms));

      const searchValue = form.getValues("searchValue");
      const locationId = form.getValues("locationId");
      const locationCode = form.getValues("locationCode");
      const storedLocale = form.getValues("storedLocale");

      if (searchValue?.trim()) params.append("searchValue", searchValue.trim());
      if (locationId != null) params.append("locationId", String(locationId));
      if (locationCode) params.append("locationCode", locationCode);
      if (storedLocale) params.append("storedLocale", storedLocale);
      if (data.radiusInMeters != null)
        params.append("radiusInMeters", String(data.radiusInMeters));

      const payload: HotelRecentSearchItem = {
        ...data,
        location: data.location ?? { latitude: 0, longitude: 0 },
        rooms: rooms || all.rooms || [{ AdultsCount: 2, KidsAges: [] }],
        radiusInMeters: data.radiusInMeters ?? all.radiusInMeters ?? 10000,
        ...(searchValue && { searchValue }),
        ...(locationId && { locationId }),
        ...(locationCode && { locationCode }),
        ...(storedLocale && { storedLocale }),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem(
          localStorageHotelSearchKey,
          JSON.stringify(payload),
        );
        pushHotelRecentSearch(payload);
      }

      router.push(`/hotels-test/details?${params.toString()}`);
    } catch (e) {
      console.error(e);
    }
  };

  const onInvalid = () => {
    void form.trigger();
  };

  return (
    <form
      // onSubmit={form.handleSubmit(onSubmit, onInvalid)}
      className="w-full"
      noValidate
    >
      <div
        className={cn(
          "w-full overflow-hidden rounded-md md:border md:border-gray-200 bg-white",
          "md:shadow-sm",
          " sm:p-4",
        )}
      >
        <div
          className={cn(
            "flex  w-full min-w-0 flex-col overflow-hidden rounded-md md:border border-gray-300 bg-white",
            "lg:flex-row lg:items-stretch gap-2 md:gap-0",
            "p-2",
          )}
        >
          <WhereToPopover form={form} onApplyRecent={applyRecent} />
          <SegmentDivider />
          <StayDateRangePopover form={form} />
          <SegmentDivider />
          <OccupancySteppersPopover form={form} />
          <SegmentDivider />
          <div className="flex w-full shrink-0 items-stretch self-stretch  lg:w-auto lg:min-w-[132px] md:ms-2 lg:max-w-[220px]">
            <Button
              type="submit"
              // disabled={form.formState.isSubmitting}
              onClick={() => onSubmit(form.getValues())}
              className={cn(
                "h-full  w-full flex-1 flex items-center justify-center gap-2 rounded-md px-5",
                "border-0 bg-primary text-[15px] font-bold text-white shadow-none",
                "hover:bg-primary/80 disabled:opacity-50",
                "min-h-[48px] sm:text-base lg:min-h-[52px]",
              )}
            >
              <FaSearch className="size-4 shrink-0 text-white" />
              {form.formState.isSubmitting ? t("searching") : t("search")}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default HotelsTestHotelSearchForm;
