import type { Metadata } from "next";
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

export function buildFlightResultsMetadata(options: {
  locale: string;
  searchParams: Record<string, string | string[] | undefined>;
}): Metadata {
  const { locale, searchParams } = options;
  const isAr = locale === "ar";
  const from = pickParam(searchParams, "from").toUpperCase();
  const to = pickParam(searchParams, "to").toUpperCase();
  const departureDate = pickParam(searchParams, "departureDate");
  const returnDate = pickParam(searchParams, "returnDate");

  const dep = formatTabDate(departureDate);
  const ret = formatTabDate(returnDate);

  let title: string;
  if (from && to && dep) {
    const route = isAr ? `${from} إلى ${to}` : `${from} to ${to}`;
    const dates = ret ? `${dep} – ${ret}` : dep;
    title = `${route}, ${dates}`;
  } else if (from && to) {
    title = isAr ? `${from} إلى ${to}` : `${from} to ${to}`;
  } else {
    title = isAr ? "نتائج الطيران" : "Flight results";
  }

  const description =
    from && to
      ? isAr
        ? `قارن رحلات الطيران من ${from} إلى ${to}${dep ? ` بتاريخ ${dep}${ret ? ` – ${ret}` : ""}` : ""} واحجز مع ${SITE_NAME}.`
        : `Compare flights from ${from} to ${to}${dep ? ` on ${dep}${ret ? ` – ${ret}` : ""}` : ""} and book with ${SITE_NAME}.`
      : undefined;

  return buildPageMetadata({
    locale,
    page: "flightResults",
    path: "/flights/showfarefirst",
    title,
    description,
    indexable: false,
    keywords: [from, to, isAr ? "طيران" : "flights", SITE_NAME].filter(
      Boolean,
    ) as string[],
  });
}
