import { expect, type Locator, type Page } from '@playwright/test';

/**
 * 18 — Missing PR Explanation report
 * therapy-UI: features/reports/missing-pr-explanation/pages/MissingPRExplanationPage.tsx
 */
export class MissingPRExplanationReportPage {
  readonly page: Page;
  readonly path: string;
  readonly table: Locator;

  constructor(page: Page) {
    this.page = page;
    this.path = '/reports/missing-pr-explanations';
    this.table = page.locator('[data-cy="missing-pr-explanation-table"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/reports\/missing-pr-explanations/);
    await expect(this.table).toBeVisible({ timeout: 20_000 });
  }
}
