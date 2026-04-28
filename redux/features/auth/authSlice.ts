import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

const AUTH_USER_COOKIE = "auth-user";
const AUTH_TOKEN_COOKIE = "auth-token";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
  roles: unknown[];
  type: string;
  chat: unknown;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

const initialState: AuthState = {
  user: getCookie(AUTH_USER_COOKIE)
    ? JSON.parse(getCookie(AUTH_USER_COOKIE) as string)
    : null,
  token: (getCookie(AUTH_TOKEN_COOKIE) as string)?.replace(/"/g, "") || null,
};

const cookieConfig = {
  maxAge: 60 * 60 * 24 * 7,
  secure: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (
      state,
      action: PayloadAction<{
        user: AuthUser;
        token: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      setCookie(AUTH_USER_COOKIE, JSON.stringify(action.payload.user), cookieConfig);
      setCookie(AUTH_TOKEN_COOKIE, JSON.stringify(action.payload.token), cookieConfig);
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      deleteCookie(AUTH_USER_COOKIE);
      deleteCookie(AUTH_TOKEN_COOKIE);
    },
  },
});

export const { setAuthData, logoutUser } = authSlice.actions;
export default authSlice;
