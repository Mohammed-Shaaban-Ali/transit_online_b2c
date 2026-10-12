import { baseApi2 } from "@/redux/app/baseApi";
import type {
  CreateSupportTicketRequest,
  CreateSupportTicketResponse,
  SupportTicketsListResponse,
} from "@/types/supportTicketTypes";

const ticketsApi = baseApi2.injectEndpoints({
  endpoints: (builder) => ({
    getSupportTickets: builder.query<
      SupportTicketsListResponse,
      { page?: number; per_page?: number }
    >({
      query: ({ page = 1, per_page = 15 } = {}) => ({
        url: "/api/companies-b2b/tickets",
        method: "GET",
        params: { page, per_page },
      }),
      providesTags: ["Tickets"],
    }),

    createSupportTicket: builder.mutation<
      CreateSupportTicketResponse,
      CreateSupportTicketRequest
    >({
      query: (body) => ({
        url: "/api/companies-b2b/tickets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tickets"],
    }),
  }),
});

export const { useGetSupportTicketsQuery, useCreateSupportTicketMutation } =
  ticketsApi;
