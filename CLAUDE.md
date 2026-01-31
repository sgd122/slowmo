# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Slowmo (나태한 모각코)** - A real-time collaborative study session management app built with Next.js 14 and Supabase. Users authenticate via GitHub OAuth, create/join study sessions, and track their study time together.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint check
npm run start    # Start production server
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL + Realtime)
- **Auth**: GitHub OAuth via Supabase Auth
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript (strict mode)

### Key Directories

```
src/
├── actions/          # Server Actions (member.ts, session.ts, participant.ts)
├── app/              # Next.js App Router pages
├── components/       # React components (ui/, session/, auth/, layout/)
├── hooks/            # Custom hooks (useRealtime, useTimer, useDebounce)
├── lib/              # Utilities (auth.ts, supabase/)
├── types/            # TypeScript type definitions
└── middleware.ts     # Auth route protection
```

### Data Model

- **Member**: User profile linked to GitHub OAuth (user_id, github_username, avatar_url)
- **Session**: Study session with status (active/completed), timing, participants
- **SessionParticipant**: Join record with today_task, study_minutes, is_active flag

### Patterns

**Server Actions**: All database mutations in `src/actions/` with `'use server'` directive. Actions check auth via `supabase.auth.getUser()` before mutations.

**Supabase Clients**:
- `createServerClient()` - Server components/actions (from `@/lib/supabase/server`)
- `createBrowserClient()` - Client components (from `@/lib/supabase/client`)

**Auth Flow**: GitHub OAuth → callback at `/auth/callback` → auto-creates member record → redirects to origin

**Realtime**: `useRealtime` hook subscribes to `session_participants` table changes for live updates.

### Path Alias
`@/*` maps to `./src/*`

## Database Migrations

Located in `supabase/migrations/`. Apply via Supabase CLI or dashboard.
