-- =====================================================
-- 나태한 모각코 Database Schema
-- =====================================================

-- =====================================================
-- 1. members 테이블
-- =====================================================
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  nickname VARCHAR(30),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  total_study_minutes INTEGER DEFAULT 0,
  session_count INTEGER DEFAULT 0
);

CREATE UNIQUE INDEX idx_members_name_nickname
  ON members (name, COALESCE(nickname, ''));
CREATE INDEX idx_members_name ON members (name);

-- =====================================================
-- 2. sessions 테이블
-- =====================================================
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  max_duration_hours INTEGER DEFAULT 12 CHECK (max_duration_hours <= 12),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_status ON sessions (status);
CREATE INDEX idx_sessions_date ON sessions (date DESC);

-- =====================================================
-- 3. session_participants 테이블
-- =====================================================
CREATE TABLE session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  today_task VARCHAR(500),
  notes VARCHAR(1000),
  join_time TIMESTAMPTZ DEFAULT NOW(),
  leave_time TIMESTAMPTZ,
  study_minutes INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, member_id)
);

CREATE INDEX idx_participants_session ON session_participants (session_id);
CREATE INDEX idx_participants_member ON session_participants (member_id);

-- =====================================================
-- 4. 자동 업데이트 트리거
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_participants_updated_at
  BEFORE UPDATE ON session_participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- 5. RLS 정책 (모든 접근 허용)
-- =====================================================
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for members" ON members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for sessions" ON sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for session_participants" ON session_participants FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- 6. Realtime 활성화
-- =====================================================
ALTER PUBLICATION supabase_realtime ADD TABLE session_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
