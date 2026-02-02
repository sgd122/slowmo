import { test, expect } from '@playwright/test';
import { StatsPage } from '../pages';

test.describe('Stats Page', () => {
  let statsPage: StatsPage;

  test.beforeEach(async ({ page }) => {
    statsPage = new StatsPage(page);
    await statsPage.goto();
  });

  test('should display heading', async () => {
    await expect(statsPage.heading).toBeVisible();
  });

  test('should display description', async () => {
    await expect(statsPage.description).toBeVisible();
  });

  test('should display total sessions stat', async () => {
    await expect(statsPage.totalSessions).toBeVisible();
  });

  test('should display total participations stat', async () => {
    await expect(statsPage.totalParticipations).toBeVisible();
  });

  test('should display total study time stat', async () => {
    await expect(statsPage.totalStudyTime).toBeVisible();
  });

  test('should display average session stat', async () => {
    await expect(statsPage.avgSession).toBeVisible();
  });

  test('should display participation ranking', async () => {
    await expect(statsPage.participationRanking).toBeVisible();
  });

  test('should display study time ranking', async () => {
    await expect(statsPage.studyTimeRanking).toBeVisible();
  });
});
