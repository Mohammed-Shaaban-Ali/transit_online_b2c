import { baseApi, SuccessResponse } from "@/redux/app/baseApi";
import { FlightFareResponse } from "@/types/fareTypes";
import { FlightBookingTypes, FlightSearchResponse } from "@/types/flightTypes";

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
      FlightBookingTypes
    >({
      query: (data) => ({
        url: `/api/iati/book`,
        method: "POST",
        body: data,
      }),
    }),
    getFlightBooking: builder.query<
      SuccessResponse<FlightBookingTypes>,
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

export const {
  useSearchFlightsIatiQuery,
  useSearchFlightsSabreQuery,
  useLazySearchFlightsIatiQuery,
  useLazySearchFlightsSabreQuery,
  useGetFlightFareMutation,
  useBookFlightMutation,
  useGetFlightBookingQuery,
} = flightsApi;
