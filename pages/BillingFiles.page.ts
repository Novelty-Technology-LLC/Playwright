import { expect, type Locator, type Page } from '@playwright/test';

/**
 * 28 — Billing Files (Companies) at /settings/billing-files
 * therapy-UI: features/company/pages/CompanyList.tsx
 */
export class BillingFilesPage {
  readonly page: Page;
  readonly path: string;
  readonly table: Locator;

  constructor(page: Page) {
    this.page = page;
    this.path = '/settings/billing-files';
    this.table = page.locator('[data-cy="company-list-table"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/settings\/billing-files/);
    await expect(this.table).toBeVisible({ timeout: 20_000 });
  }
}
