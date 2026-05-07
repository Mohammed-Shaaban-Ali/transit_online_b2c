"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { useEffect, useMemo } from "react";
import { localStorageHotelSearchKey } from "@/constants";
import {
  pushHotelRecentSearch,
  type HotelRecentSearchItem,
} from "@/utils/hotelRecentSearches";
import { cn } from "@/lib/utils";
import { z } from "zod";
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

const getTodayDate = () => new Date().toISOString().split("T")[0];
const getNextDayDate = () => {
  const tmr = new Date();
  tmr.setDate(tmr.getDate() + 1);
  return tmr.toISOString().split("T")[0];
};

function buildDefaultFormValues(): HotelsTestFormValues {
  return {
    country: "US",
    checkIn: getTodayDate(),
    checkOut: getNextDayDate(),
    radiusInMeters: 10000,
    rooms: [{ AdultsCount: 2, KidsAges: [] }],
    searchValue: "",
  };
}

type HotelsTestHotelSearchFormProps = {
  /** When set (e.g. on details page from URL), the form shows the same criteria as the last search. */
  initialValues?: Partial<HotelsTestFormValues>;
  /** Strong primary border around the search bar (details / results preview). */
  primaryBorder?: boolean;
  /**
   * When true, the Search button does router.replace (stays on the same details page)
   * instead of router.push (which would create a new history entry back to the hero page).
   */
  stayOnPage?: boolean;
  className?: string;
};

function HotelsTestHotelSearchForm({
  initialValues,
  primaryBorder = false,
  stayOnPage = false,
  className,
}: HotelsTestHotelSearchFormProps) {
  const router = useRouter();
  const tv = useTranslations("Components.HotelSearchBox");
  const t = useTranslations("HotelsTestPage.HotelSearchForm");

  const schema = useMemo(
    () =>
      z
        .object({
          country: z.string().min(1),
          checkIn: z.string().min(1),
          checkOut: z.string().min(1),
          location: z
            .object({ latitude: z.number(), longitude: z.number() })
            .optional(),
          radiusInMeters: z.number().optional(),
          rooms: z
            .array(
              z.object({
                AdultsCount: z.number(),
                KidsAges: z.array(z.number()),
              }),
            )
            .optional(),
          searchValue: z.string().optional(),
          locationId: z.coerce.number().optional(),
          locationCode: z.string().optional(),
          storedLocale: z.string().optional(),
        })
        .refine(
          (data) =>
            !!data.location &&
            (data.location.latitude !== 0 || data.location.longitude !== 0),
          { message: tv("validation.locationRequired"), path: ["location"] },
        ),
    [tv],
  );

  const form = useForm<HotelsTestFormValues>({
    resolver: zodResolver(schema) as Resolver<HotelsTestFormValues>,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      ...buildDefaultFormValues(),
      ...initialValues,
    },
  });

  const initialSerialized = useMemo(
    () => (initialValues ? JSON.stringify(initialValues) : ""),
    [initialValues],
  );

  useEffect(() => {
    if (!initialSerialized) return;
    const parsed = JSON.parse(
      initialSerialized,
    ) as Partial<HotelsTestFormValues>;
    form.reset({
      ...buildDefaultFormValues(),
      ...parsed,
    });
    void form.trigger();
  }, [initialSerialized, form]);

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
      console.log("onSubmit data", data);
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
        location: data.location!,
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

      if (stayOnPage) {
        router.replace(`/hotels/details?${params.toString()}`);
      } else {
        router.push(`/hotels/details?${params.toString()}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onInvalid = (errors: object) => {
    console.log("onInvalid errors", errors);
    void form.trigger();
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, onInvalid)}
      className={cn(
        "w-full",
        className,
        !primaryBorder ? "rounded-md sm:p-3 bg-white" : "",
      )}
      noValidate
    >
      <div
        className={cn(
          "flex  w-full min-w-0 flex-col overflow-hidden rounded-md border bg-white",
          primaryBorder ? "border-primary border-2" : "border-gray-300",
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
        <div
          className="flex w-full shrink-0 items-stretch self-stretch  
        lg:w-auto lg:min-w-[132px] md:ms-2 lg:max-w-[200px]"
        >
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className={cn(
              "h-full  w-full flex-1 flex items-center justify-center gap-2 rounded-md ",
              "border-0 bg-primary text-[16px] font-bold text-white shadow-none",
              "hover:bg-primary/80 disabled:opacity-50",
              "min-h-[48px]  lg:min-h-[50px]",
            )}
          >
            <FaSearch className="size-4 shrink-0 text-white" />
            {form.formState.isSubmitting ? t("searching") : t("search")}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default HotelsTestHotelSearchForm;
