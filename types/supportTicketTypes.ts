import type {
  SupportTicketReason,
  SupportTicketStatus,
} from "@/constants/supportTickets";

export type SupportTicketBookingType =
  | "flight"
  | "hotel"
  | "package-new"
  | "package-flight"
  | "cruise"
  | "visa"
  | "license";

export interface SupportTicketCreator {
  id: number;
  name: string;
}

export interface SupportTicket {
  id: number;
  booking_type: SupportTicketBookingType;
  booking_id: string;
  status: SupportTicketStatus;
  reason: SupportTicketReason;
  description: string;
  creator: SupportTicketCreator;
  created_at: string;
  updated_at: string;
}

export interface CreateSupportTicketRequest {
  booking_type: SupportTicketBookingType;
  booking_id: string;
  reason: SupportTicketReason;
  description: string;
}

export interface CreateSupportTicketResponse {
  success: boolean;
  message?: string;
  data: SupportTicket;
}

export interface SupportTicketsListResponse {
  success: boolean;
  data: SupportTicket[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
