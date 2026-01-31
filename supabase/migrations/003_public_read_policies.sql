-- Allow public (anonymous) read access for stats and session viewing

-- Members: Allow public SELECT for stats display
DROP POLICY IF EXISTS "members_select_authenticated" ON members;
CREATE POLICY "members_select_public" ON members
  FOR SELECT TO anon, authenticated
  USING (true);

-- Session Participants: Allow public SELECT for stats and session viewing
DROP POLICY IF EXISTS "participants_select_authenticated" ON session_participants;
CREATE POLICY "participants_select_public" ON session_participants
  FOR SELECT TO anon, authenticated
  USING (true);

-- Sessions: Allow public SELECT (should already exist but ensuring)
DROP POLICY IF EXISTS "sessions_select_public" ON sessions;
CREATE POLICY "sessions_select_public" ON sessions
  FOR SELECT TO anon, authenticated
  USING (true);
