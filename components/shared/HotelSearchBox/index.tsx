"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import LocationSearch from "./LocationSearch";
import HotelDatePicker from "./HotelDatePicker";
import GuestSearch from "./GuestSearch";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { localStorageHotelSearchKey, } from "@/constants";

type Props = {
  defaultValues?: searchHotelsParams;
};

export interface searchHotelsParams {
  country: string;
  checkIn: string;
  checkOut: string;
  location: {
    latitude: number;
    longitude: number;
  };
  radiusInMeters: number;
  rooms: {
    AdultsCount: number;
    KidsAges: number[];
  }[];
}

const createSearchFormSchema = (t: (key: string) => string) =>
  z
    .object({
      country: z
        .string()
        .min(1, { message: t("validation.countryRequired") })
        .refine((val) => val.trim().length > 0, {
          message: t("validation.countryEmpty"),
        }),
      checkIn: z
        .string()
        .min(1, { message: t("validation.checkInRequired") })
        .refine(
          (val) => {
            if (!val) return false;
            const checkInDate = new Date(val);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            checkInDate.setHours(0, 0, 0, 0);
            return checkInDate >= today;
          },
          {
            message: t("validation.checkInPast"),
          }
        ),
      checkOut: z
        .string()
        .min(1, { message: t("validation.checkOutRequired") }),
      location: z
        .object({
          latitude: z.number(),
          longitude: z.number(),
        })
        .optional(),
      radiusInMeters: z.number().optional(),
      rooms: z
        .array(
          z.object({
            AdultsCount: z.number(),
            KidsAges: z.array(z.number()),
          })
        )
        .optional(),
    })
    .refine(
      (data) => {
        if (!data.location) {
          return false;
        }
        return data.location.latitude !== 0 && data.location.longitude !== 0;
      },
      {
        message: t("validation.locationRequired"),
        path: ["location"],
      }
    )
    .refine(
      (data) => {
        if (data.checkIn && data.checkOut) {
          const checkInDate = new Date(data.checkIn);
          const checkOutDate = new Date(data.checkOut);
          checkInDate.setHours(0, 0, 0, 0);
          checkOutDate.setHours(0, 0, 0, 0);
          return checkOutDate > checkInDate;
        }
        return true;
      },
      {
        message: t("validation.checkOutAfterCheckIn"),
        path: ["checkOut"],
      }
    );

