import { Page } from '@playwright/test';

/**
 * Supabase 세션을 직접 주입하여 인증 상태를 설정합니다.
 *
 * 사용법:
 * 1. 브라우저에서 로그인 후 개발자 도구 > Application > Local Storage 확인
 * 2. sb-<project-ref>-auth-token 값 복사
 * 3. .env.local에 TEST_SUPABASE_SESSION 설정
 */
export async function injectSupabaseSession(page: Page) {
  const session = process.env.TEST_SUPABASE_SESSION;

  if (!session) {
    console.log('⚠️ TEST_SUPABASE_SESSION 환경변수가 없습니다.');
    console.log('브라우저에서 로그인 후 localStorage의 세션을 복사하세요.');
    return false;
  }

  await page.goto('/');

  // Supabase 세션을 localStorage에 주입
  await page.evaluate((sessionData) => {
    // Supabase auth token key 찾기 (sb-*-auth-token 패턴)
    const key = Object.keys(localStorage).find(k => k.includes('-auth-token'))
      || `sb-${window.location.hostname.split('.')[0]}-auth-token`;

    localStorage.setItem(key, sessionData);
  }, session);

  // 페이지 새로고침하여 세션 적용
  await page.reload();

  return true;
}

/**
 * 현재 브라우저의 Supabase 세션을 추출합니다.
 * 콘솔에서 실행: await extractSupabaseSession(page)
 */
export async function extractSupabaseSession(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const key = Object.keys(localStorage).find(k => k.includes('-auth-token'));
    return key ? localStorage.getItem(key) : null;
  });
}
