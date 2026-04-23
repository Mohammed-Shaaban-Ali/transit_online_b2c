import { baseApi, baseApi2, SuccessResponse } from "@/redux/app/baseApi";
import { FlightFareResponse } from "@/types/fareTypes";
import { FlightSearchResponse } from "@/types/flightTypes";

export interface FlightSearchParams {
  fromAirport: string;
  toAirport: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: string;
}

interface FlightFareRequest {
  departureFareKey: string;
  returnFareKey?: string;
  adults: number;
  children: number;
  infants: number;
  provider?: "iati" | "sabre";
}

export interface LoyaltyPriceBreakdownItem {
  value: number;
  label: string;
  type: "PAYMENT" | "COUPON" | string;
}

export interface LoyaltyCalculatePriceResponse {
  success: boolean;
  message: string | null;
  data: {
    total: {
      value: number;
      label: string;
    };
    payments: LoyaltyPriceBreakdownItem[];
    coupon_code: string | null;
    coupon_error_message: string | null;
    available_points: number;
    points: number;
    remaining_points: number;
    enough_points: boolean;
    usePoints: boolean;
    currency: string;
    payment_gateways: string[];
  };
}

interface LoyaltyCalculatePriceRequest {
  originalPrice: number;
  module: "flights";
  points: boolean;
  provider: string;
  carrierAirlineCode: string;
  operatorAirlineCode: string;
  returnProvider?: string;
  returnCarrierAirlineCode?: string;
  returnOperatorAirlineCode?: string;
}

interface FlightBookRequest {
  paymentGateway: string;
  couponCode?: string;
  departureFareKey: string;
  returnFareKey?: string;
  offer?: string;
  contact_info: {
    name: string;
    email: string;
    phone: string;
    country_code: string;
  };
  paxList: Array<{
    name: string;
    lastName: string;
    birthDate: string;
    type: string;
    gender: string;
    identityInfo: {
      passport: {
        citizenshipCountry: string;
        endDate: string;
        no: string;
      };
    };
  }>;
}

const flightsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchFlightsIati: builder.query<FlightSearchResponse, FlightSearchParams>({
      query: (data) => ({
        url: `/api/iati/search`,
        method: "POST",
        body: data,
      }),
      keepUnusedDataFor: 0, // Disable caching
      //providesTags: ["locale"],
    }),
    searchFlightsSabre: builder.query<FlightSearchResponse, FlightSearchParams>(
      {
        query: (data) => ({
          url: `/api/sabre/search`,
          method: "POST",
          body: data,
        }),
        keepUnusedDataFor: 0, // Disable caching
        //providesTags: ["locale"],
      }
    ),
    getFlightFare: builder.mutation<FlightFareResponse, FlightFareRequest>({
      query: (data) => {
        const provider = data.provider || "iati";
        return {
          url: `/api/${provider}/fare`,
          method: "POST",
          body: {
            departureFareKey: data.departureFareKey,
            returnFareKey: data.returnFareKey,
            adults: data.adults,
            children: data.children,
            infants: data.infants,
          },
        };
      },
    }),

    bookFlight: builder.mutation<
      {
        success: boolean;
        message: string;
        bookingId: number;
        redirectUrl: string;
      },
      FlightBookRequest
    >({
      query: (data) => ({
        url: `/api/iati/book`,
        method: "POST",
        body: data,
      }),
    }),
    getFlightBooking: builder.query<
      SuccessResponse<any>,
      string
    >({
      query: (bookingId) => ({
        url: `/api/iati/bookings/${bookingId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0, // Disable caching
      //providesTags: ["locale"],
    }),


  }),
});



const flightsApi2 = baseApi2.injectEndpoints({
  endpoints: (builder) => ({

    calculateFlightPrice: builder.query<
      LoyaltyCalculatePriceResponse,
      LoyaltyCalculatePriceRequest
    >({
      query: (params) => ({
        url: "/api/loyalty/calculate-price",
        method: "GET",
        params,
      }),
      keepUnusedDataFor: 0,
    }),


  }),
});

export const {

  useLazyCalculateFlightPriceQuery,

} = flightsApi2;

export const {
  useSearchFlightsIatiQuery,
  useSearchFlightsSabreQuery,
  useLazySearchFlightsIatiQuery,
  useLazySearchFlightsSabreQuery,
  useGetFlightFareMutation,
  useBookFlightMutation,
  useGetFlightBookingQuery,
  useLazyGetFlightBookingQuery,
} = flightsApi;
