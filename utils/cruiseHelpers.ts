import type {
  CruiseGuestQuantity,
  CruiseItinInfo,
  CruiseRegionCode,
  CruiseSearchFormState,
  CruiseSearchRequest,
  CruiseSailingOption,
  CruiseTimelineDay,
} from "@/types/cruiseTypes";
import { getDisplayLocale } from "@/utils/formatNumber";

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

export function getDefaultCruiseMonths(fromDate = new Date()): string[] {
  const year = fromDate.getFullYear();
  const month = fromDate.getMonth() + 1;
  const first = `${year}-${pad2(month)}`;
  const nextMonthDate = new Date(year, fromDate.getMonth() + 1, 1);
  const second = `${nextMonthDate.getFullYear()}-${pad2(nextMonthDate.getMonth() + 1)}`;
  return [first, second];
}

export function getCruiseMonthYears(fromDate = new Date(), yearsAhead = 2) {
  const startYear = fromDate.getFullYear();
  return Array.from({ length: yearsAhead + 1 }, (_, i) => startYear + i);
}

export function getMonthsForYear(year: number): string[] {
  return Array.from({ length: 12 }, (_, i) => `${year}-${pad2(i + 1)}`);
}

export function isMonthSelectable(monthKey: string, fromDate = new Date()) {
  const [year, month] = monthKey.split("-").map(Number);
  const currentYear = fromDate.getFullYear();
  const currentMonth = fromDate.getMonth() + 1;
  return year > currentYear || (year === currentYear && month >= currentMonth);
}

export type CruiseMonthRange = {
  start: string | null;
  end: string | null;
};

export function getMonthRangeBounds(
  months: string[],
): CruiseMonthRange {
  if (!months.length) return { start: null, end: null };
  const sorted = [...months].sort();
  return { start: sorted[0], end: sorted[sorted.length - 1] };
}

