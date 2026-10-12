import { baseApi, baseApi2 } from "@/redux/app/baseApi";
import type { LoyaltyCalculatePriceResponse } from "@/redux/features/flights/flightsApi";
import type {
  CruiseBookingDetailsResponse,
  CruiseBookRequest,
  CruiseBookResponse,
  CruiseCabinsMultipleRequest,
  CruiseCabinsMultipleResponse,
  CruiseCategoriesRequest,
  CruiseCategoriesResponse,
  CruiseItineraryRequest,
  CruiseItineraryResponse,
  CruiseSearchRequest,
  CruiseSearchResponse,
} from "@/types/cruiseTypes";

const cruisesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchCruises: builder.mutation<CruiseSearchResponse, CruiseSearchRequest>({
      query: (body) => ({
        url: "/api/cruises/aroya/search",
        method: "POST",
        body,
      }),
    }),
    getCruiseItinerary: builder.mutation<
      CruiseItineraryResponse,
      CruiseItineraryRequest
    >({
      query: (body) => ({
        url: "/api/cruises/aroya/itinerary",
        method: "POST",
        body,
      }),
    }),
    getCruiseCategoriesMultiple: builder.mutation<
      CruiseCategoriesResponse,
      CruiseCategoriesRequest
    >({
      query: (body) => ({
        url: "/api/cruises/aroya/categories-multiple",
        method: "POST",
        body,
      }),
    }),
    getCruiseCabinsMultiple: builder.mutation<
      CruiseCabinsMultipleResponse,
      CruiseCabinsMultipleRequest
    >({
      query: (body) => ({
        url: "/api/cruises/aroya/cabins-multiple",
        method: "POST",
        body,
      }),
    }),
    // calculateCruisePrice: builder.query<
    //   LoyaltyCalculatePriceResponse,
    //   {
    //     originalPrice: number;
    //     module: "cruises";
    //     points?: boolean;
    //     paymentMethod?: string;
    //   }
    // >({
    //   query: (params) => ({
    //     url: "/api/loyalty/calculate-price",
    //     method: "GET",
    //     params,
    //   }),
    //   keepUnusedDataFor: 0,
    // }),
    bookCruise: builder.mutation<CruiseBookResponse, CruiseBookRequest>({
      query: (body) => ({
        url: "/api/cruises/aroya/book",
        method: "POST",
        body,
      }),
    }),
    getCruiseBooking: builder.query<
      CruiseBookingDetailsResponse,
      string | number
    >({
      query: (bookingId) => ({
        url: `/api/cruises/aroya/bookings/${bookingId}`,
        method: "GET",
      }),
    }),
  }),
});
const cruisesApi2 = baseApi2.injectEndpoints({
  endpoints: (builder) => ({
    calculateCruisePrice: builder.query<
      LoyaltyCalculatePriceResponse,
      {
        originalPrice: number;
        module: "cruises";
        points?: boolean;
        paymentMethod?: string;
      }
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
  useSearchCruisesMutation,
  useGetCruiseItineraryMutation,
  useGetCruiseCategoriesMultipleMutation,
  useGetCruiseCabinsMultipleMutation,
  // useLazyCalculateCruisePriceQuery,
  useBookCruiseMutation,
  useLazyGetCruiseBookingQuery,
} = cruisesApi;

export const { useLazyCalculateCruisePriceQuery } = cruisesApi2;
export default cruisesApi;
