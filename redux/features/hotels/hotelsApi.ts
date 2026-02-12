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
  }),
});

export const {
  useGetAllCitiesQuery,
  useSearchHotelsMutation,
  useGetHotelDetailsQuery,
  useGetCurrenciesQuery,
  useRevalidateHotelPackagesMutation,
  useChangeHotelPackageMutation,
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
  }),
});

export const { useSubmitQuotationMutation } = hotelsApi2;
