import type { Metadata } from "next";
import type { FlightDirection } from "@/types/flightTypes";
import { buildPageMetadata } from "./buildPageMetadata";
import { SITE_NAME } from "./pages";

function pickParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string {
  const value = params[key];
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

/** Booking-style short date: 11/5 */
function formatTabDate(value: string): string {
  if (!value) return "";
  const dateOnly = value.trim().slice(0, 10);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateOnly);
  if (match) {
    const month = Number(match[2]);
    const day = Number(match[3]);
    return `${month}/${day}`;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return `${parsed.getMonth() + 1}/${parsed.getDate()}`;
}

function toDateParam(value?: string | null): string {
  if (!value) return "";
  return value.trim().slice(0, 10);
}

export type FlightRouteSeoParams = {
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
};

export function readFlightRouteFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): FlightRouteSeoParams {
  return {
    from: pickParam(searchParams, "from").toUpperCase(),
    to: pickParam(searchParams, "to").toUpperCase(),
    departureDate: pickParam(searchParams, "departureDate"),
    returnDate: pickParam(searchParams, "returnDate"),
  };
}

/** Build route SEO fields from selected flight directions. */
export function flightRouteSeoFromFlights(
  departure?: FlightDirection | null,
  returnFlight?: FlightDirection | null,
): FlightRouteSeoParams {
  const firstLeg = departure?.legs?.[0];
  const lastOutbound =
    departure?.legs?.[departure.legs.length - 1] ?? firstLeg;
  const returnFirst = returnFlight?.legs?.[0];

  return {
    from: (firstLeg?.departure_info?.airport_code || "").toUpperCase(),
    to: (lastOutbound?.arrival_info?.airport_code || "").toUpperCase(),
    departureDate: toDateParam(firstLeg?.departure_info?.date),
    returnDate: toDateParam(returnFirst?.departure_info?.date),
  };
}

