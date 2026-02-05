import { createServerClient } from '@/lib/supabase/server'
import { createBrowserClient } from '@/lib/supabase/client'
import type { Member } from '@/types'

export async function getUser() {
  const supabase = await createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function getCurrentMember(): Promise<Member | null> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: member } = await supabase
    .from('members')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return member
}

export async function signOut() {
  const supabase = createBrowserClient()
  await supabase.auth.signOut()
}

// GitHub Organization 멤버십 확인 (서버 사이드)
export async function checkGitHubOrgMembership(
  accessToken: string,
  orgName: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.github.com/orgs/${orgName}/members`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github+json',
        },
        next: { revalidate: 3600 }, // 1시간 캐시 (조직 멤버십은 자주 변경되지 않음)
      }
    )

    return response.status === 200
  } catch {
    return false
  }
}

// 사용자의 GitHub Organization 목록 조회
export async function getUserGitHubOrgs(accessToken: string): Promise<string[]> {
  try {
    const response = await fetch('https://api.github.com/user/orgs', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
      },
      next: { revalidate: 3600 }, // 1시간 캐시 (조직 목록은 자주 변경되지 않음)
    })

    if (!response.ok) {
      return []
    }

    const orgs = await response.json()
    return orgs.map((org: { login: string }) => org.login)
  } catch {
    return []
  }
}
