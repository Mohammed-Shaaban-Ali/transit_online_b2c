export type TripType = "roundTrip" | "oneWay" | "multiCity";
export type CabinClass = "Economy" | "Business";

export interface FlightSearchFormValues {
  fromAirport: string;
  toAirport: string;
  departureDate: string;
  returnDate?: string;
  tripType: "roundTrip" | "oneWay";
  nonstop: boolean;
  adults: number;
  children: number;
  infants: number;
  cabinClass: "ECONOMY" | "BUSINESS";
}
