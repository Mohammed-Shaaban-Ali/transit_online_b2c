"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import {
  FlightSearchParams,
  useGetFlightProvidersQuery,
  useLazySearchFlightsQuery,
} from "@/redux/features/flights/flightsApi";
import { FlightSearchResponse } from "@/types/flightTypes";
import { mergeFlightData } from "@/utils/mergeFlightData";
import { mergeFlightFilterOptions } from "@/utils/mergeFlightFilterOptions";

type SearchArg = FlightSearchParams | typeof skipToken;

export function useMultiProviderFlightSearch(searchParams: SearchArg) {
  const {
    data: providersResponse,
    isLoading: isProvidersLoading,
    isFetching: isProvidersFetching,
    isError: isProvidersError,
  } = useGetFlightProvidersQuery();

  const providers = providersResponse?.data?.flights ?? [];
  const providersKey = providers.join(",");

  const [triggerSearch] = useLazySearchFlightsQuery();

  const [resultsByProvider, setResultsByProvider] = useState<
    Record<string, FlightSearchResponse>
  >({});
  const [fetchingByProvider, setFetchingByProvider] = useState<
    Record<string, boolean>
  >({});
  const [errorsByProvider, setErrorsByProvider] = useState<
    Record<string, unknown>
  >({});

  const requestIdRef = useRef(0);
  const isSearchEnabled = searchParams !== skipToken;
  const searchKey = isSearchEnabled ? JSON.stringify(searchParams) : "";

  useEffect(() => {
    if (!isSearchEnabled || !providersKey || !searchKey) {
      setResultsByProvider((prev) =>
        Object.keys(prev).length ? {} : prev
      );
      setFetchingByProvider((prev) =>
        Object.keys(prev).length ? {} : prev
      );
      setErrorsByProvider((prev) =>
        Object.keys(prev).length ? {} : prev
      );
      return;
    }

    const requestId = ++requestIdRef.current;
    const providersList = providersKey.split(",");
    const params = JSON.parse(searchKey) as FlightSearchParams;

    const initialFetching: Record<string, boolean> = {};
    providersList.forEach((provider) => {
      initialFetching[provider] = true;
    });

    setResultsByProvider({});
    setErrorsByProvider({});
    setFetchingByProvider(initialFetching);

    providersList.forEach(async (provider) => {
      try {
        const result = await triggerSearch({
          ...params,
          provider,
        }).unwrap();

        if (requestIdRef.current !== requestId) return;

        setResultsByProvider((prev) => ({ ...prev, [provider]: result }));
      } catch (error) {
        if (requestIdRef.current !== requestId) return;

        setErrorsByProvider((prev) => ({ ...prev, [provider]: error }));
      } finally {
        if (requestIdRef.current !== requestId) return;

        setFetchingByProvider((prev) => ({ ...prev, [provider]: false }));
      }
    });
  }, [isSearchEnabled, searchKey, providersKey, triggerSearch]);

  const providerResponses = useMemo(
    () =>
      providers
        .map((provider) => resultsByProvider[provider])
        .filter(Boolean) as FlightSearchResponse[],
    [providers, resultsByProvider]
  );

  const mergedData = useMemo(() => {
    if (!providerResponses.length) return undefined;

    return {
      data: mergeFlightData(...providerResponses.map((r) => r.data)),
      filteringOptions: mergeFlightFilterOptions(
        ...providerResponses.map((r) => r.filteringOptions)
      ),
      sortingOptions:
        providerResponses.find((r) => r.sortingOptions?.length)?.sortingOptions ||
        [],
      meta: providerResponses.find((r) => r.meta)?.meta,
    };
  }, [providerResponses]);

  const isAnyProviderFetching = providers.some(
    (provider) => fetchingByProvider[provider]
  );
  const isAllProvidersFetching =
    providers.length > 0 &&
    providers.every((provider) => fetchingByProvider[provider]);

  const allProvidersFinished =
    !isProvidersLoading &&
    !isProvidersFetching &&
    providers.length > 0 &&
    providers.every((provider) => fetchingByProvider[provider] === false);

  const allProvidersFailed =
    allProvidersFinished &&
    providers.every((provider) => !!errorsByProvider[provider]) &&
    providerResponses.length === 0;

  const isAnyFetching =
    isSearchEnabled &&
    (isProvidersLoading || isProvidersFetching || isAnyProviderFetching);

  const isAllFetching =
    isSearchEnabled &&
    (isProvidersLoading ||
      isProvidersFetching ||
      isAllProvidersFetching ||
      (providers.length === 0 && (isProvidersLoading || isProvidersFetching)));

  const firstError =
    Object.values(errorsByProvider).find(Boolean) ||
    (isProvidersError ? new Error("Failed to load flight providers") : undefined);

  return {
    providers,
    mergedData,
    isAnyFetching,
    isAllFetching,
    allProvidersFinished:
      allProvidersFinished ||
      (!isProvidersLoading &&
        !isProvidersFetching &&
        providers.length === 0 &&
        isSearchEnabled),
    allProvidersFailed: allProvidersFailed || isProvidersError,
    hasAnyData: providerResponses.length > 0,
    firstError,
    errorsByProvider,
  };
}
