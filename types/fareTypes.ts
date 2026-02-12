interface PriceInfo {
  total_fare: number;
  base_fare: number;
  service_fee: number;
  agency_commission: number;
  tax: number;
  supplement: number;
}

interface BaggageAllowance {
  amount: number;
  type: string;
  alternative_type: string;
  class_code: string;
  departure_airport: string;
  arrival_airport: string;
  carrier: string;
  flight_number: string;
}

interface PaxFare {
  currency_code: string;
  price_info: PriceInfo;
  pax_type: string;
  number_of_pax: number;
  baggage_allowances: BaggageAllowance[];
  cabin_baggage_allowances: BaggageAllowance[];
}

interface FareDetail {
  currency_code: string;
  price_info: PriceInfo;
  pax_fares: PaxFare[];
}

interface OfferDetail {
  name: string;
  descriptions: string[];
}

interface OfferLeg {
  from: string;
  to: string;
  departure_time: string;
  arrival_time: string;
  flight_number: string;
  flight_class: string;
  operator_airline_code: string;
  marketing_airline_code: string;
}

export interface Service {
  service_id: string;
  service_type: string;
  description: string;
  chargeable_type: string;
  offer_legs: OfferLeg[];
  supplier_code: string;
}

interface ChangeRule {
  type: string;
  before_departure_status: string;
  after_departure_status: string;
}

interface BookingClass {
  departure_airport: string;
  arrival_airport: string;
  carrier: string;
  flight_number: string;
  class_code: string;
}

export interface FlightOffer {
  offer_key: string;
  offer_details: OfferDetail[];
  fares: PaxFare[];
  services: Service[];
  total_price: number;
  currency_code: string;
  fare_type: string;
  non_refundable: boolean;
  can_book: boolean;
  can_rezerve: boolean;
  last_ticket_date: string;
  change_rules: ChangeRule[];
  offer_type: string;
  default_offer: boolean;
  booking_classes: BookingClass[];
  baggages_text: string[];
  cabin_baggages_text: string[];
  minimum_offer_price: number;
}

interface FlightInfo {
  from: string;
  to: string;
  departure_time: string;
  arrival_time: string;
  flight_number: string;
  operator_airline_code: string;
  marketing_airline_code: string;
  class_code: string;
  cabin_type: string;
}

interface SelectedFlight {
  flight: FlightInfo;
}

interface SimplifiedPriceInfo {
  total_fare: number;
}

interface SimplifiedFareDetail {
  currency_code: string;
  price_info: SimplifiedPriceInfo;
}

interface PackageInfo {
  packaged: boolean;
  package_key: string;
  is_return: boolean;
}

interface AirportInfo {
  airport_code: string;
  date: string;
  airport_name: string;
  city_name: string;
}

interface TimeInfo {
  leg_duration_time_minute: number;
  wait_time_in_minute_before_next_leg: number;
  flight_time_hour: number;
  flight_time_minute: number;
  layover_time_in_minutes: number;
  day_cross: boolean;
}

interface AirlineInfo {
  carrier_code: string;
  carrier_name: string;
  operator_code: string;
  operator_name: string;
  validating_carrier_code: string;
  operating_airline_code: string;
  logo: string;
}

interface FlightLeg {
  flight_number: string;
  departure_info: AirportInfo;
  arrival_info: AirportInfo;
  time_info: TimeInfo;
  airline_info: AirlineInfo;
}

interface FareInfo {
  class_codes: string[];
  cabin_types: string[];
  fare_detail: SimplifiedFareDetail;
  free_seats: number;
}

interface Fare {
  fare_key: string;
  fare_info: FareInfo;
}

export interface FlightPackage {
  endpoint: string;
  provider_key: string;
  package_info: PackageInfo;
  legs: FlightLeg[];
  fares: Fare[];
  minimum_package_price: number;
  cabin_baggages_available: boolean;
  cabin_baggages_text: string;
  baggages_available: boolean;
  baggages_text: string;
  minimum_package_points: number;
  points: number;
}

interface ResponseFareDetail {
  currency_code: string;
  price_info: SimplifiedPriceInfo;
  baggages_text: string[];
  cabin_baggages_text: string[];
}

export interface FlightFareResponse {
  success: boolean;
  message: string;
  data: {
    fare_detail: ResponseFareDetail;
    offers: FlightOffer[];
    departure_selected_flights: SelectedFlight[];
    departure_flight: FlightPackage;
    return_selected_flight: SelectedFlight[];
    return_flight: FlightPackage;
  };
}