/** Query string for booking URL so generateMetadata can read the route. */
export function buildFlightBookingQuery(
  route: FlightRouteSeoParams,
): string {
  const params = new URLSearchParams();
  if (route.from) params.set("from", route.from);
  if (route.to) params.set("to", route.to);
  if (route.departureDate) params.set("departureDate", route.departureDate);
  if (route.returnDate) params.set("returnDate", route.returnDate);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function buildFlightRouteTitle(options: {
  locale: string;
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
  prefix?: string;
  fallback: string;
}): string {
  const { locale, from, to, departureDate, returnDate, prefix, fallback } =
    options;
  const isAr = locale === "ar";
  const dep = formatTabDate(departureDate);
  const ret = formatTabDate(returnDate);

  let core: string;
  if (from && to && dep) {
    const route = isAr ? `${from} إلى ${to}` : `${from} to ${to}`;
    const dates = ret ? `${dep} – ${ret}` : dep;
    core = `${route}, ${dates}`;
  } else if (from && to) {
    core = isAr ? `${from} إلى ${to}` : `${from} to ${to}`;
  } else {
    return fallback;
  }

  return prefix ? `${prefix} ${core}` : core;
}

function buildFlightRouteDescription(options: {
  locale: string;
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
  booking?: boolean;
}): string | undefined {
  const { locale, from, to, departureDate, returnDate, booking } = options;
  if (!from || !to) return undefined;

  const isAr = locale === "ar";
  const dep = formatTabDate(departureDate);
  const ret = formatTabDate(returnDate);
  const datePart = dep ? (isAr ? ` بتاريخ ${dep}${ret ? ` – ${ret}` : ""}` : ` on ${dep}${ret ? ` – ${ret}` : ""}`) : "";

  if (booking) {
    return isAr
      ? `أكمل حجز رحلتك من ${from} إلى ${to}${datePart} مع ${SITE_NAME}.`
      : `Complete your flight booking from ${from} to ${to}${datePart} with ${SITE_NAME}.`;
  }

  return isAr
    ? `قارن رحلات الطيران من ${from} إلى ${to}${datePart} واحجز مع ${SITE_NAME}.`
    : `Compare flights from ${from} to ${to}${datePart} and book with ${SITE_NAME}.`;
}

export function buildFlightResultsMetadata(options: {
  locale: string;
  searchParams: Record<string, string | string[] | undefined>;
}): Metadata {
  const { locale, searchParams } = options;
  const isAr = locale === "ar";
  const route = readFlightRouteFromSearchParams(searchParams);

  const title = buildFlightRouteTitle({
    locale,
    ...route,
    fallback: isAr ? "نتائج الطيران" : "Flight results",
  });

  return buildPageMetadata({
    locale,
    page: "flightResults",
    path: "/flights/showfarefirst",
    title,
    description: buildFlightRouteDescription({
      locale,
      ...route,
    }),
    indexable: false,
    keywords: [route.from, route.to, isAr ? "طيران" : "flights", SITE_NAME].filter(
      Boolean,
    ) as string[],
  });
}

export type FlightBookingOutcome = "booking" | "success" | "failed";

const BOOKING_OUTCOME_PATH: Record<FlightBookingOutcome, string> = {
  booking: "/flights/showfarefirst/booking",
  success: "/flights/showfarefirst/booking/success",
  failed: "/flights/showfarefirst/booking/failed",
};

function bookingOutcomeCopy(
  locale: string,
  outcome: FlightBookingOutcome,
): { prefix: string; fallback: string; keyword: string } {
  const isAr = locale === "ar";
  if (outcome === "success") {
    return {
      prefix: isAr ? "تم الحجز" : "Booking confirmed",
      fallback: isAr ? "تم حجز الطيران" : "Flight booking confirmed",
      keyword: isAr ? "تأكيد حجز طيران" : "flight booking confirmed",
    };
  }
  if (outcome === "failed") {
    return {
      prefix: isAr ? "فشل الحجز" : "Booking failed",
      fallback: isAr ? "فشل حجز الطيران" : "Flight booking failed",
      keyword: isAr ? "فشل حجز طيران" : "flight booking failed",
    };
  }
  return {
    prefix: isAr ? "حجز" : "Book",
    fallback: isAr ? "حجز الطيران" : "Flight Booking",
    keyword: isAr ? "حجز طيران" : "flight booking",
  };
}

/** Browser tab / metadata title including site name. */
export function getFlightDocumentTitle(options: {
  locale: string;
  route: FlightRouteSeoParams;
  outcome?: FlightBookingOutcome;
}): string {
  const outcome = options.outcome ?? "booking";
  const copy = bookingOutcomeCopy(options.locale, outcome);
  const pageTitle = buildFlightRouteTitle({
    locale: options.locale,
    ...options.route,
    prefix: copy.prefix,
    fallback: copy.fallback,
  });
  return `${SITE_NAME} | ${pageTitle}`;
}

export function buildFlightBookingMetadata(options: {
  locale: string;
  searchParams: Record<string, string | string[] | undefined>;
  outcome?: FlightBookingOutcome;
}): Metadata {
  const { locale, searchParams } = options;
  const outcome = options.outcome ?? "booking";
  const isAr = locale === "ar";
  const route = readFlightRouteFromSearchParams(searchParams);
  const copy = bookingOutcomeCopy(locale, outcome);

  const title = buildFlightRouteTitle({
    locale,
    ...route,
    prefix: copy.prefix,
    fallback: copy.fallback,
  });

  return buildPageMetadata({
    locale,
    page: "flightBooking",
    path: BOOKING_OUTCOME_PATH[outcome],
    title,
    description: buildFlightRouteDescription({
      locale,
      ...route,
      booking: true,
    }),
    indexable: false,
    keywords: [route.from, route.to, copy.keyword, SITE_NAME].filter(
      Boolean,
    ) as string[],
  });
}
