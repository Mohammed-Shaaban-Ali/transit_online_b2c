import { formatDateToString } from "@/utils/formatDateToString";

type FlightSearchUrlParams = {
  fromAirport: string;
  toAirport: string;
  departureDate: string;
  returnDate?: string;
  tripType?: "roundTrip" | "oneWay";
  nonstop?: boolean;
  adults?: number;
  children?: number;
  infants?: number;
  cabinClass?: "ECONOMY" | "BUSINESS";
  submitPath?: string;
};

export function buildFlightSearchUrl({
  fromAirport,
  toAirport,
  departureDate,
  returnDate,
  tripType = "roundTrip",
  nonstop = true,
  adults = 1,
  children = 0,
  infants = 0,
  cabinClass = "ECONOMY",
  submitPath = "/flights/showfarefirst",
}: FlightSearchUrlParams): string {
  const params = new URLSearchParams();
  params.set("from", fromAirport);
  params.set("to", toAirport);
  params.set("tripType", tripType);
  params.set("nonstop", String(nonstop));
  params.set("departureDate", formatDateToString(departureDate));
  if (returnDate && tripType === "roundTrip") {
    params.set("returnDate", formatDateToString(returnDate));
  }
  params.set("adults", String(adults));
  if (children > 0) {
    params.set("children", String(children));
  }
  if (infants > 0) {
    params.set("infants", String(infants));
  }
  params.set("cabinClass", cabinClass);
  return `${submitPath}?${params.toString()}`;
}
