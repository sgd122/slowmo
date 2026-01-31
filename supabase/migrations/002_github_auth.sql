-- =====================================================
-- GitHub OAuth Integration Migration
-- =====================================================

-- 1. members 테이블에 인증 관련 컬럼 추가
ALTER TABLE members
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS github_username VARCHAR(255),
  ADD COLUMN IF NOT EXISTS github_id BIGINT;

-- 2. 인덱스 추가
CREATE UNIQUE INDEX IF NOT EXISTS idx_members_user_id ON members (user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_members_github_id ON members (github_id) WHERE github_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_members_email ON members (email);

-- 3. 기존 RLS 정책 삭제 후 새로운 정책 생성
DROP POLICY IF EXISTS "Allow all for members" ON members;
DROP POLICY IF EXISTS "Allow all for sessions" ON sessions;
DROP POLICY IF EXISTS "Allow all for session_participants" ON session_participants;

-- 4. 새로운 RLS 정책 (인증된 사용자만 접근 가능)
-- Members: 읽기는 모든 인증 사용자, 수정은 본인만
CREATE POLICY "members_select_authenticated" ON members
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "members_insert_authenticated" ON members
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "members_update_own" ON members
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "members_delete_own" ON members
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Sessions: 인증된 사용자는 모두 읽기/생성 가능
CREATE POLICY "sessions_select_authenticated" ON sessions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "sessions_insert_authenticated" ON sessions
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "sessions_update_authenticated" ON sessions
  FOR UPDATE TO authenticated
  USING (true);

-- Session Participants: 인증된 사용자는 모두 읽기 가능, 본인 참여만 수정 가능
CREATE POLICY "participants_select_authenticated" ON session_participants
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "participants_insert_authenticated" ON session_participants
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = session_participants.member_id
      AND members.user_id = auth.uid()
    )
  );

CREATE POLICY "participants_update_own" ON session_participants
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = session_participants.member_id
      AND members.user_id = auth.uid()
    )
  );

CREATE POLICY "participants_delete_own" ON session_participants
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = session_participants.member_id
      AND members.user_id = auth.uid()
    )
  );

-- 5. 새 사용자 가입 시 자동으로 member 레코드 생성하는 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.members (user_id, email, name, nickname, avatar_url, github_username, github_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'user_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'user_name',
    (NEW.raw_user_meta_data->>'provider_id')::BIGINT
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    avatar_url = EXCLUDED.avatar_url,
    github_username = EXCLUDED.github_username,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 트리거 생성 (새 사용자 가입 시 자동 member 생성)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
