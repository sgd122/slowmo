import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HistoryPage extends BasePage {
  readonly heading: Locator;
  readonly sessionCount: Locator;
  readonly sessionList: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: '히스토리', level: 1 });
    this.sessionCount = page.getByText(/총 \d+개의 세션/);
    this.sessionList = page.locator('[href^="/session/"]');
  }

  async goto() {
    await this.navigateTo('/history');
  }

  async getTotalSessionCount() {
    const text = await this.sessionCount.textContent();
    const match = text?.match(/총 (\d+)개/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async getSessionCount() {
    return this.sessionList.count();
  }

  async clickSession(index: number) {
    await this.sessionList.nth(index).click();
  }
}
