"use client";

import { RefreshCw, Search, Ship } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import {
  useGetCruiseItineraryMutation,
  useSearchCruisesMutation,
} from "@/redux/features/cruises/cruisesApi";
import {
  clearCruiseResults,
  setCruiseResults,
  setCruiseSearchLoading,
} from "@/redux/features/cruises/cruiseSearchSlice";
import type { CruiseSailingOption, CruiseTimelineDay } from "@/types/cruiseTypes";
import {
  buildCruiseSearchRequest,
  buildCruiseTimelineDays,
} from "@/utils/cruiseHelpers";
import CruiseCard from "./CruiseCard";
import CruiseCabinSelectionSection from "./CruiseCabinSelectionSection";
import CruiseItinerarySection from "./CruiseItinerarySection";
import CruiseResultsSkeleton from "./CruiseResultsSkeleton";

function EmptyCruisesState({
  title,
  description,
  hint,
  actionLabel,
  onAction,
  actionLoading,
}: {
  title: string;
  description: string;
  hint: string;
  actionLabel?: string;
  onAction?: () => void;
  actionLoading?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-linear-to-b from-slate-50 to-white px-6 py-12 text-center shadow-sm sm:px-10">
      <div
        className="pointer-events-none absolute -top-10 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-8 ring-primary/5">
        <Ship className="h-8 w-8 text-primary" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
        {description}
      </p>
      <div className="mx-auto mt-5 inline-flex max-w-md items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs text-gray-600 shadow-xs">
        <Search className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2} />
        <span>{hint}</span>
      </div>
      {onAction && actionLabel && (
        <button
          type="button"
          onClick={onAction}
          disabled={actionLoading}
          className="mx-auto mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <RefreshCw
            className={`size-4 ${actionLoading ? "animate-spin" : ""}`}
          />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function CruiseResultsSection() {
  const t = useTranslations("CruisePage");
  const tForm = useTranslations("CruiseSearchForm");
  const dispatch = useAppDispatch();
  const { submittedForm, results, isSearchLoading } = useAppSelector(
    (state) => state.cruiseSearch,
  );
  const [searchCruises, { isLoading }] = useSearchCruisesMutation();
  const [getCruiseItinerary, itineraryState] = useGetCruiseItineraryMutation();
  const [searchFailed, setSearchFailed] = useState(false);
  const [retryToken, setRetryToken] = useState(0);
  const [selectedOption, setSelectedOption] =
    useState<CruiseSailingOption | null>(null);
  const [timelineDays, setTimelineDays] = useState<CruiseTimelineDay[]>([]);
  const [itineraryRetryToken, setItineraryRetryToken] = useState(0);
  const [view, setView] = useState<"results" | "itinerary" | "cabins">(
    "results",
  );

  const request = useMemo(
    () => (submittedForm ? buildCruiseSearchRequest(submittedForm) : null),
    [submittedForm],
  );

  const requestKey = useMemo(
    () => (request ? JSON.stringify(request) : ""),
    [request],
  );

  useEffect(() => {
    if (!request) {
      dispatch(clearCruiseResults());
      setSearchFailed(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      dispatch(setCruiseSearchLoading(true));
      setSearchFailed(false);
      try {
        const response = await searchCruises(request).unwrap();
        if (cancelled) return;
        dispatch(setCruiseResults(response?.data?.sailingOptions || []));
        setSearchFailed(false);
      } catch {
        if (!cancelled) {
          dispatch(clearCruiseResults());
          setSearchFailed(true);
        }
      } finally {
        if (!cancelled) {
          dispatch(setCruiseSearchLoading(false));
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [requestKey, retryToken, dispatch, searchCruises, request]);

  useEffect(() => {
    setSelectedOption(null);
    setTimelineDays([]);
    setView("results");
  }, [
    requestKey,
    submittedForm?.adults,
    submittedForm?.children,
    submittedForm?.infants,
  ]);

  useEffect(() => {
    const voyageId =
      selectedOption?.selectedSailing?.attributesMap?.voyageId || "";
    if (!voyageId) {
      setTimelineDays([]);
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        const response = await getCruiseItinerary({ voyageId }).unwrap();
        if (cancelled) return;
        setTimelineDays(
          buildCruiseTimelineDays(response?.data?.cruiseItinInfos || []),
        );
      } catch {
        if (!cancelled) {
          setTimelineDays([]);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [selectedOption, itineraryRetryToken, getCruiseItinerary]);

  const handleRetry = () => {
    setRetryToken((value) => value + 1);
  };

  const handleSelectCruise = (option: CruiseSailingOption) => {
    setSelectedOption(option);
    setTimelineDays([]);
    setView("itinerary");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToResults = () => {
    setSelectedOption(null);
    setTimelineDays([]);
    setView("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToItinerary = () => {
    setView("itinerary");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoToCabins = () => {
    setView("cabins");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!submittedForm || !request) {
    return null;
  }

  if (selectedOption && view === "cabins") {
    return (
      <CruiseCabinSelectionSection
        option={selectedOption}
        searchForm={submittedForm}
        onBack={handleBackToItinerary}
      />
    );
  }

  if (selectedOption && view === "itinerary") {
    return (
      <CruiseItinerarySection
        option={selectedOption}
        days={timelineDays}
        onBack={handleBackToResults}
        onNext={handleGoToCabins}
        onRetry={() => setItineraryRetryToken((value) => value + 1)}
        isLoading={itineraryState.isLoading}
        isError={itineraryState.isError}
      />
    );
  }

  if (isSearchLoading || isLoading) {
    return (
      <div className="space-y-6">
        <p className="text-sm font-medium text-gray-500">{tForm("searching")}</p>
        <CruiseResultsSkeleton />
      </div>
    );
  }

  if (searchFailed) {
    return (
      <EmptyCruisesState
        title={t("searchErrorTitle")}
        description={t("searchError")}
        hint={t("emptyStateHint")}
        actionLabel={t("retrySearch")}
        onAction={handleRetry}
        actionLoading={isSearchLoading || isLoading}
      />
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
          {t("resultsTitle")}
        </h2>
        <p className="shrink-0 text-sm text-gray-500">
          {t("resultsCount", { count: results.length })}
        </p>
      </div>

      {results.length === 0 ? (
        <EmptyCruisesState
          title={t("noCruisesTitle")}
          description={t("noCruisesFound")}
          hint={t("emptyStateHint")}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((option, index) => {
            const voyageId =
              option.selectedSailing?.attributesMap?.voyageId ||
              `cruise-${index}`;
            return (
              <CruiseCard
                key={voyageId}
                option={option}
                onSelect={handleSelectCruise}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CruiseResultsSection;
