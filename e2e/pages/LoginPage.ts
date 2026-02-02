import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly heading: Locator;
  readonly description: Locator;
  readonly githubButton: Locator;
  readonly backToHomeLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: '로그인', level: 1 });
    this.description = page.getByText('GitHub 계정으로 로그인하세요');
    this.githubButton = page.getByRole('button', { name: 'GitHub로 계속하기' });
    this.backToHomeLink = page.getByRole('link', { name: '← 홈으로 돌아가기' });
  }

  async goto() {
    await this.navigateTo('/login');
  }

  async clickGithubLogin() {
    await this.githubButton.click();
  }

  async goBackHome() {
    await this.backToHomeLink.click();
  }
}
