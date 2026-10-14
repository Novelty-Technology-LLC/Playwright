import { expect, type Page } from '@playwright/test';

/**
 * 15 — Check Payment details at /payments/check-payment-details
 * therapy-UI: features/payments/pages/CheckPaymentDetails.tsx
 */
export class CheckPaymentDetailsPage {
  readonly page: Page;
  readonly path: string;

  constructor(page: Page) {
    this.page = page;
    this.path = '/payments/check-payment-details';
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/payments\/check-payment-details/);
  }
}
