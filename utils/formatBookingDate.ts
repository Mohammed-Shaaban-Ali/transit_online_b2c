import { getDisplayLocale } from "@/utils/formatNumber";

function readStringField(
  source: Record<string, unknown> | null | undefined,
  key: string,
): string | null {
  const value = source?.[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

/** Resolve booking creation timestamp from API field variants. */
export function getBookingCreatedAt(booking: unknown): string | null {
  if (!booking || typeof booking !== "object") return null;

  const root = booking as Record<string, unknown>;
  const nested =
    root.booking_data && typeof root.booking_data === "object"
      ? (root.booking_data as Record<string, unknown>)
      : null;

  return (
    readStringField(root, "created_at") ||
    readStringField(root, "createdAt") ||
    readStringField(nested, "created_at") ||
    readStringField(nested, "createdAt") ||
    readStringField(root, "date") ||
    readStringField(nested, "date") ||
    null
  );
}

export function getBookingCreatedAtTime(booking: unknown): number {
  const raw = getBookingCreatedAt(booking);
  if (!raw) return 0;
  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function formatBookingDate(
  value?: string | null,
  locale = "en",
): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(getDisplayLocale(locale), {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
