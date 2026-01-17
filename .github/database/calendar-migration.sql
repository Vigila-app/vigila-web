-- =====================================================
-- CALENDAR & AVAILABILITY SYSTEM MIGRATION
-- =====================================================
-- Purpose: Add calendar and availability management for Vigils
-- Tables: vigil_availability_rules, vigil_unavailabilities
-- Version: 1.0
-- =====================================================

-- =====================================================
-- TABLE: vigil_availability_rules
-- =====================================================
-- Stores weekly recurring availability patterns for Vigils
-- Example: "Every Monday from 9:00 to 17:00"

CREATE TABLE IF NOT EXISTS vigil_availability_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    vigil_id UUID NOT NULL REFERENCES vigils(id) ON DELETE CASCADE,
    weekday SMALLINT NOT NULL CHECK (weekday >= 0 AND weekday <= 6), -- 0=Sunday, 6=Saturday
    start_hour SMALLINT NOT NULL CHECK (start_hour >= 0 AND start_hour <= 23),
    end_hour SMALLINT NOT NULL CHECK (end_hour >= 1 AND end_hour <= 24),
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_to DATE, -- NULL means indefinite
    CONSTRAINT valid_hour_range CHECK (end_hour > start_hour),
    CONSTRAINT valid_date_range CHECK (valid_to IS NULL OR valid_to >= valid_from)
);

-- Index for efficient queries by vigil
CREATE INDEX idx_vigil_availability_rules_vigil_id ON vigil_availability_rules(vigil_id);
-- Composite index for date range queries
CREATE INDEX idx_vigil_availability_rules_dates ON vigil_availability_rules(vigil_id, valid_from, valid_to);
-- Index for weekday lookups
CREATE INDEX idx_vigil_availability_rules_weekday ON vigil_availability_rules(vigil_id, weekday);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vigil_availability_rules_updated_at BEFORE UPDATE
    ON vigil_availability_rules FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- =====================================================
-- TABLE: vigil_unavailabilities
-- =====================================================
-- Stores specific date/time ranges when a Vigil is unavailable
-- These override availability rules (absences, holidays, etc.)

CREATE TABLE IF NOT EXISTS vigil_unavailabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    vigil_id UUID NOT NULL REFERENCES vigils(id) ON DELETE CASCADE,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    reason TEXT,
    CONSTRAINT valid_time_range CHECK (end_at > start_at)
);

-- Index for efficient queries by vigil
CREATE INDEX idx_vigil_unavailabilities_vigil_id ON vigil_unavailabilities(vigil_id);
-- Composite index for time range queries
CREATE INDEX idx_vigil_unavailabilities_time_range ON vigil_unavailabilities(vigil_id, start_at, end_at);
-- Index for finding overlapping unavailabilities
CREATE INDEX idx_vigil_unavailabilities_overlap ON vigil_unavailabilities USING GIST (
    vigil_id,
    tstzrange(start_at, end_at)
);

-- Add updated_at trigger
CREATE TRIGGER update_vigil_unavailabilities_updated_at BEFORE UPDATE
    ON vigil_unavailabilities FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on both tables
ALTER TABLE vigil_availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE vigil_unavailabilities ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: vigil_availability_rules
-- =====================================================

-- Policy: Vigils can view their own availability rules
CREATE POLICY "Vigils can view their own availability rules"
    ON vigil_availability_rules
    FOR SELECT
    USING (auth.uid() = vigil_id);

-- Policy: Vigils can insert their own availability rules
CREATE POLICY "Vigils can insert their own availability rules"
    ON vigil_availability_rules
    FOR INSERT
    WITH CHECK (auth.uid() = vigil_id);

-- Policy: Vigils can update their own availability rules
CREATE POLICY "Vigils can update their own availability rules"
    ON vigil_availability_rules
    FOR UPDATE
    USING (auth.uid() = vigil_id)
    WITH CHECK (auth.uid() = vigil_id);

-- Policy: Vigils can delete their own availability rules
CREATE POLICY "Vigils can delete their own availability rules"
    ON vigil_availability_rules
    FOR DELETE
    USING (auth.uid() = vigil_id);

-- Policy: Consumers can view availability rules (for slot calculation)
-- Note: This is read-only for availability checking
CREATE POLICY "Consumers can view availability rules for booking"
    ON vigil_availability_rules
    FOR SELECT
    USING (true); -- All authenticated users can read for availability checking

