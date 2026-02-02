import { test, expect } from '@playwright/test';
import { HomePage } from '../pages';

test.describe('Home Page', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display main heading', async () => {
    await expect(homePage.heading).toBeVisible();
  });

  test('should display subheading', async () => {
    await expect(homePage.subheading).toBeVisible();
  });

  test('should display new session card', async () => {
    await expect(homePage.newSessionCard).toBeVisible();
  });

  test('should display login button for unauthenticated users', async () => {
    await expect(homePage.loginButton).toBeVisible();
  });

  test('should display recent sessions section', async () => {
    await expect(homePage.recentSessionsHeading).toBeVisible();
  });

  test('should navigate to history via view all link', async ({ page }) => {
    await homePage.viewAllLink.click();
    await expect(page).toHaveURL('/history');
  });

  test('should navigate to login when clicking login button', async ({ page }) => {
    await homePage.loginButton.click();
    await expect(page).toHaveURL('/login');
  });
});
