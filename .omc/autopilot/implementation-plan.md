# 나태한 모각코 - 구현 계획

## 구현 순서

### Phase 1: 프로젝트 셋업 (병렬 실행)
- [x] Task 1.1: Next.js 14 프로젝트 초기화 + 의존성 설치
- [x] Task 1.2: Tailwind CSS 설정
- [x] Task 1.3: Supabase 클라이언트 설정

### Phase 2: 데이터베이스 (순차 실행)
- [ ] Task 2.1: Supabase SQL 스키마 파일 생성

### Phase 3: 기본 구조 (병렬 실행)
- [ ] Task 3.1: 타입 정의 (types/index.ts, types/database.ts)
- [ ] Task 3.2: 상수 정의 (lib/constants.ts)
- [ ] Task 3.3: 유틸리티 함수 (lib/utils/)

### Phase 4: UI 컴포넌트 (병렬 실행)
- [ ] Task 4.1: 기본 UI 컴포넌트 (Button, Input, Card, Modal, etc.)
- [ ] Task 4.2: 레이아웃 컴포넌트 (Header, Navigation)

### Phase 5: Server Actions (병렬 실행)
- [ ] Task 5.1: 세션 액션 (actions/session.ts)
- [ ] Task 5.2: 멤버 액션 (actions/member.ts)
- [ ] Task 5.3: 참여자 액션 (actions/participant.ts)

### Phase 6: 커스텀 훅 (병렬 실행)
- [ ] Task 6.1: useRealtime, useTimer, useLocalStorage

### Phase 7: 세션 컴포넌트 (병렬 실행)
- [ ] Task 7.1: SessionCard, SessionTimer
- [ ] Task 7.2: ParticipantCard, ParticipantGrid
- [ ] Task 7.3: JoinSessionForm, CreateSessionModal, TaskEditor

### Phase 8: 페이지 구현 (병렬 실행)
- [ ] Task 8.1: 메인 페이지 (app/page.tsx)
- [ ] Task 8.2: 세션 상세 페이지 (app/session/[id]/page.tsx)
- [ ] Task 8.3: 히스토리 페이지 (app/history/page.tsx)
- [ ] Task 8.4: 통계 페이지 (app/stats/page.tsx)
- [ ] Task 8.5: 멤버 페이지 (app/members/page.tsx)

### Phase 9: 통계 컴포넌트
- [ ] Task 9.1: RankingChart, StudyTimeChart, WeeklyHeatmap, StatsSummary

### Phase 10: 마무리
- [ ] Task 10.1: 글로벌 스타일 + 레이아웃 완성
- [ ] Task 10.2: 반응형 디자인 적용

## 현재 진행 상태
- Started: Phase 1
