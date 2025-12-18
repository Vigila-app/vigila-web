# Wallet & Prepaid Packages Specification (Vigila App)

## 1. Project Overview
Implementation of a **Closed-Loop Wallet System** for the "Vigila" care platform.
Users (Consumers) can purchase prepaid credit packages to pay for care services.
Key value proposition: Buying larger packages grants "Bonus Credit" (e.g., Pay €100, Get €120).

---

## 2. Domain Models & Database Schema

### A. Packages (Configuration)
Entities representing the prepaid tiers.
* **Source:** Database driven (not hardcoded), administrable.
* **Fields:**
    * `id`: UUID
    * `name`: String (e.g., "Starter", "Family")
    * `price`: Decimal (Cost to user, e.g., €50.00)
    * `credit_amount`: Decimal (Value added to wallet, e.g., €55.00)
    * `bonus_percentage`: Integer (Display purpose, e.g., 10%)
    * `features`: Array/JSON (List of perks, e.g., "Supporto 24/7")
    * `is_active`: Boolean

**Defined Tiers (from Wireframe):**
1.  **Starter:** Price €50 → Credit €55 (10% Bonus)
2.  **Standard:** Price €100 → Credit €120 (20% Bonus)
3.  **Family:** Price €500 → Credit €650 (30% Bonus)

### B. Wallet
The container for user funds.
* **Relationship:** One-to-One with User.
* **Fields:**
    * `user_id`: UUID
    * `current_balance`: Decimal (Available to spend)
    * `total_lifetime_deposit`: Decimal (Real money paid)
    * `total_lifetime_bonus`: Decimal (Free credit received)

### C. Transactions (Wallet Movement)
Immutable ledger of all balance changes.
* **Fields:**
    * `id`: UUID
    * `wallet_id`: UUID
    * `amount`: Decimal (Positive for Credit, Negative for Debit)
    * `type`: Enum (`DEPOSIT`, `PAYMENT`, `REFUND`, `MANUAL_ADJUSTMENT`)
    * `status`: Enum (`PENDING`, `COMPLETED`, `FAILED`)
    * `reference_id`: UUID (Link to Order ID or Booking ID)
    * `description`: String (Visible in UI, e.g., "Ricarica Pacchetto Starter")
    * `created_at`: Timestamp

---

## 3. Business Logic & Workflows

### Flow A: Direct Package Purchase (Vertical Landing Page)
1.  User visits `/pacchetti`.
2.  Selects a Package (e.g., Standard €100).
3.  Completes checkout via Payment Gateway (Stripe/PayPal).
4.  **On Success Webhook:**
    * Create `Transaction` (+€120, type: DEPOSIT).
    * Update `Wallet` balance (+€120).
    * Send confirmation email with Invoice for €100.

### Flow B: "Upsell" during Booking (The Hybrid Flow)
*Scenario:* User attempts to book a service costing €45, but Wallet Balance is €10.
1.  **Detection:** System detects `balance < service_cost`.
2.  **Prompt:** UI displays specific banner: "Acquista pacchetto Starter (€50) per coprire la spesa e guadagnare €5 bonus."
3.  **Action:** User adds Package to cart along with the Booking.
4.  **Checkout:** User pays €50 (Package Price).
5.  **Atomic Execution (Critical):**
    * *Step 1:* Process Payment of €50.
    * *Step 2:* Crediting: Add €55 to Wallet (New Balance: €65).
    * *Step 3:* Debiting: Immediately deduct €45 for the Booking (New Balance: €20).
    * *Step 4:* Confirm Booking.

### Flow C: Service Refund
If a booking is cancelled:
1.  Calculate amount to refund.
2.  Create `Transaction` (Positive amount, type: REFUND).
3.  Update Wallet Balance.
4.  *Note:* Funds return to Wallet, not to the user's credit card.

---

## 4. UI/UX Specifications

### 1. Landing Page / Vertical (`/pacchetti`)
* **Layout:** 3 Columns/Cards for packages.
* **Highlight:** Clearly differentiate "Pay X" vs "Get Y".
* **Marketing:** Section "Come funziona" (Steps 1-2-3).
* **CTA:** "Acquista ora" buttons.

### 2. User Profile - Wallet Section
* **Header Card:**
    * Prominent "Saldo Disponibile" (e.g., €145.50).
    * "Ricarica Wallet" button (redirects to `/pacchetti`).
* **Stats Row:**
    * "Totale Ricaricato"
    * "Totale Speso"
    * "Risparmiato" (Calculated as: `Total Value Used` - `Real Cash Spent`).
* **Movements List (History):**
    * List of transactions.
    * **Icons:** Arrow Up (Green) for Deposits, Arrow Down (Red) for Payments.
    * **Details:** Date, Description, Amount.

---

## 5. Technical Constraints for AI Developer
1.  **Atomicity:** All wallet balance updates MUST happen within a Database Transaction to prevent race conditions.
2.  **Validation:** Prevent negative balance on `PAYMENT` type transactions.
3.  **Precision:** Use appropriate Decimal types for currency (do not use floating point math).