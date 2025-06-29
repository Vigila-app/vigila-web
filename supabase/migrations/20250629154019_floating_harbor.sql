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