import { expect, type Page } from '@playwright/test';

/**
 * 14 — Payment details
 * therapy-UI: features/payments/pages/PaymentDetails.tsx
 * Routes: /payments/payment-details | /billings/payment-details | /authorizations/payment-details
 */
export class PaymentDetailsPage {
  readonly page: Page;
  readonly path: string;

  constructor(page: Page) {
    this.page = page;
    this.path = '/payments/payment-details';
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/payment-details/);
  }
}
