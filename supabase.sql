-- Kjør dette i Supabase → SQL Editor → New query

CREATE TABLE rsvps (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name text        NOT NULL,
  url_param  text,
  attending  boolean     NOT NULL,
  message    text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alle kan sende svar"
  ON rsvps FOR INSERT WITH CHECK (true);

CREATE POLICY "Kun innloggede kan lese"
  ON rsvps FOR SELECT TO authenticated USING (true);
