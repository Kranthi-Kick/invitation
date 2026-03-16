/*
  # Add Country Column to RSVP Responses

  1. Changes
    - Add `country` column to `rsvp_responses` table to store guest location
    - Column will default to empty string for backwards compatibility
    - This allows sorting and filtering RSVPs by country
  
  2. Notes
    - Country will be auto-detected from geolocation in the frontend
    - Existing records will have empty country until updated
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rsvp_responses' AND column_name = 'country'
  ) THEN
    ALTER TABLE rsvp_responses ADD COLUMN country text DEFAULT '';
  END IF;
END $$;