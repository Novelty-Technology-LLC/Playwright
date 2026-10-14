import { expect, type Page } from '@playwright/test';

/**
 * 31 — Provider Network Form at /provider-network-form
 * therapy-UI: features/network-form/pages/NetworkFormPage.tsx
 * (only in non-app build targets)
 */
export class NetworkFormPage {
  readonly page: Page;
  readonly path: string;

  constructor(page: Page) {
    this.page = page;
    this.path = '/provider-network-form';
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/provider-network-form/);
  }
}
