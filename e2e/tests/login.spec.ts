import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages';

test.describe('Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display heading', async () => {
    await expect(loginPage.heading).toBeVisible();
  });

  test('should display description', async () => {
    await expect(loginPage.description).toBeVisible();
  });

  test('should display GitHub login button', async () => {
    await expect(loginPage.githubButton).toBeVisible();
  });

  test('should display back to home link', async () => {
    await expect(loginPage.backToHomeLink).toBeVisible();
  });

  test('should navigate back to home', async ({ page }) => {
    await loginPage.goBackHome();
    await expect(page).toHaveURL('/');
  });
});
