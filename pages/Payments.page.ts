import { expect, type Locator, type Page } from '@playwright/test';

/**
 * 13 — Payments list at /payments
 * therapy-UI: features/payments/pages/PaymentList.tsx
 */
export class PaymentsPage {
  readonly page: Page;
  readonly path: string;
  readonly sortControl: Locator;
  readonly headerNav: Locator;

  constructor(page: Page) {
    this.page = page;
    this.path = '/payments';
    this.sortControl = page.locator('[data-cy="payment-sort-name"]');
    this.headerNav = page.locator('[data-cy="header-payments"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/payments(?!\/)/);
  }
}
