interface AirportInfo {
  airport_code: string;
  date: string;
  airport_name: string;
  city_name: string;
  terminal_no?: string;
}

interface TimeInfo {
  number_of_stops?: string;
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
  logo?: string;
}

interface BaggageInfo {
  amount: number;
  type: string;
  alternative_type: string;
  class_code: string;
  passenger_type: string;
}

interface BaggageAllowance extends BaggageInfo {
  departure_airport: string;
  arrival_airport: string;
  carrier: string;
  flight_number: string;
}

export interface Leg {
  flight_number: string;
  aircraft?: string;
  departure_info: AirportInfo;
  arrival_info: AirportInfo;
  time_info: TimeInfo;
  airline_info: AirlineInfo;
  baggages?: BaggageInfo[];
  cabin_baggages?: BaggageInfo[];
}

interface PriceInfo {
  total_fare: number;
  base_fare: number;
  service_fee: number;
  agency_commission: number;
  tax: number;
  supplement: number;
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

interface FareInfo {
  class_codes: string[];
  cabin_types: string[];
  fare_detail: FareDetail;
  free_seats: number;
}

interface DefaultOffer {
  name: string;
  descriptions: string[];
}

interface Fare {
  fare_key: string;
  fare_info: FareInfo;
  default_offer: DefaultOffer;
}

interface PackageInfo {
  packaged: boolean;
  package_key: string;
}

interface Office {
  office_id: number;
  office_name: string;
}

export interface FlightDirection {
  provider_key: string;
  endpoint?: "sabre" | "iati";
  package_info: PackageInfo;
  legs: Leg[];
  fares: Fare[];
  office: Office;
  book_type: string;
  charter: boolean;

  minimum_package_price: number;
  cabin_baggages_text: string;
  cabin_baggages_available: boolean;
  baggages_available: boolean;
  baggages_text: string;
  minimum_package_points: number;
  points: number;
}

export interface FlightFilteringOptions {
  minPrice: number;
  maxPrice: number;
  airline: {
    id?: string;
    count?: string;
    text?: string;
  }[];
  stops: {
    id: number;
    text: string;
    count: number;
  }[];
  provider: {
    id: string;
    text: string;
    count: number;
  }[];
}

export interface flightTypes {
  departure_flights: FlightDirection[];
  return_flights: FlightDirection[];
}

export interface FlightSearchResponse {
  data: flightTypes;
  filteringOptions: FlightFilteringOptions;
  sortingOptions: {
    id: "price" | "duration";
    text: string;
  }[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
export interface FlightBookingTypes {
  id: number;
  traceUuid: string | null;
  auth_user_id: number;
  airline_booking_reference: string | null;
  book_id: string | null;
  booking_number: string;
  booking_reference: string | null;
  flight_mapping: string;
  search: any;
  offer_details: {
    office: {
      office_id: number;
      office_name: string;
    };
    fare_detail: {
      pax_fares: Array<{
        pax_type: string;
        price_info: {
          tax: number;
          base_fare: number;
          supplement: number;
          total_fare: number;
          service_fee: number;
          agency_commission: number;
        };
        currency_code: string;
        number_of_pax: number;
        baggage_allowances: Array<{
          type: string;
          amount: number;
          carrier: string;
          class_code: string;
          flight_number: string;
          arrival_airport: string;
          alternative_type: string;
          departure_airport: string;
        }>;
        cabin_baggage_allowances: Array<{
          type: string;
          amount: number;
          carrier: string;
          class_code: string;
          flight_number: string;
          arrival_airport: string;
          alternative_type: string;
          departure_airport: string;
        }>;
      }>;
      price_info: {
        tax: number;
        base_fare: number;
        supplement: number;
        total_fare: number;
        service_fee: number;
        agency_commission: number;
      };
      currency_code: string;
    };
    multiprovider: boolean;
    fare_detail_key: string;
    flight_informations: Array<{
      provider_key: string;
      pnr_requirements: string[];
      permitted_actions: string[];
    }>;
    return_selected_flight: Array<{
      flight: {
        to: string;
        from: string;
        cabin_type: string;
        class_code: string;
        arrival_time: string;
        flight_number: string;
        departure_time: string;
        operator_airline_code: string;
        marketing_airline_code: string;
      };
    }>;
    departure_selected_flights: Array<{
      flight: {
        to: string;
        from: string;
        cabin_type: string;
        class_code: string;
        arrival_time: string;
        flight_number: string;
        departure_time: string;
        operator_airline_code: string;
        marketing_airline_code: string;
      };
    }>;
  };
  fromLocation: string;
  toLocation: string;
  departureSegments: any;
  returnSegment: any;
  multiSegments: any;
  travellers: any;
  passengers: Array<{
    name: string;
    type: string;
    gender: string;
    lastName: string;
    birthDate: string;
    identityInfo: {
      passport: {
        no: string;
        endDate: string;
        citizenshipCountry: string;
      };
      notTurkishCitizen: boolean;
      notPakistanCitizen: boolean;
    };
  }>;
  api: any;
  adult: number;
  child: number;
  infant: number;
  departure: string;
  return_date: string;
  type: string;
  markup: any;
  stops: any;
  airline: any;
  currency: string;
  original_price: string;
  price: string;
  coupon_code: string | null;
  payment_id: number;
  discount: any;
  cabin_class: string;
  pricing: any;
  contact_info: {
    name: string;
    email: string;
    phone: string;
    country_code: string;
  };
  booking_data: any;
  extra: any;
  tickets: any;
  refund: any;
  status: string;
  failure_reason: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  company_id: number | null;
}
