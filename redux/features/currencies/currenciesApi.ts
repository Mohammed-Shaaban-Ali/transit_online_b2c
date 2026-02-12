import { baseApi2 } from "@/redux/app/baseApi";

export interface CurrencyItem {
  id: number;
  text: string;
}

interface CurrenciesQueryParams {
  search?: string;
  page?: string;
}

interface CurrenciesResponse {
  items: CurrencyItem[];
  hasMore: boolean;
}

const currenciesApi = baseApi2.injectEndpoints({
  endpoints: (builder) => ({
    getCurrencies: builder.query<CurrenciesResponse, CurrenciesQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.search) searchParams.append("search", params.search);
        if (params.page) searchParams.append("page", params.page);

        return {
          url: `/api/information/select2/currencies?${searchParams.toString()}`,
          method: "GET",
        };
      },
      //providesTags: ["locale"],
    }),
  }),
});

export const { useGetCurrenciesQuery } = currenciesApi;
