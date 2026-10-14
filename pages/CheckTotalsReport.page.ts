import { expect, type Locator, type Page } from '@playwright/test';

/**
 * 20 — Check Totals report at /reports/check-totals
 * therapy-UI: features/reports/check-totals/pages/CheckTotalsReportPage.tsx
 */
export class CheckTotalsReportPage {
  readonly page: Page;
  readonly path: string;
  readonly table: Locator;

  constructor(page: Page) {
    this.page = page;
    this.path = '/reports/check-totals';
    this.table = page.locator('[data-cy="check-total-table"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/reports\/check-totals/);
  }
}
