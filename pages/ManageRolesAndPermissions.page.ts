import { expect, type Page } from '@playwright/test';

/**
 * 26 — Manage Roles & Permissions
 * therapy-UI: features/settings/roles-and-permissions/pages/ManageRolesAndPermissionLists.tsx
 */
export class ManageRolesAndPermissionsPage {
  readonly page: Page;
  readonly path: string;
  readonly userManagementPath: string;

  constructor(page: Page) {
    this.page = page;
    this.path = '/settings/roles-permission-management/manage-roles-and-permissions';
    this.userManagementPath = '/settings/user-management/manage-roles-and-permissions';
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/manage-roles-and-permissions/);
  }
}
