import { baseApi2 } from "@/redux/app/baseApi";
import {
  IFeaturedDestination,
  IPaginationParams,
  IPaginationResponse,
} from "@/types/website";

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
  }),
});

export const { useGetFeaturedDestinationsQuery } = websiteApi;
