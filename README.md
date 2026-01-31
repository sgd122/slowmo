# 나태한 모각코 (Slowmo)

실시간 협업 스터디 세션 관리 앱. GitHub 계정으로 로그인하고, 함께 공부하는 시간을 기록하세요.

## Features

- **GitHub OAuth 로그인** - GitHub 계정으로 간편하게 인증
- **실시간 세션** - 스터디 세션 생성 및 참여
- **라이브 업데이트** - Supabase Realtime으로 참여자 현황 실시간 동기화
- **공부 시간 추적** - 개인별/세션별 공부 시간 자동 계산
- **오늘의 목표** - 세션별 오늘 할 일과 메모 기록
- **통계 대시보드** - 멤버별 참여 횟수, 총 공부 시간 시각화

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL + Realtime)
- **Auth**: Supabase Auth (GitHub OAuth)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase 프로젝트

### Installation

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일에 Supabase 정보 입력

# 개발 서버 실행
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Database Setup

1. Supabase 대시보드에서 새 프로젝트 생성
2. `supabase/migrations/` 폴더의 SQL 파일들을 순서대로 실행:
   - `001_initial_schema.sql` - 기본 테이블 (members, sessions, session_participants)
   - `002_github_auth.sql` - GitHub OAuth 필드 추가
   - `003_public_read_policies.sql` - RLS 정책

### GitHub OAuth Setup

1. [GitHub Developer Settings](https://github.com/settings/developers)에서 OAuth App 생성
2. Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`
3. Supabase Dashboard > Authentication > Providers > GitHub 활성화
4. Client ID와 Client Secret 입력

## Scripts

```bash
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run lint     # ESLint 검사
```

## License

ISC
