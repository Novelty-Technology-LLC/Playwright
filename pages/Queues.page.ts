import { expect, type Locator, type Page } from '@playwright/test';

/**
 * 27 — Queues settings at /settings/queues
 * therapy-UI: features/queue/pages/QueueList.tsx
 */
export class QueuesPage {
  readonly page: Page;
  readonly path: string;
  readonly table: Locator;
  readonly autoAssignSwitch: Locator;

  constructor(page: Page) {
    this.page = page;
    this.path = '/settings/queues';
    this.table = page.locator('[data-cy="queue-list-table"]');
    this.autoAssignSwitch = page.locator('[data-cy="switch-auto-assign"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/settings\/queues/);
    await expect(this.table).toBeVisible({ timeout: 20_000 });
  }
}
