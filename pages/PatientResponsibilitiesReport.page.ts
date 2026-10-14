import { expect, type Locator, type Page } from '@playwright/test';

/**
 * 21 — Patient Responsibilities report
 * therapy-UI: features/reports/patient-responsibilities/pages/PatientResponsibilitiesPage.tsx
 */
export class PatientResponsibilitiesReportPage {
  readonly page: Page;
  readonly path: string;
  readonly table: Locator;

  constructor(page: Page) {
    this.page = page;
    this.path = '/reports/patient-responsibilities';
    this.table = page.locator('[data-cy="patient-responsibility-table"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/reports\/patient-responsibilities/);
  }
}
