import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly nav: {
    home: Locator;
    history: Locator;
    stats: Locator;
    members: Locator;
    login: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.nav = {
      home: page.getByRole('link', { name: '홈', exact: true }),
      history: page.getByRole('link', { name: '히스토리', exact: true }),
      stats: page.getByRole('link', { name: '통계', exact: true }),
      members: page.getByRole('link', { name: '멤버', exact: true }),
      login: page.getByRole('link', { name: '로그인', exact: true }),
    };
  }

  async navigateTo(path: string) {
    await this.page.goto(path);
  }

  async goToHome() {
    await this.nav.home.click();
  }

  async goToHistory() {
    await this.nav.history.click();
  }

  async goToStats() {
    await this.nav.stats.click();
  }

  async goToMembers() {
    await this.nav.members.click();
  }

  async goToLogin() {
    await this.nav.login.click();
  }

  async getTitle() {
    return this.page.title();
  }
}
