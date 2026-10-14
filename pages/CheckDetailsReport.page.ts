import { expect, type Locator, type Page } from '@playwright/test';

/**
 * 19 — Check Details report at /reports/check-details
 * therapy-UI: features/reports/check-details/pages/CheckDetailsReportPage.tsx
 */
export class CheckDetailsReportPage {
  readonly page: Page;
  readonly path: string;
  readonly table: Locator;
  readonly exportButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.path = '/reports/check-details';
    this.table = page.locator('[data-cy="check-details-table"]');
    this.exportButton = page.locator('[data-cy="reports-export-button"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/reports\/check-details/);
  }
}
