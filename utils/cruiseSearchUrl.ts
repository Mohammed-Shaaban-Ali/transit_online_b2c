import type {
  CruiseRegionCode,
  CruiseSearchFormState,
} from "@/types/cruiseTypes";
import {
  buildCruiseSearchRequest,
  monthsToDateRange,
} from "@/utils/cruiseHelpers";

const REGION_CODES: CruiseRegionCode[] = ["RED", "GULF", "MED", "REPO"];

export function buildCruiseSearchParams(
  form: CruiseSearchFormState,
): URLSearchParams {
  const params = new URLSearchParams();

  if (form.selectedMonths.length) {
    params.set("months", [...form.selectedMonths].sort().join(","));
  }
  params.set("adults", String(form.adults));
  if (form.children > 0) params.set("children", String(form.children));
  if (form.infants > 0) params.set("infants", String(form.infants));
  if (form.regionPref) params.set("regionPref", form.regionPref);
  if (form.portCode) params.set("portCode", form.portCode);

  return params;
}

export function getCruiseSearchParamsFromUrl(
  searchParams: URLSearchParams,
): Partial<CruiseSearchFormState> | undefined {
  const monthsParam = searchParams.get("months")?.trim();
  if (!monthsParam) return undefined;

  const selectedMonths = monthsParam
    .split(",")
    .map((value) => value.trim())
    .filter((value) => /^\d{4}-\d{2}$/.test(value));

  if (!selectedMonths.length || !monthsToDateRange(selectedMonths)) {
    return undefined;
  }

  const adults = Math.max(1, Number(searchParams.get("adults") || 1));
  const children = Math.max(0, Number(searchParams.get("children") || 0));
  const infants = Math.max(0, Number(searchParams.get("infants") || 0));

  const regionParam = searchParams.get("regionPref")?.trim() || "";
  const regionPref = REGION_CODES.includes(regionParam as CruiseRegionCode)
    ? (regionParam as CruiseRegionCode)
    : "";

  const portCode = searchParams.get("portCode")?.trim() || "";

  return {
    selectedMonths: [...selectedMonths].sort(),
    adults,
    children,
    infants,
    regionPref,
    portCode,
  };
}

export function hasValidCruiseSearchParams(
  searchParams: URLSearchParams,
): boolean {
  const form = getCruiseSearchParamsFromUrl(searchParams);
  if (!form) return false;
  return buildCruiseSearchRequest({
    regionPref: form.regionPref || "",
    portCode: form.portCode || "",
    selectedMonths: form.selectedMonths || [],
    adults: form.adults || 1,
    children: form.children || 0,
    infants: form.infants || 0,
  }) !== null;
}
