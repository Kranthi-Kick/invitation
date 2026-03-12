/*
  # Create RSVP Responses Table

  1. New Tables
    - `rsvp_responses`
      - `id` (uuid, primary key) - Unique identifier for each response
      - `name` (text) - Guest name
      - `email` (text) - Guest email address
      - `phone` (text) - Guest phone number
      - `attending` (text) - Attendance status (yes/no/maybe)
      - `guests` (integer) - Number of guests attending
      - `dietary_restrictions` (text) - Any dietary restrictions
      - `message` (text) - Optional message from guest
      - `created_at` (timestamptz) - Timestamp of submission
  
  2. Security
    - Enable RLS on `rsvp_responses` table
    - Add policy for public insert (anyone can submit RSVP)
    - Add policy for public read (for dashboard display)
*/

CREATE TABLE IF NOT EXISTS rsvp_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  attending text NOT NULL,
  guests integer DEFAULT 1,
  dietary_restrictions text DEFAULT '',
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit RSVP"
  ON rsvp_responses
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view RSVPs"
  ON rsvp_responses
  FOR SELECT
  TO public
  USING (true);