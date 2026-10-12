import { baseApi, baseApi2 } from "@/redux/app/baseApi";
import type { AppBookingsResponse } from "@/types/appBookingsTypes";

const bookingsApi = baseApi2.injectEndpoints({
  endpoints: (builder) => ({
    getAppBookings: builder.query<AppBookingsResponse, void>({
      query: () => ({
        url: "/api/app/bookings",
        method: "GET",
      }),
      providesTags: ["AppBookings"],
    }),
  }),
});

export const { useGetAppBookingsQuery } = bookingsApi;
