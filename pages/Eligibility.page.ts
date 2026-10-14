import { expect, type Locator, type Page } from '@playwright/test';

/**
 * 17 — Eligibility at /eligibility
 * therapy-UI: features/eligibility/pages/index.tsx
 */
export class EligibilityPage {
  readonly page: Page;
  readonly path: string;
  readonly headerNav: Locator;

  constructor(page: Page) {
    this.page = page;
    this.path = '/eligibility';
    this.headerNav = page.locator('[data-cy="header-eligibility"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/eligibility/);
  }
}
