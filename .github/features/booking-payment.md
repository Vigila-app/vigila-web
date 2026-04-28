# Booking Payment Flow (Vigila App)

## Overview

This document describes the complete end-to-end flow for paying a booking on the Vigila platform. There are two payment methods available to consumers: **Stripe card payment** and **wallet payment**.

Stripe card payment supports both **single-booking payments** and **batch payments** (multiple bookings created during the matching trial flow) by passing `bookingId` or `bookingIds[]` plus the total `amount` in cents.

> **Important security note:** As of March 2026, the booking payment status is updated exclusively server-side via Stripe webhooks. Clients have no ability to set a booking to `PAID`. This closes a security vulnerability where a crafted client request could mark an unpaid booking as paid.

---

## Payment Methods

### 1. Wallet Payment

The consumer's wallet balance is debited directly — no external payment processor involved.

```
Consumer → POST /api/v1/wallet/pay-booking
  → Verify booking ownership
  → Check sufficient balance
  → Atomic RPC: update_wallet_balance (debit)
  → Create wallet_transactions record (type: DEBIT)
  → Update booking: payment_status = PAID, status = PENDING, payment_method = WALLET
  → Redirect to result page (?payment_method=wallet&status=success)
  → Result page fires getBookingDetails(bookingId, force=true) to sync Zustand store
  → Result page shows success immediately
```

**Handled entirely server-side in one request. No webhook involved.**

---

### 2. Card Payment (Stripe)

The Stripe payment flow is split across three stages: intent creation, client-side payment confirmation, and server-side webhook processing.

#### Stage 1 — Create Payment Intent

```
Consumer → POST /api/v1/payment/create-payment-intent
  → Authenticate user (role must be CONSUMER)
  → Validate request: bookingId or bookingIds[] + amount > 0
  → Verify all bookings exist, belong to user, and are not already PAID
  → Call stripe.paymentIntents.create() with metadata:
      {
        bookingIds: "<id1,id2,...>",
        user_id: "<consumer-uuid>",
        transaction_type: "BOOKING_PAYMENT"
      }
  → Update bookings in DB: payment_id = paymentIntent.id, payment_status = PENDING
  → Return clientSecret to client
```

Request body (example):

```json
{
  "bookingIds": ["uuid-1", "uuid-2"],
  "amount": 12000,
  "currency": "eur"
}
```

`bookingId` is accepted as a single-item shorthand. `amount` is expressed in cents and represents the **total** for all bookings in the request.

The `transaction_type: BOOKING_PAYMENT` in the metadata is how the webhook knows which handler to invoke.

#### Stage 2 — Client-Side Payment Confirmation

```
Client (Stripe.js / CheckoutForm component)
  → stripe.confirmPayment({ elements, redirect: "if_required" })
  → On success: router.push to /booking/payment/result?bookingId=...&payment_intent=...
  → NOTE: client does NOT update booking status — it only redirects
```

#### Stage 3 — Stripe Webhook (Server-Side)

Stripe fires `payment_intent.succeeded` to `POST /api/v1/webhooks/stripe`.

```
Stripe → POST /api/v1/webhooks/stripe
  → Verify stripe-signature header (replay attack prevention)
  → Parse event type: "payment_intent.succeeded"
  → Extract transaction_type from paymentIntent.metadata
  → Switch:
      case BOOKING_PAYMENT → handleBookingPayment(paymentIntent)
      case TOP_UP          → handleTopUp(paymentIntent)

handleBookingPayment(paymentIntent):
  → Validate metadata: bookingIds (or bookingId), user_id
  → Fetch all referenced bookings from DB
  → Idempotency check: if all bookings are already PAID with same payment_id → return 200 OK (no-op)
  → Verify every booking.consumer_id === user_id from metadata
  → Update all bookings: payment_id = paymentIntent.id, payment_status = PAID
  → Send email notifications (best effort) per booking:
    - Consumer: booking status update
    - Vigil: booking status update
  → Return 200 OK
```

**Note:** The webhook only updates `payment_status`. Booking status transitions are handled by the booking workflow (for example, when the Vigil accepts or rejects).

#### Stage 4 — Result Page Polling

The result page (`/booking/payment/result`) cannot know exactly when the webhook fires, so it polls the booking until `payment_status === PAID`:

```
Result page mounts
  → Every 3 seconds: useBookingsStore.getBookingDetails(bookingId, force=true)
      (calls GET /api/v1/bookings/:bookingId AND writes the result into the Zustand store)
  → If booking.payment_status === PAID → stop polling, update store, show success
  → After 10 attempts (~30 seconds) → show success anyway
      (payment was captured by Stripe; webhook is just delayed)
  → On error → show success anyway (same reasoning)
```

