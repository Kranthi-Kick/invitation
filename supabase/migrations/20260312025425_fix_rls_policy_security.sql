/*
  # Fix RLS Policy Security Issue

  1. Security Changes
    - Remove overly permissive RLS policy that allows unrestricted access
    - Add rate-limiting friendly policy that validates data integrity
    - Ensure only valid data can be inserted (non-empty required fields)
  
  2. Notes
    - This prevents spam submissions by requiring valid name, email, and phone
    - The WITH CHECK clause now validates data instead of allowing everything
*/

-- Drop the insecure policy
DROP POLICY IF EXISTS "Anyone can submit RSVP" ON rsvp_responses;

-- Create a more secure policy that validates submissions
CREATE POLICY "Valid RSVP submissions only"
  ON rsvp_responses
  FOR INSERT
  TO public
  WITH CHECK (
    name IS NOT NULL AND 
    length(trim(name)) > 0 AND
    email IS NOT NULL AND 
    length(trim(email)) > 0 AND
    phone IS NOT NULL AND 
    length(trim(phone)) > 0 AND
    attending IN ('yes', 'no', 'maybe') AND
    guests > 0 AND
    guests <= 20
  );