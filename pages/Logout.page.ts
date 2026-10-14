import { expect, type Page } from '@playwright/test';

/**
 * 05 — Logout at /logout
 * therapy-UI: features/auth/pages/Logout.tsx
 */
export class LogoutPage {
  readonly page: Page;
  readonly path: string;

  constructor(page: Page) {
    this.page = page;
    this.path = '/logout';
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectRedirectedToLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/, { timeout: 30_000 });
  }
}
