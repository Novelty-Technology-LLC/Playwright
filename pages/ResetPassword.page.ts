import { expect, type Locator, type Page } from '@playwright/test';

/**
 * 03 — Reset Password at /reset-password
 * therapy-UI: features/auth/pages/SetPassword.tsx
 */
export class ResetPasswordPage {
  readonly page: Page;
  readonly path: string;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.path = '/reset-password';
    this.newPasswordInput = page.locator('#newPassword');
    this.confirmPasswordInput = page.locator('#confirmNewPassword');
    this.submitButton = page.getByRole('button', {
      name: /set password|save|submit|reset/i,
    });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/reset-password/);
    await expect(this.newPasswordInput).toBeVisible({ timeout: 20_000 });
  }

  async setPassword(
    password: string,
    confirm: string = password
  ): Promise<void> {
    await this.newPasswordInput.fill(password);
    await this.confirmPasswordInput.fill(confirm);
    await this.submitButton.click();
  }
}
