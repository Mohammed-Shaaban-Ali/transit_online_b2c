"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import {
  setCruiseAdults,
  setCruiseChildren,
  setCruiseInfants,
  setCruiseMonths,
  setCruisePort,
  setCruiseRegion,
  submitCruiseSearch,
} from "@/redux/features/cruises/cruiseSearchSlice";
import { buildCruiseSearchRequest } from "@/utils/cruiseHelpers";
import { buildCruiseSearchParams } from "@/utils/cruiseSearchUrl";
import CruisePassengersPopover from "./CruisePassengersPopover";
import CruiseMonthPopover from "./CruiseMonthPopover";
import {
  CruisePortPopover,
  CruiseRegionPopover,
} from "./CruiseRegionPortPopovers";

type Props = {
  className?: string;
  stayOnPage?: boolean;
};

function CruiseSearchForm({ className, stayOnPage = false }: Props) {
  const t = useTranslations("CruiseSearchForm");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { form, isSearchLoading } = useAppSelector(
    (state) => state.cruiseSearch,
  );
  const [errors, setErrors] = useState<{ months?: string }>({});

  const validate = () => {
    const nextErrors: typeof errors = {};
    if (!form.selectedMonths.length) {
      nextErrors.months = t("validation.selectDates");
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSearch = async () => {
    if (!validate() || isSearchLoading) return;

    const request = buildCruiseSearchRequest(form);
    if (!request) return;

    dispatch(submitCruiseSearch());

    const params = buildCruiseSearchParams(form);
    const path = `/cruises?${params.toString()}`;

    if (stayOnPage) {
      router.replace(path);
    } else {
      router.push(path);
    }
  };

  return (
    <div
      className={cn(
        "mt-0 w-full rounded-[8px] bg-white md:mt-3 p-5",
        className,
      )}
    >
      {/* Mobile */}
      <div className="flex flex-col md:hidden">
        <div className="border-b border-gray-200">
          <CruiseRegionPopover
            value={form.regionPref}
            onChange={(value) => dispatch(setCruiseRegion(value))}
            mobileStyle
          />
        </div>

        <div className="border-b border-gray-200">
          <CruisePortPopover
            value={form.portCode}
            onChange={(value) => dispatch(setCruisePort(value))}
            mobileStyle
          />
        </div>

        <div className="border-b border-gray-200">
          <CruisePassengersPopover
            adults={form.adults}
            children={form.children}
            infants={form.infants}
            onAdultsChange={(value) => dispatch(setCruiseAdults(value))}
            onChildrenChange={(value) => dispatch(setCruiseChildren(value))}
            onInfantsChange={(value) => dispatch(setCruiseInfants(value))}
            mobileStyle
          />
        </div>

        <div className="border-b border-gray-200">
          <CruiseMonthPopover
            selectedMonths={form.selectedMonths}
            onChange={(months) => dispatch(setCruiseMonths(months))}
            error={errors.months}
            mobileStyle
          />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearchLoading}
          className="mt-3 flex h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-primary text-[16px] font-semibold text-white transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <FaSearch size={14} />
          {t("search")}
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex md:items-start pt-2.5 gap-2.5">
        <div className="min-w-0 flex-[1.1]">
          <CruiseRegionPopover
            value={form.regionPref}
            onChange={(value) => dispatch(setCruiseRegion(value))}
          />
        </div>

        <div className="min-w-0 flex-[1.1]">
          <CruisePortPopover
            value={form.portCode}
            onChange={(value) => dispatch(setCruisePort(value))}
          />
        </div>

        <div className="min-w-0 flex-1">
          <CruisePassengersPopover
            adults={form.adults}
            children={form.children}
            infants={form.infants}
            onAdultsChange={(value) => dispatch(setCruiseAdults(value))}
            onChildrenChange={(value) => dispatch(setCruiseChildren(value))}
            onInfantsChange={(value) => dispatch(setCruiseInfants(value))}
          />
        </div>

        <div className="min-w-0 flex-[1.2]">
          <CruiseMonthPopover
            selectedMonths={form.selectedMonths}
            onChange={(months) => dispatch(setCruiseMonths(months))}
            error={errors.months}
          />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearchLoading}
          className="flex h-[58px] shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-[16px] font-semibold text-white transition-colors hover:bg-primary/80 disabled:cursor-not-allowed! disabled:opacity-70"
        >
          <FaSearch size={14} />
          {t("search")}
        </button>
      </div>
    </div>
  );
}

export default CruiseSearchForm;
