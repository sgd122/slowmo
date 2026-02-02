import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heading: Locator;
  readonly subheading: Locator;
  readonly activeSessionCount: Locator;
  readonly newSessionCard: Locator;
  readonly loginButton: Locator;
  readonly recentSessionsHeading: Locator;
  readonly recentSessionsList: Locator;
  readonly viewAllLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: '나태한 모각코', level: 1 });
    this.subheading = page.getByText('느리지만 꾸준하게');
    this.activeSessionCount = page.locator('[class*="활성 세션"]').first();
    this.newSessionCard = page.getByRole('heading', { name: '새 세션 시작' });
    this.loginButton = page.getByRole('link', { name: '로그인 후 시작하기' });
    this.recentSessionsHeading = page.getByRole('heading', { name: '최근 세션' });
    this.recentSessionsList = page.locator('[href^="/session/"]');
    this.viewAllLink = page.getByRole('link', { name: '전체 보기' });
  }

  async goto() {
    await this.navigateTo('/');
  }

  async getActiveSessionCount() {
    const text = await this.page.locator('text=활성 세션').locator('..').locator('div').first().textContent();
    return parseInt(text || '0', 10);
  }

  async getRecentSessionsCount() {
    return this.recentSessionsList.count();
  }

  async clickFirstSession() {
    await this.recentSessionsList.first().click();
  }
}
