import { expect, type Page } from '@playwright/test';

/**
 * 30 — User Profile at /profile and /profile/security
 * therapy-UI: features/profile/pages/UserProfile.tsx
 */
export class ProfilePage {
  readonly page: Page;
  readonly path: string;
  readonly securityPath: string;

  constructor(page: Page) {
    this.page = page;
    this.path = '/profile';
    this.securityPath = '/profile/security';
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async gotoSecurity(): Promise<void> {
    await this.page.goto(this.securityPath);
  }

  async expectOnProfile(): Promise<void> {
    await expect(this.page).toHaveURL(/\/profile(?!\/security)/);
  }

  async expectOnSecurity(): Promise<void> {
    await expect(this.page).toHaveURL(/\/profile\/security/);
  }
}
