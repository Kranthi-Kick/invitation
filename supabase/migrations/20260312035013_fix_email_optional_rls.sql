/*
  # Fix RLS Policy to Allow Optional Email

  1. Changes
    - Drop existing INSERT policy that requires email
    - Create new INSERT policy that makes email optional
    - Maintains all other validation rules (name, phone, attending, guests)

  2. Security
    - Still validates required fields: name, phone, attending, guests
    - Email is now optional as intended by the form design
*/

-- Drop the old policy
DROP POLICY IF EXISTS "Valid RSVP submissions only" ON rsvp_responses;

-- Create new policy with optional email
CREATE POLICY "Valid RSVP submissions only"
  ON rsvp_responses
  FOR INSERT
  TO public
  WITH CHECK (
    name IS NOT NULL 
    AND length(TRIM(name)) > 0
    AND phone IS NOT NULL 
    AND length(TRIM(phone)) > 0
    AND attending IN ('yes', 'no', 'maybe')
    AND guests > 0 
    AND guests <= 20
  );
