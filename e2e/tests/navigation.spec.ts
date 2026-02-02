import { test, expect } from '@playwright/test';
import { HomePage, HistoryPage, StatsPage, MembersPage, LoginPage } from '../pages';

test.describe('Navigation', () => {
  test('should navigate between pages via navbar', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Home -> History
    await homePage.goToHistory();
    await expect(page).toHaveURL('/history');

    // History -> Stats
    const historyPage = new HistoryPage(page);
    await historyPage.goToStats();
    await expect(page).toHaveURL('/stats');

    // Stats -> Members
    const statsPage = new StatsPage(page);
    await statsPage.goToMembers();
    await expect(page).toHaveURL('/members');

    // Members -> Login
    const membersPage = new MembersPage(page);
    await membersPage.goToLogin();
    await expect(page).toHaveURL('/login');

    // Login -> Home
    const loginPage = new LoginPage(page);
    await loginPage.goToHome();
    await expect(page).toHaveURL('/');
  });

  test('should have correct page title', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    expect(await homePage.getTitle()).toBe('나태한 모각코');
  });
});
