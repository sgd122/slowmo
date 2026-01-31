# Gemini Context: slowmo 프로젝트

## 프로젝트 개요

이 프로젝트는 "나태한 모각코(slowmo)"라는 이름의 Next.js 기반 웹 애플리케이션입니다. 사용자들이 스터디 세션에 참여하고, 학습 시간을 추적하며, 다른 멤버들의 통계를 확인할 수 있는 생산성 및 스터디 관리 도구입니다.

-   **프레임워크**: [Next.js](https://nextjs.org/) (App Router)
-   **언어**: TypeScript
-   **백엔드 및 데이터베이스**: [Supabase](https://supabase.io/) (PostgreSQL)
-   **스타일링**: [Tailwind CSS](https://tailwindcss.com/) (다크 모드 테마)
-   **인증**: Supabase Auth (GitHub OAuth 포함 가능성 높음)
-   **주요 기능**:
    -   실시간 스터디 세션 참여 및 관리
    -   세션별, 멤버별 학습 시간 및 통계 추적
    -   세션 히스토리 및 멤버 랭킹 조회

## 빌드 및 실행 명령어

프로젝트의 주요 `scripts`는 `package.json`에 정의되어 있습니다.

-   **개발 서버 실행**:
    ```bash
    npm run dev
    ```

-   **프로덕션 빌드**:
    ```bash
    npm run build
    ```

-   **프로덕션 서버 시작**:
    ```bash
    npm run start
    ```

-   **코드 린팅**:
    ```bash
    npm run lint
    ```

## 개발 컨벤션

-   **파일 구조**: 기능/도메인 중심으로 구성되어 있습니다. 예를 들어, 세션 관련 컴포넌트는 `src/components/session/`에, 멤버 관련 액션은 `src/actions/member.ts`에 위치합니다.
-   **데이터 페칭**: Next.js 서버 컴포넌트를 사용하여 서버 사이드에서 데이터를 가져옵니다.
-   **상태 관리**: 클라이언트 사이드 상태는 React Hooks (`useState`, `useEffect`) 및 `use-query-params`와 같은 커스텀 훅을 통해 관리됩니다.
-   **타입스크립트**: 엄격한(strict) 타입 체크를 사용하며, 경로 별칭 (`@/*`)을 `src/*`로 설정하여 사용합니다.
-   **API 통신**: Supabase 클라이언트 라이브러리 (`@supabase/ssr`, `@supabase/supabase-js`)를 사용하여 데이터베이스와 상호작용합니다.
-   **데이터베이스**: 스키마는 `supabase/migrations/`에 SQL 파일로 관리됩니다. `members`, `sessions`, `session_participants` 테이블 간의 관계를 통해 데이터 구조가 정의되어 있습니다. Supabase의 Realtime 기능이 `sessions` 및 `session_participants` 테이블에 활성화되어 있습니다.
