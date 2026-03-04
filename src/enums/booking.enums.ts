export enum BookingStatusEnum {
  PENDING = "pending",
  PENDING_NOTICE_PROPOSAL = "pending_notice_proposal",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
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