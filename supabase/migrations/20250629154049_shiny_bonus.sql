/*
  # Create bookings table

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `service_id` (uuid, foreign key to services)
      - `consumer_id` (uuid, foreign key to auth.users)
      - `vigil_id` (uuid, foreign key to auth.users)
      - `guest_id` (uuid, foreign key to guests, optional)
      - `booking_date` (timestamptz)
      - `service_date` (timestamptz)
      - `duration_hours` (integer)
      - `total_amount` (decimal)
      - `currency` (text)
      - `status` (text)
      - `payment_status` (text)
      - `payment_intent_id` (text, optional)
      - `notes` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `bookings` table
    - Add policies for consumers and vigils to manage their bookings
    - Add policy for reading booking details

  3. Indexes
    - Add indexes for frequently queried columns
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL,
  consumer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vigil_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_id uuid REFERENCES guests(id) ON DELETE SET NULL,
  booking_date timestamptz DEFAULT now(),
  service_date timestamptz NOT NULL,
  duration_hours integer NOT NULL DEFAULT 1,
  total_amount decimal(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'pending',
  payment_intent_id text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies for consumers to manage their bookings
CREATE POLICY "Consumers can view their bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = consumer_id);

CREATE POLICY "Consumers can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = consumer_id);

CREATE POLICY "Consumers can update their bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = consumer_id)
  WITH CHECK (auth.uid() = consumer_id);

-- Policies for vigils to manage bookings for their services
CREATE POLICY "Vigils can view bookings for their services"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = vigil_id);

CREATE POLICY "Vigils can update bookings for their services"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = vigil_id)
  WITH CHECK (auth.uid() = vigil_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_consumer_id ON bookings(consumer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vigil_id ON bookings(vigil_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_date ON bookings(service_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();