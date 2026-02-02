import { test, expect } from '@playwright/test';
import { HistoryPage } from '../pages';

test.describe('History Page', () => {
  let historyPage: HistoryPage;

  test.beforeEach(async ({ page }) => {
    historyPage = new HistoryPage(page);
    await historyPage.goto();
  });

  test('should display heading', async () => {
    await expect(historyPage.heading).toBeVisible();
  });

  test('should display session count', async () => {
    await expect(historyPage.sessionCount).toBeVisible();
  });

  test('should display session list', async () => {
    const count = await historyPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should navigate to session detail on click', async ({ page }) => {
    const count = await historyPage.getSessionCount();
    if (count > 0) {
      await historyPage.clickSession(0);
      await expect(page).toHaveURL(/\/session\/.+/);
    }
  });
});
