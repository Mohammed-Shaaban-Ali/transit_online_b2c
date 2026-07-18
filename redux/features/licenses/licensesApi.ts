import { baseApi2 } from "@/redux/app/baseApi";
import type { LoyaltyCalculatePriceResponse } from "@/redux/features/flights/flightsApi";

export interface LicensePriceResponse {
  success: boolean;
  data: number;
  currency: string;
}

export interface LicenseBookRequest {
  paymentGateway: string;
  redirectUrl: string;
  contact_info: {
    name: string;
    email: string;
    phone: string;
    country_calling_code: string;
    address: string;
  };
  passportPhoto: File;
  localLicensePhoto: File;
  personalPhoto: File;
  couponCode?: string;
}

export interface LicenseBookResponse {
  status: boolean;
  message?: string;
  bookingReference?: number | string | null;
  redirectUrl?: string | null;
}

export interface LicenseBookingDetails {
  id?: number | string;
  status?: string;
  payment_status?: string;
  [key: string]: unknown;
}

export interface LicenseCalculatePriceRequest {
  originalPrice: number;
  module: "licenses";
  points?: boolean;
  paymentMethod?: string;
  couponCode?: string;
}

const licensesApi2 = baseApi2.injectEndpoints({
  endpoints: (builder) => ({
    calculateLicensePrice: builder.query<
      LoyaltyCalculatePriceResponse,
      LicenseCalculatePriceRequest
    >({
      query: (params) => ({
        url: "/api/loyalty/calculate-price",
        method: "GET",
        params,
      }),
      keepUnusedDataFor: 0,
    }),
    getLicensePrice: builder.query<LicensePriceResponse, void>({
      query: () => ({
        url: "/api/licenses/price",
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
    bookLicense: builder.mutation<LicenseBookResponse, LicenseBookRequest>({
      query: (data) => {
        const formData = new FormData();
        formData.append("paymentGateway", data.paymentGateway);
        formData.append("redirectUrl", data.redirectUrl);
        formData.append("contact_info[name]", data.contact_info.name);
        formData.append("contact_info[email]", data.contact_info.email);
        formData.append("contact_info[phone]", data.contact_info.phone);
        formData.append(
          "contact_info[country_calling_code]",
          data.contact_info.country_calling_code,
        );
        formData.append("contact_info[address]", data.contact_info.address);
        formData.append("passportPhoto", data.passportPhoto);
        formData.append("localLicensePhoto", data.localLicensePhoto);
        formData.append("personalPhoto", data.personalPhoto);
        if (data.couponCode) {
          formData.append("couponCode", data.couponCode);
        }

        return {
          url: "/api/licenses/book",
          method: "POST",
          body: formData,
        };
      },
    }),
    getLicenseBooking: builder.query<LicenseBookingDetails, string | number>({
      query: (bookingId) => ({
        url: `/api/licenses/bookings/${bookingId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useLazyCalculateLicensePriceQuery,
  useGetLicensePriceQuery,
  useLazyGetLicensePriceQuery,
  useBookLicenseMutation,
  useGetLicenseBookingQuery,
  useLazyGetLicenseBookingQuery,
} = licensesApi2;
