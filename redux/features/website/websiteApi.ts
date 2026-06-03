import { baseApi2, SuccessResponse } from "@/redux/app/baseApi";
import {
  IFeaturedDestination,
  IFlightOffer,
  IPaginationParams,
  IPaginationResponse,
  ITrip,
} from "@/types/website";

interface BookTripOfferPayload {
  offer_id: number;
  email: string;
  phone: string;
  name: string;
  message: string;
}

const websiteApi = baseApi2.injectEndpoints({
  endpoints: (builder) => ({
    getFeaturedDestinations: builder.query<
      IPaginationResponse<IFeaturedDestination>,
      IPaginationParams
    >({
      query: (params) => {
        return {
          url: `/api/posts`,
          method: "GET",
          params,
        };
      },
    }),
    getFeaturedDestinationDetails: builder.query<
      SuccessResponse<IFeaturedDestination>,
      string
    >({
      query: (id) => {
        return {
          url: `/api/posts/${id}`,
          method: "GET",
        };
      },
    }),
    getFlightOffers: builder.query<
      IPaginationResponse<IFlightOffer>,
      IPaginationParams
    >({
      query: (params) => {
        return {
          url: `/api/flights-offers`,
          method: "GET",
          params,
        };
      },
    }),
    getTrips: builder.query<IPaginationResponse<ITrip>, IPaginationParams>({
      query: (params) => {
        return {
          url: `/api/trips`,
          method: "GET",
          params,
        };
      },
    }),
    getTripDetails: builder.query<IPaginationResponse<ITrip>, string>({
      query: (id) => {
        return {
          url: `/api/trips`,
          method: "GET",
          params: { id },
        };
      },
    }),
    bookTripOffer: builder.mutation<SuccessResponse<any>, BookTripOfferPayload>(
      {
        query: (body) => ({
          url: "/api/booking-offer/mail",
          method: "POST",
          body,
        }),
      },
    ),
  }),
});
export const {
  useGetFeaturedDestinationsQuery,
  useGetFeaturedDestinationDetailsQuery,
  useGetFlightOffersQuery,
  useGetTripsQuery,
  useGetTripDetailsQuery,
  useBookTripOfferMutation,
} = websiteApi;
