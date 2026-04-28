import { baseApi2, SuccessResponse } from "@/redux/app/baseApi";
import { setAuthData, type AuthUser } from "@/redux/features/auth/authSlice";

interface VerifyOtpResponse {
  status: boolean;
  message: string;
  access_token: string;
  token_type: string;
  last_login_at: string | null;
  last_activity_at: string | null;
  user: AuthUser;
}

const authApi = baseApi2.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<SuccessResponse<any>, {
      login: string;
      type: "EMAIL" | "PHONE"
    }>({
      query: (body) => ({
        url: "/api/auth/login",
        method: "POST",
        body,
      }),

    }),

    sendOtp: builder.mutation<
      VerifyOtpResponse,
      {
      field: string;
      otp: string;
      type: "EMAIL" | "PHONE"
    }
    >({
      query: (body) => ({
        url: "/api/auth/verify-otp",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setAuthData({
              user: data.user,
              token: data.access_token,
            }),
          );
        } catch (error) {
          console.error("Verify OTP error:", error);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useSendOtpMutation } = authApi;
