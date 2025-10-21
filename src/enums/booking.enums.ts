export enum BookingStatusEnum {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  // CANCELLED = "cancelled",
  CANCELLED_USER = "cancelled_user",
  CANCELLED_VIGIL = "cancelled_vigil",
  REJECTED = "rejected",
  REFUNDED = "refunded",
}

export enum PaymentStatusEnum {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}