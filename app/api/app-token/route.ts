import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  let apiToken = cookieStore.get("api-token")?.value;

  if (!apiToken) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_EFICTA}/api/api-auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: process.env.NEXT_PUBLIC_APP_USERNAME,
            password: process.env.NEXT_PUBLIC_APP_PASSWORD,
          }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        return Response.json({ error: error.message }, { status: 500 });
      }

      const data = await res.json();
      apiToken = data.access_token as string;
    } catch (error) {
      console.error("Login failed:", error);
      return Response.json({ error: "Authentication failed" }, { status: 500 });
    }
  }

  return Response.json({ token: apiToken });
}