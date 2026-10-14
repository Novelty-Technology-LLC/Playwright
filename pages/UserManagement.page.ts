import { expect, type Locator, type Page } from '@playwright/test';

/**
 * 24 — User Management at /settings/user-management
 * therapy-UI: features/users/pages/UserList.tsx
 */
export class UserManagementPage {
  readonly page: Page;
  readonly path: string;
  readonly search: Locator;
  readonly table: Locator;
  readonly advFilterBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.path = '/settings/user-management';
    this.search = page.locator('[data-cy="user-search"]');
    this.table = page.locator('[data-cy="user-list-table"]');
    this.advFilterBtn = page.locator('[data-cy="user-adv-filter-btn"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/settings\/user-management/);
    await expect(this.table).toBeVisible({ timeout: 20_000 });
  }
}
