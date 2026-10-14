import { expect, type Locator, type Page } from '@playwright/test';

/**
 * 25 — Roles & Permissions list
 * therapy-UI: features/settings/roles-and-permissions/pages/RolesAndPermissionsList.tsx
 */
export class RolesAndPermissionsPage {
  readonly page: Page;
  readonly path: string;
  readonly table: Locator;

  constructor(page: Page) {
    this.page = page;
    this.path = '/settings/roles-permission-management';
    this.table = page.locator('[data-cy="roles-list-table"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(
      /\/settings\/roles-permission-management/
    );
  }
}
