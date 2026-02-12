import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "cookies-next";
import {
  NEXT_LOCALE,
  API_TOKEN_COOKIE,
} from "@/constants";
import { toast } from "sonner";
import { Locale } from "next-intl";
import { refreshApiToken } from "@/utils/refreshApiToken";

const API_URL = process.env.NEXT_PUBLIC_APP_EFICTA || "";
const API_URL2 = process.env.NEXT_PUBLIC_APP_AIRPORTS || "";
// Define error response type
export interface ErrorResponse {
  data?: string[];
  errors?: Record<string, string[]>;
  msg?: string;
  message?: string;
  status?: number;
  statusCode?: number;
}

// Define success response type with a dynamic DT
export interface SuccessResponse<DataType = any> {
  data: DataType;
  msg: string;
  status: string;
}

// Helper function to create baseQuery with prepareHeaders
const createBaseQuery = (baseUrl: string) =>
  fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const apiToken = getCookie(API_TOKEN_COOKIE) as string;
      const language = (getCookie(NEXT_LOCALE) as Locale) || "en";

      // Set x-api-token header
      if (apiToken) {
        headers.set("x-api-token", apiToken);
      }

      // Set language header (lng instead of Accept-Language)
      headers.set("lng", language);

      // Set b2c header
      headers.set("b2c", "1");

      // Set Content-Type if not already set
      if (!headers.get("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      return headers;
    },
  });

// Define a custom fetchBaseQuery
const baseQuery = createBaseQuery(API_URL as string);
const baseQuery2 = createBaseQuery(API_URL2 as string);

// Token refresh queue management
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
};

// Helper function to create baseQueryWithInterceptor
const createBaseQueryWithInterceptor = (queryFn: typeof baseQuery) => {
  return async (args: any, api: any, extraOptions: any) => {
    const result = await queryFn(args, api, extraOptions);
    const error = result.error as ErrorResponse;
    const method = typeof args === "string" ? "GET" : args.method || "GET";
    const originalRequest = args;

    // Handle 403 with status 'EXPIRED' - Refresh x-api-token
    if (
      (error?.status as number) === 403 &&
      (error?.data as any)?.status === "EXPIRED" &&
      !(originalRequest as any)?._retry
    ) {
      (originalRequest as any)._retry = true;

      if (isRefreshing) {
        // Wait for ongoing refresh
        return new Promise<typeof result>((resolve, reject) => {
          failedQueue.push({
            resolve: async (token: string | null) => {
              if (token && typeof originalRequest === "object") {
                const retryRequest = {
                  ...originalRequest,
                  headers: {
                    ...(originalRequest.headers || {}),
                    "x-api-token": token,
                  },
                };
                try {
                  const retryResult = await queryFn(
                    retryRequest as any,
                    api,
                    extraOptions
                  );
                  resolve(retryResult);
                } catch (err) {
                  reject(err);
                }
              } else {
                resolve(result);
              }
            },
            reject: (err: any) => {
              reject(err);
            },
          });
        }).catch(() => result);
      }

      isRefreshing = true;

      try {
        const newToken = await refreshApiToken();

        if (!newToken) {
          processQueue(null, null);
          isRefreshing = false;
          return result;
        }

        processQueue(null, newToken);
        isRefreshing = false;

        // Retry the original request with new token
        if (typeof originalRequest === "object") {
          const retryRequest = {
            ...originalRequest,
            headers: {
              ...(originalRequest.headers || {}),
              "x-api-token": newToken,
            },
          };
          const retryResult = await queryFn(
            retryRequest as any,
            api,
            extraOptions
          );
          return retryResult;
        }

        return result;
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        return result;
      }
    }


    // Handle other errors
    if (!!result.error) {
      const err = result.error?.data as ErrorResponse;
      const errorMessage = err.msg || err.message || "Something went wrong";
      const url = (args as any).url;
      const notToastUrls = [
        "/api/sabre/fare",
        "/api/iati/fare",
        "/api/hotels/b2c/packages",
      ];
      if (notToastUrls.includes(url)) {
        return result;
      }
      // Don't show toast for 401/403 as we already handled them above
      if (
        (error?.status as number) !== 401 &&
        (error?.status as number) !== 403
      ) {
        toast.error(errorMessage, {
          description:
            err.data || Object.entries(err.errors || {}).map(([k, v]) => v),
        });
      }
    }

    // Show success message for non-GET requests
    if (!!result.data && method !== "GET") {
      const url = (args as any).url;
      const notToastUrls = [
        "/api/hotels/b2c/search-hotels",
        "/api/hotels/b2c/packages",
        "/api/sabre/search",
        "/api/iati/search",
        "/api/sabre/fare",
        "/api/iati/fare",
        "/api/hotels/b2c/hotel-packages",
      ];

      if (notToastUrls.includes(url)) {
        return result;
      } else {
        const successMsg = (result.data as SuccessResponse<any>).msg;
        toast.success(successMsg || "Successfully done");
      }
    }

    return result;
  };
};

// Define interceptors
const baseQueryWithInterceptor = createBaseQueryWithInterceptor(baseQuery);
const baseQueryWithInterceptor2 = createBaseQueryWithInterceptor(baseQuery2);

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithInterceptor,
  tagTypes: ["locale",],
  endpoints: () => ({}),
});

export const baseApi2 = createApi({
  reducerPath: "api2",
  baseQuery: baseQueryWithInterceptor2,
  tagTypes: ["locale",],
  endpoints: () => ({}),
});
