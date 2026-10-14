import { expect, type Page } from '@playwright/test';

/**
 * 08 — Bulk Edit Related Billings
 * therapy-UI: features/related-billings/pages/BulkEditRelatedBillings.tsx
 * Routes: /dashboard/related-billings/bulk-edit | /billings/related-billings/bulk-edit
 */
export class BulkEditRelatedBillingsPage {
  readonly page: Page;
  readonly path: string;
  readonly billingPath: string;

  constructor(page: Page) {
    this.page = page;
    this.path = '/dashboard/related-billings/bulk-edit';
    this.billingPath = '/billings/related-billings/bulk-edit';
  }

  async gotoFromDashboard(): Promise<void> {
    await this.page.goto(this.path);
  }

  async gotoFromBillings(): Promise<void> {
    await this.page.goto(this.billingPath);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/related-billings\/bulk-edit/);
  }
}
