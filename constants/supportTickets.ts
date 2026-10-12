export const SUPPORT_TICKET_REASONS = ["refund", "cancel", "other"] as const;

export const SUPPORT_TICKET_STATUSES = [
  "open",
  "in-progress",
  "completed",
] as const;

export type SupportTicketReason = (typeof SUPPORT_TICKET_REASONS)[number];

export type SupportTicketStatus = (typeof SUPPORT_TICKET_STATUSES)[number];

export function isSupportTicketReason(value: string): value is SupportTicketReason {
  return SUPPORT_TICKET_REASONS.includes(value as SupportTicketReason);
}

export function normalizeSupportTicketStatus(
  status: string,
): SupportTicketStatus | null {
  const normalized = status.trim().toLowerCase().replace(/_/g, "-");

  if (normalized === "open") return "open";
  if (normalized === "in-progress") return "in-progress";
  if (normalized === "completed") return "completed";

  return null;
}
