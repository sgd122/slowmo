import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MembersPage extends BasePage {
  readonly heading: Locator;
  readonly memberCount: Locator;
  readonly memberList: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: '멤버', level: 1 });
    this.memberCount = page.getByText(/총 \d+명/);
    this.memberList = page.locator('[class*="member"]');
  }

  async goto() {
    await this.navigateTo('/members');
  }

  async getMemberCount() {
    const text = await this.memberCount.textContent();
    const match = text?.match(/총 (\d+)명/);
    return match ? parseInt(match[1], 10) : 0;
  }
}