-- =====================================================
-- RLS POLICIES: vigil_unavailabilities
-- =====================================================

-- Policy: Vigils can view their own unavailabilities
CREATE POLICY "Vigils can view their own unavailabilities"
    ON vigil_unavailabilities
    FOR SELECT
    USING (auth.uid() = vigil_id);

-- Policy: Vigils can insert their own unavailabilities
CREATE POLICY "Vigils can insert their own unavailabilities"
    ON vigil_unavailabilities
    FOR INSERT
    WITH CHECK (auth.uid() = vigil_id);

-- Policy: Vigils can update their own unavailabilities
CREATE POLICY "Vigils can update their own unavailabilities"
    ON vigil_unavailabilities
    FOR UPDATE
    USING (auth.uid() = vigil_id)
    WITH CHECK (auth.uid() = vigil_id);

-- Policy: Vigils can delete their own unavailabilities
CREATE POLICY "Vigils can delete their own unavailabilities"
    ON vigil_unavailabilities
    FOR DELETE
    USING (auth.uid() = vigil_id);

-- Policy: Consumers can view unavailabilities (for slot calculation)
-- Note: This is read-only for availability checking
CREATE POLICY "Consumers can view unavailabilities for booking"
    ON vigil_unavailabilities
    FOR SELECT
    USING (true); -- All authenticated users can read for availability checking

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function: Get available slots for a vigil in a date range
-- This is a database function that can be called from the API
-- Returns slots that are available considering rules, bookings, and unavailabilities

CREATE OR REPLACE FUNCTION get_available_slots(
    p_vigil_id UUID,
    p_start_date DATE,
    p_end_date DATE,
    p_service_duration_hours INTEGER DEFAULT 1
)
RETURNS TABLE (
    slot_date DATE,
    slot_start_hour INTEGER,
    slot_end_hour INTEGER,
    available BOOLEAN
) AS $$
BEGIN
    -- This function will be implemented in the API layer for flexibility
    -- Kept as a placeholder for potential future optimization
    RAISE NOTICE 'get_available_slots called for vigil % from % to %', p_vigil_id, p_start_date, p_end_date;
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE vigil_availability_rules IS 
'Stores weekly recurring availability patterns for Vigils. Used to define regular working hours (e.g., "Every Monday 9-17"). Granularity is 1 hour.';

COMMENT ON COLUMN vigil_availability_rules.weekday IS 
'Day of week: 0=Sunday, 1=Monday, ..., 6=Saturday. Follows ISO standard.';

COMMENT ON COLUMN vigil_availability_rules.start_hour IS 
'Start hour in 24h format (0-23). Inclusive.';

COMMENT ON COLUMN vigil_availability_rules.end_hour IS 
'End hour in 24h format (1-24). Exclusive. Value 24 means end of day.';

COMMENT ON COLUMN vigil_availability_rules.valid_from IS 
'Start date for this rule. Rule applies from this date forward.';

COMMENT ON COLUMN vigil_availability_rules.valid_to IS 
'End date for this rule. NULL means the rule is valid indefinitely.';

COMMENT ON TABLE vigil_unavailabilities IS 
'Stores specific date/time ranges when a Vigil is unavailable. These OVERRIDE availability rules and prevent bookings. Used for vacations, sick days, etc.';

COMMENT ON COLUMN vigil_unavailabilities.start_at IS 
'Start of unavailability period. Inclusive. Stored in UTC.';

COMMENT ON COLUMN vigil_unavailabilities.end_at IS 
'End of unavailability period. Exclusive. Stored in UTC.';

COMMENT ON COLUMN vigil_unavailabilities.reason IS 
'Optional reason for unavailability (e.g., "Vacation", "Sick leave", "Personal").';

-- =====================================================
-- MIGRATION NOTES
-- =====================================================
-- 1. All times are stored in UTC
-- 2. Slot granularity is 1 hour minimum
-- 3. Unavailabilities have precedence over availability rules
-- 4. Bookings block slots automatically (checked via existing bookings table)
-- 5. RLS ensures Vigils only see/modify their own data
-- 6. Consumers can read rules/unavailabilities for slot calculation but cannot modify
-- 7. The availability engine logic is implemented in the API layer for flexibility
-- =====================================================