function HotelSearchBox({ defaultValues }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("Components.HotelSearchBox");

  // Get today's date as default check-in date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Get next day's date as default check-out date
  const getNextDayDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Get last search from localStorage
  const getLastSearchFromStorage = (): searchHotelsParams | null => {
    if (typeof window === "undefined") {
      return null;
    }
    try {
      const storedSearch = localStorage.getItem(localStorageHotelSearchKey);
      if (storedSearch) {
        const parsed = JSON.parse(storedSearch);
        // Validate that it has required fields
        if (parsed.checkIn && parsed.checkOut && parsed.location) {
          // Check if check-in date is not in the past
          const checkInDate = new Date(parsed.checkIn);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          checkInDate.setHours(0, 0, 0, 0);

          // Only return if check-in date is today or in the future
          if (checkInDate >= today) {
            return parsed as searchHotelsParams;
          }
        }
      }
    } catch (error) {
      console.error("Error reading last search from localStorage:", error);
    }
    return null;
  };

  // Get searchValue and location info from localStorage if available and location matches
  const getSearchInfoFromStorage = (location?: {
    latitude: number;
    longitude: number;
  }): { searchValue?: string; locationId?: number; locationCode?: string; storedLocale?: string } => {
    if (typeof window === "undefined" || !location) return {};

    try {
      const storedSearch = localStorage.getItem(localStorageHotelSearchKey);
      if (storedSearch) {
        const parsed = JSON.parse(storedSearch);
        if (parsed.searchValue && parsed.location) {
          const storedLat = parsed.location.latitude;
          const storedLng = parsed.location.longitude;
          const currentLat = location.latitude;
          const currentLng = location.longitude;

          // If locations match (within small tolerance), return the stored info
          if (
            Math.abs(storedLat - currentLat) < 0.001 &&
            Math.abs(storedLng - currentLng) < 0.001
          ) {
            return {
              searchValue: parsed.searchValue,
              locationId: parsed.locationId,
              locationCode: parsed.locationCode,
              storedLocale: parsed.storedLocale,
            };
          }
        }
      }
    } catch (error) {
      console.error("Error reading search info from localStorage:", error);
    }
    return {};
  };

  // Legacy function for backward compatibility
  const getSearchValueFromStorage = (location?: {
    latitude: number;
    longitude: number;
  }) => {
    return getSearchInfoFromStorage(location).searchValue;
  };

  // Get last search from localStorage if no defaultValues provided
  const lastSearch = !defaultValues ? getLastSearchFromStorage() : null;

  // Determine if we have default values (from props or last search)
  const hasDefaultValues = !!(defaultValues || lastSearch);

  const searchFormSchema = createSearchFormSchema(t);

  const form = useForm<searchHotelsParams & { searchValue?: string; locationId?: number; locationCode?: string; storedLocale?: string }>({
    resolver: zodResolver(searchFormSchema) as any,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: defaultValues
      ? {
        ...defaultValues,
        searchValue:
          (defaultValues as any).searchValue ||
          getSearchInfoFromStorage(defaultValues.location).searchValue,
        locationId:
          (defaultValues as any).locationId ||
          getSearchInfoFromStorage(defaultValues.location).locationId,
        locationCode:
          (defaultValues as any).locationCode ||
          getSearchInfoFromStorage(defaultValues.location).locationCode,
        storedLocale:
          (defaultValues as any).storedLocale ||
          getSearchInfoFromStorage(defaultValues.location).storedLocale,
      }
      : lastSearch
        ? {
          ...lastSearch,
          searchValue:
            (lastSearch as any).searchValue ||
            getSearchInfoFromStorage(lastSearch.location).searchValue,
          locationId:
            (lastSearch as any).locationId ||
            getSearchInfoFromStorage(lastSearch.location).locationId,
          locationCode:
            (lastSearch as any).locationCode ||
            getSearchInfoFromStorage(lastSearch.location).locationCode,
          storedLocale:
            (lastSearch as any).storedLocale ||
            getSearchInfoFromStorage(lastSearch.location).storedLocale,
        }
        : {
          country: "US",
          checkIn: getTodayDate(),
          checkOut: getNextDayDate(),
          location: {
            latitude: 0,
            longitude: 0,
          },
          radiusInMeters: 10000,
          rooms: [
            {
              AdultsCount: 2,
              KidsAges: [],
            },
          ],
        },
  });

  // Set searchValue, locationId, locationCode and storedLocale after mount if missing but location is available
  const searchValueSetRef = useRef(false);
  useEffect(() => {
    if (searchValueSetRef.current) return;

    const currentLocation = form.getValues("location");
    const currentSearchValue = form.getValues("searchValue");

    if (
      currentLocation &&
      currentLocation.latitude !== 0 &&
      currentLocation.longitude !== 0 &&
      (!currentSearchValue || currentSearchValue.trim().length === 0)
    ) {
      const storedInfo = getSearchInfoFromStorage(currentLocation);
      if (storedInfo.searchValue) {
        form.setValue("searchValue", storedInfo.searchValue, { shouldValidate: false });
        if (storedInfo.locationId) {
          form.setValue("locationId", storedInfo.locationId, { shouldValidate: false });
        }
        if (storedInfo.locationCode) {
          form.setValue("locationCode", storedInfo.locationCode, { shouldValidate: false });
        }
        if (storedInfo.storedLocale) {
          form.setValue("storedLocale", storedInfo.storedLocale, { shouldValidate: false });
        }
        searchValueSetRef.current = true;
      }
    }
  }, [form, defaultValues]);

  const onSubmit = async (data: searchHotelsParams) => {
    try {
      // Only show loading if defaultValues are not provided
      if (!defaultValues) {
        setIsLoading(true);
      }
      // Get all form values including rooms (in case it's not in validated data)
      const allFormValues = form.getValues();

      // Create URLSearchParams object
      const searchParams = new URLSearchParams();

      // Add basic parameters
      if (data.country) searchParams.append("country", data.country);
      if (data.checkIn)
        searchParams.append(
          "checkIn",
          new Date(data.checkIn).toISOString().split("T")[0]
        );
      if (data.checkOut)
        searchParams.append(
          "checkOut",
          new Date(data.checkOut).toISOString().split("T")[0]
        );
      if (data.location?.latitude)
        searchParams.append("lat", data.location.latitude.toString());
      if (data.location?.longitude)
        searchParams.append("lng", data.location.longitude.toString());

      // Add rooms data (serialized as JSON because it's complex)
      // Use rooms from validated data or fallback to form valueseficta_online_b2b
      const rooms = data.rooms || allFormValues.rooms;
      if (rooms) searchParams.append("rooms", JSON.stringify(rooms));

      // Get searchValue, locationId, locationCode and storedLocale from form and save it with the search data
      const searchValue = form.getValues("searchValue");
      const locationId = form.getValues("locationId");
      const locationCode = form.getValues("locationCode");
      const storedLocale = form.getValues("storedLocale");
      const searchDataWithValue = {
        ...data,
        rooms: rooms || allFormValues.rooms,
        radiusInMeters: data.radiusInMeters || allFormValues.radiusInMeters,
        ...(searchValue && { searchValue }),
        ...(locationId && { locationId }),
        ...(locationCode && { locationCode }),
        ...(storedLocale && { storedLocale }),
      };

      // Navigate to search page with query params
      if (typeof window !== "undefined") {
        localStorage.setItem(localStorageHotelSearchKey, JSON.stringify(searchDataWithValue));
      }
      router.push(`/hotels?${searchParams.toString()}`);
    } catch (error) {
      console.error("Search error:", error);
      // toast.error(getError(error));
      if (!defaultValues) {
        setIsLoading(false);
      }
    } finally {
      if (!defaultValues) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative  ">
      <div
        className={`container bg-primary-light p-2 py-5 sm:p-5 
          ${defaultValues
            ? "rounded-2xl "
            : "rounded-b-2xl ltr:rounded-tr-2xl rtl:rounded-tl-2xl "
          }
            `}
        style={{ width: "100%" }}
      >
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-4 w-full h-full  `}
          style={{ width: "100%" }}
        >
          <LocationSearch form={form} />
          <HotelDatePicker form={form} />
          <GuestSearch form={form} />
          <div className="flex justify-end items-center col-span-1  ">
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className=" px-4 sm:px-6 w-full sm:w-[200px] 
              flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            // style={{ fontSize: "16px" }}
            >
              <FaSearch />
              {isLoading ? t("searching") : t("search")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HotelSearchBox;
