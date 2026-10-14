import { expect, type Locator, type Page } from '@playwright/test';

/**
 * 11 — Authorizations list at /authorizations
 * therapy-UI: features/authorization/pages/AuthorizationList.tsx
 */
export class AuthorizationsPage {
  readonly page: Page;
  readonly path: string;
  readonly sortControl: Locator;
  readonly headerNav: Locator;

  constructor(page: Page) {
    this.page = page;
    this.path = '/authorizations';
    this.sortControl = page.locator('[data-cy="authorization-sort"]');
    this.headerNav = page.locator('[data-cy="header-authorizations"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/authorizations(?!\/)/);
  }
}
