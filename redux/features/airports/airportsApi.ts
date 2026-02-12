import { baseApi2, SuccessResponse } from "@/redux/app/baseApi";
import { airportTypes } from "@/types/airportTypes";

interface AirportQueryParams {
  search: string;
  page: string;
}

interface AirportResponse {
  items: airportTypes[];
  hasMore: boolean;
}

const airportsApi = baseApi2.injectEndpoints({
  endpoints: (builder) => ({
    getAllAirports: builder.query<AirportResponse, AirportQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.search) searchParams.append("search", params.search);
        if (params.page) searchParams.append("page", params.page);

        return {
          url: `/api/flights-core/select2/airports?${searchParams.toString()}`,
          method: "GET",
        };
      },
      //providesTags: ["locale"],
    }),
  }),
});

export const { useGetAllAirportsQuery } = airportsApi;
