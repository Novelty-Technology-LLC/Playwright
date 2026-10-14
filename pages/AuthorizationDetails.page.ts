import { expect, type Page } from '@playwright/test';

/**
 * 12 — Authorization details
 * therapy-UI: features/authorization/pages/AuthorizationDetails.tsx
 * Routes: /authorizations/authorization-details | /billings/authorization-details | /payments/authorization-details
 */
export class AuthorizationDetailsPage {
  readonly page: Page;
  readonly path: string;

  constructor(page: Page) {
    this.page = page;
    this.path = '/authorizations/authorization-details';
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/authorization-details/);
  }
}
