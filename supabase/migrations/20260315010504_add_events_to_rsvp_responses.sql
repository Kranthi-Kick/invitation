/*
  # Add Events Column to RSVP Responses

  1. Changes
    - Add `events` column to `rsvp_responses` table
      - Type: text array (text[])
      - Purpose: Store which events the guest will attend (e.g., ["Mehndi Night", "Wedding Ceremony"])
      - Default: Empty array

  2. Notes
    - This allows filtering RSVPs by specific events in the dashboard
    - Uses PostgreSQL array type for flexible event storage
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rsvp_responses' AND column_name = 'events'
  ) THEN
    ALTER TABLE rsvp_responses ADD COLUMN events text[] DEFAULT '{}';
  END IF;
END $$;