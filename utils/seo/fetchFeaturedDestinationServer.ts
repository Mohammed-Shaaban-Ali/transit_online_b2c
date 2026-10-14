import type { IFeaturedDestination } from "@/types/website";

type PostsApiResponse = {
  data?: IFeaturedDestination;
};

/** Server-side fetch for featured destination SEO fields. */
export async function fetchFeaturedDestinationServer(
  id: string,
): Promise<IFeaturedDestination | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_AIRPORTS;
  if (!baseUrl || !id) return null;

  try {
    const res = await fetch(`${baseUrl.replace(/\/+$/, "")}/api/posts/${id}`, {
      next: { revalidate: 300 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as PostsApiResponse;
    return json?.data ?? null;
  } catch {
    return null;
  }
}
