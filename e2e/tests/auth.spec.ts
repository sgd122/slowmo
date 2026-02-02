import { test, expect } from '@playwright/test';
import { LoginPage, HomePage } from '../pages';

test.describe('Authentication Flow', () => {
  test('should display login page correctly', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.heading).toBeVisible();
    await expect(loginPage.githubButton).toBeVisible();
    await expect(loginPage.githubButton).toBeEnabled();
  });

  test('should redirect to GitHub on login click', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // GitHub 버튼 클릭
    await loginPage.githubButton.click();

    // GitHub 로그인 페이지로 리다이렉트 확인
    await expect(page).toHaveURL(/github\.com/, { timeout: 10000 });
  });

  test('should show login button for unauthenticated users', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // 로그인 버튼이 표시되어야 함
    await expect(homePage.nav.login).toBeVisible();
  });
});
