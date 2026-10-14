import { expect, type Page } from '@playwright/test';

/**
 * 22 — Outstanding report at /reports/outstanding
 * therapy-UI: features/reports/outstanding/pages/OutstandingPage.tsx
 */
export class OutstandingReportPage {
  readonly page: Page;
  readonly path: string;

  constructor(page: Page) {
    this.page = page;
    this.path = '/reports/outstanding';
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/reports\/outstanding(?!\/)/);
  }
}
