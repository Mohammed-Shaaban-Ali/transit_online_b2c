export interface AppBookingsResponse {
  success: boolean;
  data: AppBookingsData;
}

export interface AppBookingsData {
  hotels: AppHotelBooking[];
  flights: AppFlightBooking[];
  cruises: AppCruiseBooking[];
  visas: AppVisaBooking[];
  licenses: AppLicenseBooking[];
  packages: AppPackageBooking[];
  packageFlights: AppPackageFlightBooking[];
}

export interface AppHotelBooking {
  id: number;
  hotel_id: number;
  hotel_name: string;
  hotel_name_en?: string;
  hotel_name_ar?: string;
  amount: number;
  coupon_code: string | null;
  amount_to_pay: number;
  currency: string;
  status: string;
  booking_status?: string;
  confirmation_number?: string | null;
  finished: boolean;
  payment_id?: number;
  payment_status?: string;
  adults: number;
  children: number;
  customer_name: string;
  customer_email: string;
  customer_mobile: string;
  user?: { name?: string | null } | null;
  failure_reason: string | null;
  provider_reference?: string;
  passengers?: Array<{ title?: string; firstName?: string; lastName?: string }>;
  hotel_content?: {
    address?: string;
    starRating?: number;
    images?: string[];
  };
  search_data?: { checkIn?: string; checkOut?: string };
  package?: {
    roomName?: string;
    boardName?: string;
    nights?: number;
    rooms?: Array<{ roomName?: string; descriptions?: string[] }>;
  };
  booking?: { confirmationNumber?: string };
  voucher?: string;
  created_at?: string;
  createdAt?: string;
}

export interface AppFlightBooking {
  id: number;
  confirmation_number?: string | null;
  booking_number: string;
  booking_reference?: string;
  status: string;
  booking_status?: string;
  finished: boolean;
  created_at?: string;
  createdAt?: string;
  offer_details?: {
    departure_flight?: {
      legs?: Array<{
        departure_info?: {
          airport_code?: string;
          airport_name?: string;
          city_name?: string;
          date?: string;
        };
        arrival_info?: {
          airport_code?: string;
          airport_name?: string;
          city_name?: string;
          date?: string;
        };
        airline_info?: {
          carrier_code?: string;
          carrier_name?: string;
          name?: string;
        };
        flight_number?: string;
      }>;
    };
    fare_detail?: {
      currency_code?: string;
      price_info?: { total_fare?: number };
    };
  };
  fromLocation?: string;
  toLocation?: string;
  passengers?: Array<{
    type?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
  }>;
  price?: number;
  original_price?: number;
  currency?: string;
  coupon_code?: string | null;
  voucher?: string;
}

export interface AppCruiseBooking {
  id: number;
  confirmation_number?: string | null;
  name: string;
  phone: string;
  email: string;
  couponCode: string | null;
  currency: string;
  finalPrice: number;
  status: string;
  voyageId: string;
  reservationId: string;
  voyageData?: {
    sailingInfo?: {
      selectedSailing?: {
        attributesMap?: {
          voyageId?: string;
          start?: string;
          end?: string;
          duration?: string;
          shipName?: string;
        };
      };
    };
  };
  cabinData?: {
    cabins?: Array<{ category?: string; number?: string }>;
    guests?: Array<{ firstName?: string; lastName?: string }>;
  };
  bookingData?: { confirmationNumber?: string };
  payment?: { status?: string };
  voucher?: string;
  created_at?: string;
  createdAt?: string;
}

export interface AppVisaBooking {
  id?: number;
  confirmation_number?: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  coupon_code: string | null;
  currency: string;
  original_price: number;
  final_price: number;
  payment_status: string;
  status: string;
  date: string;
  created_at?: string;
  createdAt?: string;
  applicants?: Array<{ name?: string }>;
  voucher?: string;
}

export interface AppLicenseBooking {
  id?: number;
  confirmation_number?: string | null;
  name: string;
  email: string;
  address: string;
  phone: string;
  coupon_code: string | null;
  currency: string;
  original_price: number;
  final_price: number;
  payment_id?: number;
  status: string;
  progress?: string;
  failure_reason: string | null;
  date: string;
  created_at?: string;
  createdAt?: string;
  voucher?: string;
}

export interface AppPackageBooking {
  reference: string;
  confirmation_number?: string | null;
  created_at?: string;
  createdAt?: string;
  booking_data: {
    id: number;
    reference: string;
    confirmation_number?: string | null;
    status: string;
    currency: string;
    final_price: number;
    coupon_code: string | null;
    adults: number;
    children: number;
    infants: number;
    finished: boolean;
    created_at?: string;
    createdAt?: string;
  };
  package: {
    Id?: number;
    Name?: string;
    Description?: string;
    Image?: string;
    FromCity?: string;
    ToCity?: string;
    Days?: number;
    Hotel?: {
      DisplayName?: string;
      StarRating?: number;
    };
  };
  flights?: Array<{
    flight_type?: string;
    date?: string;
    airport_code?: string;
    destination_airport_code?: string;
    airline_name?: string;
    airline_logo?: string;
    flight_number?: string;
    departure_time?: string;
    arrival_time?: string;
  }>;
  passengers?: Array<{
    first_name?: string;
    last_name?: string;
  }>;
  status: string;
  voucher?: string;
}

export interface AppPackageFlightBooking {
  id: number;
  reference: string;
  confirmation_number?: string | null;
  status: string;
  currency: string;
  class?: string;
  original_price: number;
  final_price: number;
  coupon_code: string | null;
  adults: number;
  children: number;
  infants: number;
  created_at?: string;
  createdAt?: string;
  flights?: Array<{
    flight_type?: string;
    date?: string;
    airport_code?: string;
    destination_airport_code?: string;
    airline_name?: string;
    airline_logo?: string;
    flight_number?: string;
    departure_time?: string;
    arrival_time?: string;
  }>;
  passengers?: Array<{
    first_name?: string;
    last_name?: string;
  }>;
  voucher?: string;
}
