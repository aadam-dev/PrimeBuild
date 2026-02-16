// Extended by Supabase generated types (Stage 2)
export type UserRole = "customer" | "admin";

export type ProformaStatus =
  | "draft"
  | "pending"
  | "approved"
  | "declined"
  | "expired"
  | "converted";

export type OrderStatus =
  | "confirmed"
  | "with_supplier"
  | "dispatched"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "deposit_paid" | "paid" | "failed";
