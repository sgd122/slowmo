# 나태한 모각코 - 웹서비스 개발 계획

## 프로젝트 개요

**서비스명:** 나태한 모각코
**목적:** 모여서 각자 코딩하는 스터디 모임 관리 및 공부 기록 트래킹
**기술 스택:** Next.js 14 (App Router) + Supabase + Tailwind CSS

---

## 핵심 기능

### 1. 세션 관리
- 새 모각코 세션 생성 (날짜, 시작시간 설정)
- 진행 중인 세션 표시
- 과거 세션 히스토리 조회

### 2. 참여자 관리
- 이름 입력으로 간편 참여 (로그인 불필요)
- 기존 멤버 목록에서 선택 가능
- 새 멤버 추가

### 3. 오늘 할 일 기록
- 각 참여자별 "오늘 할 일" 입력
- 실시간 동기화 (다른 멤버 변경사항 즉시 반영)
- 자유로운 메모/잡담 기록

### 4. 타이머 & 시간 측정
- 세션 시작/종료 타이머
- 개인별 공부 시간 자동 측정
- 휴식 시간 기록 (선택)

### 5. 통계 대시보드
- 개인별 총 공부 시간
- 참여 횟수 랭킹
- 주간/월간 통계 차트
- 출석률 표시

---

## 데이터 모델 (Supabase)

### members 테이블
```sql
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  total_study_time INTEGER DEFAULT 0,  -- 분 단위
  session_count INTEGER DEFAULT 0
);
```

### sessions 테이블
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',  -- active, completed
  created_at TIMESTAMP DEFAULT NOW()
);
```

### session_participants 테이블
```sql
CREATE TABLE session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  today_task TEXT,
  notes TEXT,
  join_time TIMESTAMP DEFAULT NOW(),
  leave_time TIMESTAMP,
  study_minutes INTEGER DEFAULT 0,
  UNIQUE(session_id, member_id)
);
```

---

## 페이지 구조

```
/                       # 메인 - 현재 세션 or 세션 생성
/session/[id]           # 세션 상세 - 참여자 목록, 할일 기록
/history                # 과거 세션 히스토리
/stats                  # 통계 대시보드
/members                # 멤버 관리
```

---

## UI/UX 설계

### 메인 페이지 (/)
- 진행 중인 세션이 있으면 바로 표시
- 없으면 "새 세션 시작" 버튼
- 최근 세션 3개 미리보기

### 세션 페이지 (/session/[id])
- 상단: 세션 정보 (날짜, 시작시간, 경과시간)
- 중앙: 참여자 카드 그리드 (스프레드시트 컬럼 → 카드 형태)
  - 각 카드: 이름, 오늘 할 일, 메모
  - 실시간 업데이트 표시
- 하단: 참여하기 버튼 (이름 입력)

### 통계 페이지 (/stats)
- 참여 횟수 랭킹 (막대 차트)
- 총 공부 시간 랭킹
- 주간 참여 현황 (히트맵)
- 개인별 상세 통계

---

## 실시간 동기화 (Supabase Realtime)

```typescript
// 세션 참여자 변경 구독
const channel = supabase
  .channel('session-updates')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'session_participants',
    filter: `session_id=eq.${sessionId}`
  }, handleRealtimeUpdate)
  .subscribe();
```

---

## 구현 단계

### Phase 1: 기본 구조 (Day 1)
- [ ] Next.js 프로젝트 셋업
- [ ] Supabase 프로젝트 생성 및 테이블 구성
- [ ] 기본 레이아웃 및 네비게이션
- [ ] 타입 정의

### Phase 2: 핵심 기능 (Day 2-3)
- [ ] 세션 CRUD
- [ ] 멤버 관리
- [ ] 세션 참여 기능
- [ ] 오늘 할 일 입력/수정

### Phase 3: 실시간 & 타이머 (Day 4)
- [ ] Supabase Realtime 연동
- [ ] 세션 타이머 구현
- [ ] 개인별 시간 측정

### Phase 4: 통계 & 히스토리 (Day 5)
- [ ] 히스토리 페이지
- [ ] 통계 대시보드
- [ ] 차트 구현 (recharts)

### Phase 5: 마무리 (Day 6)
- [ ] UI 폴리싱
- [ ] 반응형 디자인
- [ ] 배포 (Vercel)

---

## 기술 상세

### Dependencies
```json
{
  "next": "^14.0.0",
  "@supabase/supabase-js": "^2.39.0",
  "@supabase/ssr": "^0.1.0",
  "tailwindcss": "^3.4.0",
  "recharts": "^2.10.0",
  "date-fns": "^3.0.0",
  "lucide-react": "^0.300.0"
}
```

### 환경 변수
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 배포

- **Frontend:** Vercel (Next.js 최적화)
- **Database:** Supabase (무료 티어로 충분)
- **도메인:** 선택사항 (Vercel 기본 도메인 사용 가능)

---

## 예상 결과물

스프레드시트의 기능을 웹 앱으로 변환:
- ✅ 멤버별 컬럼 → 카드 UI
- ✅ 오늘 할 일 기록 → 실시간 입력
- ✅ 시간 기록 → 자동 타이머
- ✅ 히스토리 없음 → 날짜별 세션 보관
- ✅ 통계 없음 → 대시보드 추가

---

## 확장 가능성 (Future)

- 카카오/구글 로그인 (선택적)
- 알림 기능 (세션 시작 전 리마인더)
- 목표 설정 & 달성률
- 포모도로 타이머 통합
