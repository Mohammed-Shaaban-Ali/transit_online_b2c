import { baseApi, baseApi2, SuccessResponse } from "@/redux/app/baseApi";
import { cityTypes } from "@/components/shared/HotelSearchBox/LocationSearch";
import {
  bookHotelRequest,
  IHotelDetails,
  IPackage,
  searchHotelsParams,
  SearchHotelsResponse,
} from "@/types/hotels";
import { getCookie } from "cookies-next";
import { NEXT_LOCALE } from "@/constants";
import { Locale } from "next-intl";
import { LoyaltyCalculatePriceResponse } from "@/redux/features/flights/flightsApi";

export interface HotelPassenger {
  Id: string;
  Allocation: string;
  Email?: { Value: string };
  Telephone?: { PhoneNumber: string };
  PersonDetails: {
    Name: {
      GivenName: string;
      Surname: string;
      NamePrefix: string;
    };
    Type: 0 | 1;
    Age?: number;
  };
}

export interface HotelBookRequest {
  paymentGateway: string;
  uuid: string;
  hotelID: number;
  packageID: string;
  leadPaxID: string;
  leadPaxAllocation: string;
  passengers: HotelPassenger[];
}

// Types for hotel package revalidation
export interface RevalidatePackagesParams {
  country: string;
  checkIn: string;
  checkOut: string;
  hotelIds: number[];
  rooms: {
    AdultsCount: number;
    KidsAges: number[];
  }[];
}

export interface RevalidatePackagesResponse {
  errors: unknown[];
  packages: IPackage[];
  uuid: string;
}



export interface ChangePackageParams {
  quotationHotelId: number;
  newPackage: IPackage;
  uuid: string;
}

const hotelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCities: builder.query<
      SuccessResponse<cityTypes[]>,
      {
        name?: string;
        code?: string;
        id?: number;
      }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.name) searchParams.append("name", params.name);
        if (params.code) searchParams.append("code", params.code);
        if (params.id) searchParams.append("id", params.id.toString());
        return {
          url: `/api/hotels/cities?${searchParams.toString()}`,
          method: "GET",
        };
      },
      //providesTags: ["locale"],
    }),
    searchHotels: builder.mutation<SearchHotelsResponse, searchHotelsParams>({
      query: (data) => ({
        url: `/api/hotels/b2c/search-hotels`,
        method: "POST",
        body: data,
      }),
      //invalidatesTags: ["locale"],
    }),
    getHotelDetails: builder.query<
      IHotelDetails,
      { hotelID: string; uuid: string }
    >({
      query: ({ hotelID, uuid }) => {
        const locale = (getCookie(NEXT_LOCALE) as Locale) || "en";
        return {
          url: `/api/hotels/b2c/packages`,
          method: "POST",
          body: { uuid, hotelID, roomNameResponseLanguage: locale },
        };
      },
      //providesTags: ["locale"],
    }),

    getCurrencies: builder.query<
      {
        items: {
          id: number;
          text: string;
        }[];
        hasMore: boolean;
      },
      {
        search?: string;
        page?: string;
      }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.search) searchParams.append("search", params.search);
        if (params.page) searchParams.append("page", params.page);

        return {
          url: `/api/currencies/select2?${searchParams.toString()}`,
          method: "GET",
        };
      },
      //providesTags: ["locale"],
    }),

    // Revalidate hotel packages - fetch latest packages for a specific hotel
    revalidateHotelPackages: builder.mutation<
      RevalidatePackagesResponse,
      RevalidatePackagesParams
    >({
      query: (data) => ({
        url: `/api/hotels/b2c/hotel-packages`,
        method: "POST",
        body: data,
      }),
    }),



    // Change package for a quotation hotel
    changeHotelPackage: builder.mutation<
      SuccessResponse<any>,
      ChangePackageParams
    >({
      query: (data) => ({
        url: `/api/hotels/b2c/hotel-packages/change-package`,
        method: "POST",
        body: data,
      }),
    }),

    bookHotel: builder.mutation<
      {
        success: boolean;
        message: string;
        bookingId: number;
        redirectUrl: string;
      },
      HotelBookRequest
    >({
      query: (data) => ({
        url: `/api/hotels/b2c/book`,
        method: "POST",
        body: data,
      }),
    }),

    getHotelBooking: builder.query<SuccessResponse<any>, string>({
      query: (bookingId) => ({
        url: `/api/iati/bookings/${bookingId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useGetAllCitiesQuery,
  useSearchHotelsMutation,
  useGetHotelDetailsQuery,
  useGetCurrenciesQuery,
  useRevalidateHotelPackagesMutation,
  useChangeHotelPackageMutation,
  useBookHotelMutation,
  useGetHotelBookingQuery,
  useLazyGetHotelBookingQuery,
} = hotelsApi;

const hotelsApi2 = baseApi2.injectEndpoints({
  endpoints: (builder) => ({
    submitQuotation: builder.mutation<SuccessResponse<any>, bookHotelRequest>({
      query: (data) => ({
        url: `/api/hotels-quotation/quotations-api`,
        method: "POST",
        body: data,
      }),
    }),

    calculateHotelPrice: builder.query<
      LoyaltyCalculatePriceResponse,
      { originalPrice: number; module: "hotels"; points?: boolean }
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
  useSubmitQuotationMutation,
  useLazyCalculateHotelPriceQuery,
} = hotelsApi2;
