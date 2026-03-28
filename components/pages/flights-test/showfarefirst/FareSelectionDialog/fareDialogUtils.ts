import type { FlightOffer } from "@/types/fareTypes";
import type { FlightDirection } from "@/types/flightTypes";
import type { FareOption, FlightData } from "../data/flights";

export function flightDirectionToFlightData(fd: FlightDirection): FlightData {
  const first = fd.legs?.[0];
  const last = fd.legs?.[fd.legs.length - 1] ?? first;
  if (!first) {
    return {
      id: "",
      airline: "",
      airlineCode: "",
      flightNumber: "",
      cabinClass: "Economy",
      departureTime: "--:--",
      departureCode: "",
      departureAirport: "",
      arrivalTime: "--:--",
      arrivalCode: "",
      arrivalAirport: "",
      duration: "",
      stops: "",
      price: fd.minimum_package_price || 0,
      currency: "",
      fareOptions: [],
    };
  }

  const totalMinutes =
    (first.time_info?.flight_time_hour || 0) * 60 +
    (first.time_info?.flight_time_minute || 0);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const stopsCount = (fd.legs?.length || 1) - 1;
  const stopsText =
    stopsCount === 0
      ? "Nonstop"
      : stopsCount === 1
        ? "1 Stop"
        : `${stopsCount} Stops`;

  const depTime = first.departure_info?.date
    ? new Date(first.departure_info.date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "--:--";
  const arrTime = last?.arrival_info?.date
    ? new Date(last.arrival_info.date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "--:--";

  return {
    id: fd.package_info?.package_key || "",
    airline: first.airline_info?.carrier_name || "Airline",
    airlineCode: first.airline_info?.carrier_code || "",
    flightNumber: `${first.airline_info?.carrier_code || ""}${first.flight_number || ""}`,
    cabinClass: "Economy class",
    aircraftType: undefined,
    departureTime: depTime,
    departureCode: first.departure_info?.airport_code || "",
    departureAirport:
      first.departure_info?.airport_name || first.departure_info?.airport_code || "",
    arrivalTime: arrTime,
    arrivalCode: last?.arrival_info?.airport_code || "",
    arrivalAirport:
      last?.arrival_info?.airport_name || last?.arrival_info?.airport_code || "",
    duration: `${h}h ${m}m`,
    stops: stopsText,
    price: fd.minimum_package_price || 0,
    currency: "",
    fareOptions: [],
  };
}

export function formatLegDate(isoDate: string | undefined): string {
  if (!isoDate) return "";
  return new Date(isoDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Same rules as `OfferCard.getBaggageInfo`: cabin label fixed; checked = first or last `baggages_text` by leg. */
function baggageFromOffer(offer: FlightOffer, phase: "departure" | "return") {
  const DEFAULT_CABIN = "1 Bage (7 Kg)";
  const baggages = offer.baggages_text;
  const lastIdx = Math.max(0, (baggages?.length ?? 1) - 1);
  const checked =
    phase === "departure" ? baggages?.[0] : baggages?.[lastIdx];
  return {
    personalItem: true,
    carryOn: DEFAULT_CABIN,
    checked: (checked || false) as string | false,
  };
}

export function flightOfferToFareOption(
  offer: FlightOffer,
  index: number,
  phase: "departure" | "return",
): FareOption {
  const currency = offer.currency_code || "";
  /** Departure: minimum segment price. Return: add-on (total - min). */
  const price =
    phase === "departure"
      ? offer.minimum_offer_price ?? offer.total_price
      : Math.max(
          0,
          (offer.total_price ?? 0) - (offer.minimum_offer_price ?? 0),
        );

  const lastDet = offer.offer_details?.length
    ? offer.offer_details[offer.offer_details.length - 1]
    : undefined;

  const pkgName =
    phase === "departure"
      ? offer.offer_details?.[0]?.name ||
        offer.offer_details?.[0]?.descriptions?.[0] ||
        offer.fare_type
      : lastDet?.name ||
        lastDet?.descriptions?.[0] ||
        offer.fare_type;

  /**
   * Use the package name as id (same as old OfferSelection logic):
   * - departure → offer_details[0].name
   * - return    → offer_details[last].name
   * This ensures grouping: all return offers with the same last-name map to one id.
   */
  const id =
    phase === "departure"
      ? offer.offer_details?.[0]?.name || offer.offer_key || `offer-${index}`
      : lastDet?.name || offer.offer_key || `offer-${index}`;

  const baggage = baggageFromOffer(offer, phase);

  const changeHint =
    offer.change_rules?.[0]?.before_departure_status ||
    (offer.non_refundable ? false : "Fees may apply");

  return {
    id,
    cabinClass: offer.booking_classes?.[0]?.class_code || "Economy",
    fareType: pkgName || offer.fare_type || "Fare",
    baggage,
    flexibility: {
      refundable: !offer.non_refundable,
      changeFee: changeHint || false,
    },
    otherBenefits: [
      ...(offer.offer_details ?? []).flatMap((d) => d.descriptions || []),
      ...(offer.baggages_text || []).filter(Boolean),
    ].slice(0, 6),
    price,
    currency,
    priceSuffix: phase === "return" ? "+" : undefined,
  };
}

/** Default / fare-detail-only API path — same card shape as slider offers. */
export function buildDefaultFareCardOption(input: {
  id: string;
  cabinClass: string;
  fareType?: string;
  cabinCarry: string | false;
  checked: string | false;
  price: number;
}): FareOption {
  return {
    id: input.id,
    cabinClass: input.cabinClass,
    fareType: input.fareType ?? "",
    baggage: {
      personalItem: true,
      carryOn: input.cabinCarry,
      checked: input.checked,
    },
    flexibility: { refundable: false, changeFee: false },
    price: input.price,
    currency: "",
  };
}

export function buildDefaultFareOption(params: {
  currency: string;
  totalFare: number;
  baggagesText?: string[];
  cabinBaggagesText?: string[];
}): FareOption {
  const DEFAULT_CABIN = "1 Bage (7 Kg)";
  const cabin = params.cabinBaggagesText?.[0];
  const checked = params.baggagesText?.[0];
  return {
    id: "default",
    cabinClass: "Economy",
    fareType: "Standard fare",
    baggage: {
      personalItem: true,
      carryOn: cabin || DEFAULT_CABIN,
      checked: checked || false,
    },
    flexibility: {
      refundable: false,
      changeFee: false,
    },
    price: params.totalFare,
    currency: params.currency,
  };
}
