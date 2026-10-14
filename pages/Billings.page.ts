import { expect, type Locator, type Page } from '@playwright/test';

/**
 * 09 — Billings list at /billings
 * therapy-UI: features/claims/pages/ClaimList.tsx
 */
export class BillingsPage {
  readonly page: Page;
  readonly path: string;
  readonly sortControl: Locator;
  readonly headerNav: Locator;

  constructor(page: Page) {
    this.page = page;
    this.path = '/billings';
    this.sortControl = page.locator('[data-cy="claim-sort"]');
    this.headerNav = page.locator('[data-cy="header-billings"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/billings(?!\/)/);
  }
}
