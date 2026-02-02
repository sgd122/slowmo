import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class StatsPage extends BasePage {
  readonly heading: Locator;
  readonly description: Locator;
  readonly totalSessions: Locator;
  readonly totalParticipations: Locator;
  readonly totalStudyTime: Locator;
  readonly avgSession: Locator;
  readonly participationRanking: Locator;
  readonly studyTimeRanking: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: '통계', level: 1 });
    this.description = page.getByText('학습 활동과 성과를 한눈에 확인하세요');
    this.totalSessions = page.getByText('총 세션').locator('..');
    this.totalParticipations = page.getByText('총 참여').locator('..');
    this.totalStudyTime = page.getByText('총 공부시간').locator('..');
    this.avgSession = page.getByText('평균 세션').locator('..');
    this.participationRanking = page.getByRole('heading', { name: '참여 횟수 랭킹' });
    this.studyTimeRanking = page.getByRole('heading', { name: '공부 시간 랭킹' });
  }

  async goto() {
    await this.navigateTo('/stats');
  }

  async getStatValue(statName: string) {
    const container = this.page.getByText(statName).locator('..');
    const value = await container.locator('p').nth(1).textContent();
    return value;
  }
}
