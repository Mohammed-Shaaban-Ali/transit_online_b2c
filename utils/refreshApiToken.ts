import { setCookie } from "cookies-next";
import { API_TOKEN_COOKIE } from "@/constants";

/**
 * Refresh the x-api-token by calling the API auth endpoint
 * @returns The new API token or null if refresh fails
 */
const EFICTA_URL = process.env.NEXT_PUBLIC_APP_EFICTA;
const API_USERNAME = process.env.NEXT_PUBLIC_APP_USERNAME;
const API_PASSWORD = process.env.NEXT_PUBLIC_APP_PASSWORD;
export const refreshApiToken = async (): Promise<string | null> => {
  try {
    const res = await fetch(`${EFICTA_URL}/api/api-auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: API_USERNAME,
        password: API_PASSWORD,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to refresh API token: ${res.statusText}`);
    }

    const data = await res.json();
    const newToken = data?.access_token;
    if (newToken) {
      setCookie(API_TOKEN_COOKIE, newToken, { maxAge: 3600 }); // 1 hour expiry
    }

    return newToken || null;
  } catch (err) {
    console.error("Failed to refresh API token:", err);
    return null;
  }
};
