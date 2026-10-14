import 'dotenv/config';
import { expect, type Locator, type Page } from '@playwright/test';

/**
 * 01 — Login at /login
 * therapy-UI: features/auth/pages/Login.tsx + components/LoginForm.tsx
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly usernameLabel: Locator;
  readonly usernameHelperText: Locator;
  readonly passwordInput: Locator;
  readonly passwordLabel: Locator;
  readonly passwordHelperText: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly forgotPasswordLink: Locator;
  readonly loginButton: Locator;
  readonly loginError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.locator('[data-cy="login_username-input"]');
    this.usernameLabel = page.locator('[data-cy="login_username-label"]');
    this.usernameHelperText = page.locator(
      '[data-cy="login_username-helpertext"]'
    );

    this.passwordInput = page.locator('[data-cy="login_password-input"]');
    this.passwordLabel = page.locator('[data-cy="login_password-label"]');
    this.passwordHelperText = page.locator(
      '[data-cy="login_password-helpertext"]'
    );

    this.rememberMeCheckbox = page.getByLabel('Remember me');
    this.forgotPasswordLink = page.locator('[data-cy="login_forgot-password"]');
    this.loginButton = page.locator('[data-cy="login-btn"]');
    this.loginError = page.locator('[data-cy="login_error-div"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(process.env.LOGIN_PATH || '/login');
    await this.usernameInput.waitFor({ state: 'visible', timeout: 60_000 });
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.usernameInput).toBeVisible({ timeout: 60_000 });
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async checkRememberMe(): Promise<void> {
    await this.rememberMeCheckbox.check();
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  async login(
    username: string,
    password: string,
    options: { rememberMe?: boolean } = {}
  ): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    if (options.rememberMe) {
      await this.checkRememberMe();
    }
    await this.clickLogin();
  }

  async loginWithEnv(): Promise<void> {
    const username = process.env.LOGIN_USERNAME || '';
    const password = process.env.LOGIN_PASSWORD || '';
    await this.login(username, password);
  }

  async expectLoginErrorVisible(): Promise<void> {
    await expect(this.loginError).toBeVisible({ timeout: 20_000 });
  }

  async expectLoginError(text?: string | RegExp): Promise<void> {
    await this.expectLoginErrorVisible();
    if (text) {
      await expect(this.loginError).toContainText(text);
    }
  }

  async expectUsernameRequired(
    message = 'This is a required field'
  ): Promise<void> {
    await expect(this.usernameHelperText).toBeVisible({ timeout: 10_000 });
    await expect(this.usernameHelperText).toContainText(message);
  }

  async expectPasswordRequired(
    message = 'This is a required field'
  ): Promise<void> {
    await expect(this.passwordHelperText).toBeVisible({ timeout: 10_000 });
    await expect(this.passwordHelperText).toContainText(message);
  }

  async expectStillOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }

  async expectSuccessfulLogin(): Promise<void> {
    await expect(this.page).not.toHaveURL(/\/login/, { timeout: 30_000 });
  }
}