export function expandMonthRange(start: string, end: string): string[] {
  const [startYear, startMonth] = start.split("-").map(Number);
  const [endYear, endMonth] = end.split("-").map(Number);

  const months: string[] = [];
  let year = startYear;
  let month = startMonth;

  while (year < endYear || (year === endYear && month <= endMonth)) {
    months.push(`${year}-${pad2(month)}`);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  return months;
}

export function getMonthSelectionState(
  monthKey: string,
  range: CruiseMonthRange,
): "edge" | "in-range" | "none" {
  const { start, end } = range;
  if (!start) return "none";

  if (!end) {
    return monthKey === start ? "edge" : "none";
  }

  const lo = start <= end ? start : end;
  const hi = start <= end ? end : start;

  if (monthKey === lo || monthKey === hi) return "edge";
  if (monthKey > lo && monthKey < hi) return "in-range";
  return "none";
}

export function monthsToDateRange(months: string[]): {
  startDate: string;
  endDate: string;
} | null {
  if (!months.length) return null;

  const sorted = [...months].sort();
  const [startYear, startMonth] = sorted[0].split("-").map(Number);
  const [endYear, endMonth] = sorted[sorted.length - 1].split("-").map(Number);
  const lastDay = new Date(endYear, endMonth, 0).getDate();

  return {
    startDate: `${startYear}-${pad2(startMonth)}-01`,
    endDate: `${endYear}-${pad2(endMonth)}-${pad2(lastDay)}`,
  };
}

export function buildCruiseGuests(
  form: Pick<CruiseSearchFormState, "adults" | "children" | "infants">,
): CruiseGuestQuantity[] {
  const guests: CruiseGuestQuantity[] = [];

  if (form.adults > 0) {
    guests.push({ type: "ADT", quantity: form.adults });
  }
  if (form.children > 0) {
    guests.push({ type: "CHD", quantity: form.children });
  }
  if (form.infants > 0) {
    guests.push({ type: "INF", quantity: form.infants });
  }

  return guests;
}

export function buildCruiseSearchRequest(
  form: CruiseSearchFormState,
): CruiseSearchRequest | null {
  const dateRange = monthsToDateRange(form.selectedMonths);
  if (!dateRange || form.adults < 1) return null;

  const request: CruiseSearchRequest = {
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    guests: buildCruiseGuests(form),
  };

  if (form.regionPref) {
    request.regionPref = form.regionPref as CruiseRegionCode;
  }
  if (form.portCode) {
    request.portCode = form.portCode;
  }

  return request;
}

export function parseCruiseDurationNights(duration?: string | null): number {
  if (!duration) return 0;
  const match = duration.match(/P(\d+)D/i);
  return match ? Number(match[1]) : 0;
}

export function getCruisePackageComment(
  option: CruiseSailingOption,
): string {
  const info = option.informations?.find(
    (entry) => entry.attributesMap?.name === "PKGTYPECOMMENT",
  );
  return info?.text?.textValue?.trim() || "";
}

export function getCruiseRegionCode(option: CruiseSailingOption): string {
  return option.selectedSailing?.region?.attributesMap?.regionCode || "";
}

export function isCruiseRoundTrip(option: CruiseSailingOption): boolean {
  const departure =
    option.selectedSailing?.departurePort?.attributesMap?.locationCode || "";
  const arrival =
    option.selectedSailing?.arrivalPort?.attributesMap?.locationCode || "";
  return Boolean(departure) && departure === arrival;
}

export function formatMonthLabel(
  monthKey: string,
  locale: string,
  style: "short" | "long" = "long",
): string {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  const localeTag = getDisplayLocale(locale);
  return date.toLocaleDateString(localeTag, { month: style });
}

export function formatCruiseDateRange(
  start: string,
  end: string,
  locale: string,
): string {
  const localeTag = getDisplayLocale(locale);
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  const startLabel = startDate.toLocaleDateString(localeTag, {
    day: "numeric",
    month: "long",
  });
  const endLabel = endDate.toLocaleDateString(localeTag, {
    day: "numeric",
    month: "long",
  });
  return `${startLabel} - ${endLabel}`;
}

export function formatSelectedMonthsSummary(
  months: string[],
  locale: string,
): string {
  if (!months.length) return "";
  const sorted = [...months].sort();
  const first = formatMonthLabel(sorted[0], locale, "long");
  const last = formatMonthLabel(sorted[sorted.length - 1], locale, "long");
  if (first === last) return first;
  return `${first} - ${last}`;
}

function toDateOnly(isoOrDate: string): string {
  return isoOrDate.slice(0, 10);
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(`${dateStr}T12:00:00`);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTimeFromIso(iso: string): string {
  const match = iso.match(/T(\d{2}):(\d{2})/);
  if (!match) return "";
  return `${match[1]}:${match[2]}`;
}

function getPrimaryDateTime(info: CruiseItinInfo) {
  const items = info.dateTimeDescriptions || [];
  return (
    items.find((item) => item.attributesMap?.dateTimeQualifier === "arrival") ||
    items.find((item) => item.attributesMap?.dateTimeQualifier === "departure") ||
    items.find((item) => item.attributesMap?.dateTimeQualifier === "stay") ||
    items[0]
  );
}

export function buildCruiseTimelineDays(
  infos: CruiseItinInfo[],
): CruiseTimelineDay[] {
  const byDate = new Map<string, CruiseTimelineDay>();

  for (const info of infos) {
    const primary = getPrimaryDateTime(info);
    const details = primary?.attributesMap?.dateTimeDetails;
    if (!details) continue;

    const date = toDateOnly(details);
    const portCode = info.attributesMap?.portCode || undefined;
    const portName = info.attributesMap?.portName || undefined;
    const isSeaDay = !portCode && !portName;

    const arrival = info.dateTimeDescriptions?.find(
      (item) => item.attributesMap?.dateTimeQualifier === "arrival",
    );
    const departure = info.dateTimeDescriptions?.find(
      (item) => item.attributesMap?.dateTimeQualifier === "departure",
    );

    byDate.set(date, {
      id: `${date}-${portCode || "sea"}`,
      date,
      dayOfWeek: primary?.attributesMap?.dayOfWeek || "",
      kind: isSeaDay ? "sea" : "port",
      portCode,
      portName,
      arrivalTime: arrival?.attributesMap?.dateTimeDetails
        ? formatTimeFromIso(arrival.attributesMap.dateTimeDetails)
        : undefined,
      departureTime: departure?.attributesMap?.dateTimeDetails
        ? formatTimeFromIso(departure.attributesMap.dateTimeDetails)
        : undefined,
      hasShorex: info.attributesMap?.shorexIndicator === "true",
    });
  }

  const sortedDates = [...byDate.keys()].sort();
  if (!sortedDates.length) return [];

  const timeline: CruiseTimelineDay[] = [];
  let cursor = sortedDates[0];
  const last = sortedDates[sortedDates.length - 1];

  while (cursor <= last) {
    const existing = byDate.get(cursor);
    if (existing) {
      timeline.push(existing);
    } else {
      timeline.push({
        id: `${cursor}-sea-gap`,
        date: cursor,
        dayOfWeek: "",
        kind: "sea",
      });
    }
    cursor = addDays(cursor, 1);
  }

  return timeline;
}

export function getCruiseRegionLabelKey(regionCode: string): string {
  if (regionCode === "RED") return "redSea";
  if (regionCode === "GULF") return "arabianGulf";
  if (regionCode === "MED") return "mediterranean";
  if (regionCode === "REPO") return "worldCruises";
  return "";
}

export function formatCruiseDayParts(dateStr: string, locale: string) {
  const date = new Date(`${dateStr}T12:00:00`);
  const localeTag = getDisplayLocale(locale);
  return {
    weekday: date
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase(),
    day: String(date.getDate()),
    month: date.toLocaleDateString(localeTag, { month: "long" }),
  };
}
