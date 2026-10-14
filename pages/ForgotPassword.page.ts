import { expect, type Locator, type Page } from '@playwright/test';

/**
 * 02 — Forgot Password at /forgot-password
 * therapy-UI: features/auth/pages/ForgotPassword.tsx
 */
export class ForgotPasswordPage {
  readonly page: Page;
  readonly path: string;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly backLink: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.page = page;
    this.path = '/forgot-password';
    this.emailInput = page.locator('#username');
    this.submitButton = page.getByRole('button', { name: /send|submit|reset/i });
    this.backLink = page.getByRole('button', { name: /back/i });
    this.error = page.locator('[data-cy="forgot-password_error-div"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/forgot-password/);
    await expect(this.emailInput).toBeVisible({ timeout: 20_000 });
  }

  async submitEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}
