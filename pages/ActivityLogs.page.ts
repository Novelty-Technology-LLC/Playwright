import { expect, type Locator, type Page } from '@playwright/test';

/**
 * 29 — Activity Logs at /settings/activity-log
 * therapy-UI: features/activity-logs/pages/ActivityLogList.tsx
 */
export class ActivityLogsPage {
  readonly page: Page;
  readonly path: string;
  readonly systemPath: string;
  readonly table: Locator;
  readonly exactSearchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.path = '/settings/activity-log';
    this.systemPath = '/settings/activity-log/system';
    this.table = page.locator('[data-cy="activity-list-table"]');
    this.exactSearchButton = page.locator(
      '[data-cy="activity-logs-exact-search-button"]'
    );
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async gotoSystem(): Promise<void> {
    await this.page.goto(this.systemPath);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/settings\/activity-log/);
  }
}