> **Store sync:** Both the Stripe polling path and the wallet path call `useBookingsStore.getBookingDetails(bookingId, force=true)` on the result page so the Zustand store reflects the updated `payment_status` before the user navigates back. This avoids stale cache issues when the booking detail modal is opened after payment.

**Batch payments (matching trial):** The matching flow creates multiple bookings and a single PaymentIntent (`bookingIds`). On success it redirects to `/matching/trial-confirmed` and does not poll; the webhook still updates all referenced bookings to `PAID` in the background.

---

## Full Sequence Diagram

```
Consumer Browser          Your Server              Stripe
     |                        |                       |
     |--- POST create-intent →|                       |
     |                        |--- create PI -------->|
     |                        |<-- clientSecret ------|
     |←-- clientSecret -------|                       |
     |                        |                       |
     |--- confirmPayment() via Stripe.js -----------→|
     |                        |                       |
     |←-- redirect to result page ------------------- |
     |                        |                       |
     | [result page polls DB] |←-- webhook PI.succeeded
     |                        |    handleBookingPayment()
     |                        |    UPDATE booking: PAID
     |                        |    Send emails
     |                        |                       |
     | poll: GET /bookings/:id|                       |
     |←-- booking.payment_status = PAID              |
     | Show success ✓         |                       |
```

---

## Security Model

| What                                      | Who can do it | How                                                              |
| ----------------------------------------- | ------------- | ---------------------------------------------------------------- |
| Create payment intent (single or batch)   | Consumer only | Auth check + role check + booking ownership checks in API        |
| Confirm payment (debit card)              | Consumer only | Via Stripe.js in browser                                         |
| Set `payment_status = PAID`               | Server only   | Stripe webhook handler                                           |
| Set `payment_status = PAID` from client   | **Nobody**    | PUT /bookings/:id/payment returns 403 if `payment_status = PAID` |
| Other booking status changes (cancel etc) | Consumer only | PUT /bookings/:id/payment                                        |

The client is completely removed from the payment confirmation loop. Even if a consumer crafted a malicious PUT request to mark their booking as paid, the server rejects it with 403.

---

## Webhook Reliability

Stripe's webhook delivery has built-in retry logic. If your server is temporarily unavailable:

- Stripe will retry the webhook up to **~16 times over 3 days** with exponential backoff
- The booking will eventually be marked `PAID` once a retry succeeds
- The money is always captured at Stage 2 — the webhook only syncs your database

**Idempotency:** If the same webhook event is delivered twice (Stripe's at-least-once guarantee), the handler detects that `booking.payment_id === paymentIntent.id && payment_status === PAID` and returns 200 OK immediately without processing again.

---

## Key Files

| File                                                | Role                                                          |
| --------------------------------------------------- | ------------------------------------------------------------- |
| `app/api/v1/payment/create-payment-intent/route.ts` | Stage 1: Creates Stripe PaymentIntent with metadata           |
| `components/checkout/checkoutForm.component.tsx`    | Stage 2: Stripe.js payment confirmation in browser            |
| `components/bookings/bookingPayment.component.tsx`  | Payment page UI, orchestrates Stage 1 & 2                     |
| `app/api/v1/webhooks/stripe/route.ts`               | Stage 3 entry point: verifies signature, routes by event type |
| `app/api/v1/webhooks/stripe/webhooks.fn.ts`         | Stage 3 handlers: `handleBookingPayment()`, `handleTopUp()`   |
| `app/(consumer)/booking/payment/result/page.tsx`    | Stage 4: Polls DB for payment confirmation                    |
| `app/(consumer)/matching/success/page.tsx`          | Batch booking payment: creates bookings + Stripe intent       |
| `app/api/v1/wallet/pay-booking/route.ts`            | Wallet payment: fully server-side, no webhook                 |
| `app/api/v1/bookings/[bookingId]/payment/route.ts`  | Booking status updates (blocks PAID from client)              |
| `src/types/transactions.types.ts`                   | `TRANSACTION_TYPE` enum including `BOOKING_PAYMENT`           |

---

## Local Development

To test the webhook flow locally, the Stripe CLI is required to forward events to localhost:

```bash
stripe listen --forward-to localhost:3000/api/v1/webhooks/stripe
```

Copy the `whsec_test_...` secret it prints and set it in `.env.local`:

```
STRIPE_WEBHOOK_SECRET=whsec_test_...
```

Restart the dev server after updating the env. The secret printed by the CLI is **different** from the one in the Stripe dashboard — always use the CLI-printed one when developing locally.
