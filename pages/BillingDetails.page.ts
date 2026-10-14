import { expect, type Page } from '@playwright/test';

/**
 * 10 — Billing / Claim details
 * therapy-UI: features/claims/pages/ClaimDetails.tsx
 * Routes: /billings/billing-details | /authorizations/claim-details | /payments/claim-details
 */
export class BillingDetailsPage {
  readonly page: Page;
  readonly path: string;

  constructor(page: Page) {
    this.page = page;
    this.path = '/billings/billing-details';
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(
      /\/(billings\/billing-details|authorizations\/claim-details|payments\/claim-details)/
    );
  }
}
