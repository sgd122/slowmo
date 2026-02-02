import { test, expect } from '../fixtures';
import { HomePage } from '../pages';

/**
 * 인증된 사용자 테스트
 *
 * 실행 전 인증 설정 필요:
 * pnpm test:e2e:auth
 */
test.describe('Authenticated User', () => {
  test.skip(({ }, testInfo) => {
    // 인증 파일이 없으면 스킵
    const fs = require('fs');
    const path = require('path');
    const authFile = path.join(__dirname, '../../.playwright/.auth/user.json');
    return !fs.existsSync(authFile);
  }, '인증 상태 파일이 없습니다. pnpm test:e2e:auth를 먼저 실행하세요.');

  test('should not show login button when authenticated', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // 로그인 버튼이 숨겨져야 함
    await expect(homePage.nav.login).not.toBeVisible();
  });

  test('should show create session button when authenticated', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // 새 세션 시작 버튼이 있어야 함 (버튼 또는 텍스트)
    const newSessionButton = page.getByText('새 세션 시작');
    await expect(newSessionButton).toBeVisible();
  });

  test('should be able to access profile page', async ({ page }) => {
    await page.goto('/profile');

    // 프로필 페이지 접근 가능 (리다이렉트 안됨)
    await expect(page).toHaveURL('/profile');

    // 프로필 페이지 요소 확인 (홈으로 돌아가기 링크)
    await expect(page.getByRole('link', { name: '홈으로 돌아가기' })).toBeVisible();

    // 참여 세션 통계 표시
    await expect(page.getByText('참여 세션')).toBeVisible();
  });

  test('should show user avatar or profile section', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // 프로필 링크나 아바타가 표시되어야 함
    const profileLink = page.getByRole('link', { name: /프로필/ }).or(
      page.locator('img[alt*="avatar"], img[alt*="profile"], a[href="/profile"]')
    );

    // 적어도 하나는 있어야 함 (네비게이션에 프로필 접근 가능)
    const hasProfileAccess = await profileLink.first().isVisible().catch(() => false);

    // 또는 직접 /profile 접근 가능 확인
    if (!hasProfileAccess) {
      await page.goto('/profile');
      await expect(page).not.toHaveURL('/login');
    }
  });
});
