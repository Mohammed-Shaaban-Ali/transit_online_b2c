"use client";

import { useSearchParams } from "next/navigation";
import { useLayoutEffect, useMemo } from "react";
import { useAppDispatch } from "@/redux/app/hooks";
import { hydrateCruiseSearchForm } from "@/redux/features/cruises/cruiseSearchSlice";
import {
  getCruiseSearchParamsFromUrl,
  hasValidCruiseSearchParams,
} from "@/utils/cruiseSearchUrl";

export function useCruiseSearchFromUrl() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const queryString = searchParams.toString();

  const urlFormValues = useMemo(
    () => getCruiseSearchParamsFromUrl(new URLSearchParams(queryString)),
    [queryString],
  );

  const hasSearchParams = useMemo(
    () => hasValidCruiseSearchParams(new URLSearchParams(queryString)),
    [queryString],
  );

  useLayoutEffect(() => {
    if (!urlFormValues) return;
    dispatch(hydrateCruiseSearchForm(urlFormValues));
  }, [urlFormValues, dispatch]);

  return { hasSearchParams, urlFormValues };
}
