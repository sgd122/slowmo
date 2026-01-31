-- =====================================================
-- RLS 정책 수정 - 보안 강화
-- =====================================================

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Allow all for members" ON members;
DROP POLICY IF EXISTS "Allow all for sessions" ON sessions;
DROP POLICY IF EXISTS "Allow all for session_participants" ON session_participants;

-- =====================================================
-- members 테이블 정책
-- =====================================================
-- 모든 인증된 사용자가 읽기 가능
CREATE POLICY "Members are viewable by authenticated users"
  ON members FOR SELECT
  TO authenticated
  USING (true);

-- 자신의 프로필만 수정 가능
CREATE POLICY "Users can update own member profile"
  ON members FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 자신의 프로필만 삭제 가능
CREATE POLICY "Users can delete own member profile"
  ON members FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- 서비스 역할만 INSERT 가능 (OAuth 콜백에서 생성)
CREATE POLICY "Service role can insert members"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- sessions 테이블 정책
-- =====================================================
-- 모든 인증된 사용자가 읽기 가능
CREATE POLICY "Sessions are viewable by authenticated users"
  ON sessions FOR SELECT
  TO authenticated
  USING (true);

-- 인증된 사용자가 세션 생성 가능
CREATE POLICY "Authenticated users can create sessions"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 세션 참여자만 세션 수정 가능 (종료 등)
CREATE POLICY "Session participants can update sessions"
  ON sessions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM session_participants sp
      JOIN members m ON sp.member_id = m.id
      WHERE sp.session_id = sessions.id
        AND m.user_id = auth.uid()
    )
  );

-- =====================================================
-- session_participants 테이블 정책
-- =====================================================
-- 모든 인증된 사용자가 읽기 가능
CREATE POLICY "Participants are viewable by authenticated users"
  ON session_participants FOR SELECT
  TO authenticated
  USING (true);

-- 자신의 멤버 ID로만 참여 가능
CREATE POLICY "Users can join sessions as themselves"
  ON session_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    member_id IN (
      SELECT id FROM members WHERE user_id = auth.uid()
    )
  );

-- 자신의 참여 정보만 수정 가능
CREATE POLICY "Users can update own participation"
  ON session_participants FOR UPDATE
  TO authenticated
  USING (
    member_id IN (
      SELECT id FROM members WHERE user_id = auth.uid()
    )
  );

-- 자신의 참여 정보만 삭제 가능
CREATE POLICY "Users can delete own participation"
  ON session_participants FOR DELETE
  TO authenticated
  USING (
    member_id IN (
      SELECT id FROM members WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- 비인증 사용자용 읽기 정책 (공개 페이지용)
-- =====================================================
CREATE POLICY "Public can view sessions"
  ON sessions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can view members"
  ON members FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can view participants"
  ON session_participants FOR SELECT
  TO anon
  USING (true);
