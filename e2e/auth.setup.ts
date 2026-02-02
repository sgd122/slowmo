import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { injectSupabaseSession, extractSupabaseSession } from './auth-helper';

const authFile = path.join(__dirname, '../.playwright/.auth/user.json');

/**
 * GitHub OAuth 인증 설정
 *
 * 방법 1: 세션 주입 (2FA 사용자 추천)
 *   - 브라우저에서 수동 로그인
 *   - localStorage에서 세션 복사
 *   - .env.local에 TEST_SUPABASE_SESSION 설정
 *
 * 방법 2: 수동 로그인 (첫 실행 시)
 *   - 브라우저가 열리면 60초 내 로그인 완료
 */
setup('authenticate', async ({ page }) => {
  // 방법 1: 환경변수에서 세션 주입 시도
  if (process.env.TEST_SUPABASE_SESSION) {
    console.log('🔐 저장된 세션으로 인증 시도...');

    const success = await injectSupabaseSession(page);
    if (success) {
      await page.goto('/');

      // 로그인 상태 확인
      const loginLink = page.getByRole('link', { name: '로그인', exact: true });
      const isLoggedOut = await loginLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (!isLoggedOut) {
        console.log('✅ 세션 주입 성공!');
        await page.context().storageState({ path: authFile });
        return;
      }
      console.log('⚠️ 세션이 만료되었습니다. 수동 로그인이 필요합니다.');
    }
  }

  // 방법 2: 수동 GitHub 로그인
  console.log('\n🔐 GitHub 로그인을 진행합니다...\n');

  await page.goto('/login');
  await page.getByRole('button', { name: 'GitHub로 계속하기' }).click();

  // GitHub로 리다이렉트 대기
  await page.waitForURL(/github\.com/, { timeout: 10000 });

  console.log('📝 브라우저에서 GitHub 로그인을 완료해주세요 (60초 대기)...');
  console.log('   2FA 인증도 완료해주세요.\n');

  // 로그인 완료 대기 (localhost로 돌아올 때까지)
  await page.waitForURL(/localhost:3000/, { timeout: 60000 });

  // 로그인 성공 확인
  await expect(
    page.getByRole('link', { name: '로그인', exact: true })
  ).not.toBeVisible({ timeout: 10000 });

  // 세션 추출 및 출력 (다음 실행을 위해)
  const session = await extractSupabaseSession(page);
  if (session) {
    console.log('\n💾 다음을 .env.local에 추가하면 자동 로그인됩니다:');
    console.log('─'.repeat(60));
    console.log(`TEST_SUPABASE_SESSION='${session}'`);
    console.log('─'.repeat(60));
  }

  // 인증 상태 저장
  await page.context().storageState({ path: authFile });
  console.log('\n✅ 인증 상태가 저장되었습니다:', authFile);
});
