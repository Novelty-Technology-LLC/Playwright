import { expect, type Page } from '@playwright/test';

/**
 * 23 — View Outstanding report at /reports/outstanding/view-report
 * therapy-UI: features/reports/outstanding/pages/ViewOutstandingPageReport.tsx
 */
export class ViewOutstandingReportPage {
  readonly page: Page;
  readonly path: string;

  constructor(page: Page) {
    this.page = page;
    this.path = '/reports/outstanding/view-report';
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/reports\/outstanding\/view-report/);
  }
}
