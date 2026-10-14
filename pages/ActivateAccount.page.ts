import { expect, type Locator, type Page } from '@playwright/test';

/**
 * 04 — Activate Account at /activate-account
 * therapy-UI: features/auth/pages/ActivateAccount.tsx
 */
export class ActivateAccountPage {
  readonly page: Page;
  readonly path: string;
  readonly emailInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.path = '/activate-account';
    this.emailInput = page.locator('#email');
    this.newPasswordInput = page.locator('#newPassword');
    this.confirmPasswordInput = page.locator('#confirmNewPassword');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/activate-account/);
  }
}
