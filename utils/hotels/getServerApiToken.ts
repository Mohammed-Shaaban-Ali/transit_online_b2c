import { cookies } from "next/headers";
import { API_TOKEN_COOKIE } from "@/constants";

const EFICTA_URL = process.env.NEXT_PUBLIC_APP_EFICTA;
const API_USERNAME = process.env.NEXT_PUBLIC_APP_USERNAME;
const API_PASSWORD = process.env.NEXT_PUBLIC_APP_PASSWORD;

/** Resolves x-api-token for server-side EFICTA requests. */
export async function getServerApiToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(API_TOKEN_COOKIE)?.value;
  if (existing) return existing;

  if (!EFICTA_URL || !API_USERNAME || !API_PASSWORD) {
    return null;
  }

  try {
    const res = await fetch(`${EFICTA_URL}/api/api-auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: API_USERNAME,
        password: API_PASSWORD,
      }),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return (data?.access_token as string) || null;
  } catch {
    return null;
  }
}
