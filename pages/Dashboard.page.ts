import { expect, type Locator, type Page } from '@playwright/test';

/**
 * 06 — Dashboard at /dashboard (Admin / Representative via DashboardAuth)
 * therapy-UI: features/dashboard/pages/Dashboard.tsx | RepresentativeDashboard.tsx
 */
export class DashboardPage {
  readonly page: Page;
  readonly summaryList: Locator;
  readonly queueList: Locator;
  readonly queueCards: Locator;
  readonly queueHeaders: Locator;
  readonly queueCounts: Locator;
  readonly queueTaskSearch: Locator;
  readonly queueTaskList: Locator;
  readonly searchInput: Locator;
  readonly taskFilterSection: Locator;
  readonly taskStateFilterChips: Locator;
  readonly allFilter: Locator;
  readonly activeFilter: Locator;
  readonly onHoldFilter: Locator;
  readonly sortBySection: Locator;
  readonly userFiltersSection: Locator;
  readonly clearFiltersLink: Locator;
  readonly taskListItems: Locator;
  readonly taskListItemButtons: Locator;
  readonly workStatusSelect: Locator;

  constructor(page: Page) {
    this.page = page;

    this.summaryList = page.locator('#summary-list');
    this.queueList = page.locator('#queue-list');
    this.queueCards = page.locator('#single-queue');
    this.queueHeaders = page.locator('[data-cy="queue-header"]');
    this.queueCounts = page.locator('[data-cy="queue-count"]');
    this.queueTaskSearch = page.locator('#queue-task-search');
    this.queueTaskList = page.locator('#queue-task-list');
    this.searchInput = page.locator('[data-cy="search-input"]');
    this.taskFilterSection = page.locator('[data-cy="task-filter-section"]');
    this.taskStateFilterChips = page.locator(
      '[data-cy="task-state-filter-chips"]'
    );
    this.allFilter = page.locator('[data-cy="all-filter"]');
    this.activeFilter = page.locator('[data-cy="active-filter"]');
    this.onHoldFilter = page.locator('[data-cy="on-hold-filter"]');
    this.sortBySection = page.locator('[data-cy="sort-by-section-container"]');
    this.userFiltersSection = page.locator('[data-cy="user-filters-section"]');
    this.clearFiltersLink = page.locator('[data-cy="clear-filters-link"]');
    this.taskListItems = page.locator('[data-cy="task-list-item"]');
    this.taskListItemButtons = page.locator(
      '[data-cy="task-list-item-button"]'
    );
    this.workStatusSelect = page.locator('#workStatusSelect');
  }

  async goto(): Promise<void> {
    await this.page.goto('/dashboard');
  }

  async expectOnDashboard(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/);
  }

  async expectDashboardLoaded(): Promise<void> {
    await this.expectOnDashboard();
    await expect(this.queueList).toBeVisible({ timeout: 20_000 });
  }

  async setWorkStatusAvailable(): Promise<void> {
    await expect(this.workStatusSelect).toBeVisible({ timeout: 20_000 });

    const currentLabel = (await this.workStatusSelect.innerText()).trim();
    if (/^Available$/i.test(currentLabel)) {
      return;
    }

    await this.workStatusSelect.click();
    const availableOption = this.page.getByRole('option', {
      name: /^Available$/i,
    });
    await expect(availableOption).toBeVisible({ timeout: 10_000 });
    await availableOption.click();

    await expect(this.workStatusSelect).toContainText(/Available/i, {
      timeout: 20_000,
    });
  }

  async expectSummaryMetricsVisible(): Promise<void> {
    await expect(this.summaryList).toBeVisible({ timeout: 20_000 });
    await expect(this.summaryList.getByText('Billings')).toBeVisible();
    await expect(this.summaryList.getByText('Representatives')).toBeVisible();
    await expect(this.summaryList.getByText('Tasks')).toBeVisible();
    await expect(this.summaryList.getByText('Billing Files')).toBeVisible();
  }

  queueHeaderByName(queueName: string): Locator {
    const exactName = new RegExp(
      `^\\s*${queueName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`
    );
    return this.page.locator('[data-cy="queue-header"]').filter({
      hasText: exactName,
    });
  }

  queueByName(queueName: string): Locator {
    return this.queueCards.filter({
      has: this.queueHeaderByName(queueName),
    });
  }

  async ensureQueueInView(
    queueName: string,
    timeoutMs = 30_000
  ): Promise<Locator> {
    await expect(this.queueList).toBeVisible({ timeout: 20_000 });
    await expect(this.queueHeaders.first()).toBeVisible({ timeout: 20_000 });

    const deadline = Date.now() + timeoutMs;
    const header = this.queueHeaderByName(queueName);

    while (Date.now() < deadline) {
      if ((await header.count()) > 0) {
        await header.first().scrollIntoViewIfNeeded();
        await expect(header.first()).toBeVisible({ timeout: 5_000 });
        return this.queueByName(queueName).first();
      }

      const scrolled = await this.queueList.evaluate((root) => {
        const scroller = Array.from(root.querySelectorAll('*')).find(
          (el) =>
            (el as HTMLElement).scrollWidth >
            (el as HTMLElement).clientWidth + 20
        ) as HTMLElement | undefined;
        if (!scroller) return false;
        const before = scroller.scrollLeft;
        scroller.scrollLeft += 500;
        return scroller.scrollLeft > before;
      });

      if (!scrolled) break;
      await this.page.waitForTimeout(150);
    }

    throw new Error(
      `Queue "${queueName}" was not found in the dashboard queue list after scrolling`
    );
  }

  async expectQueueVisible(queueName: string): Promise<void> {
    const queue = await this.ensureQueueInView(queueName);
    await expect(queue).toBeVisible({ timeout: 20_000 });
    await expect(queue.locator('[data-cy="queue-header"]')).toContainText(
      queueName
    );
  }

  async searchTasksInQueue(queueName: string, keyword: string): Promise<void> {
    const queue = await this.ensureQueueInView(queueName);
    const search = queue.locator('[data-cy="search-input"]');
    await expect(search).toBeVisible({ timeout: 20_000 });
    await search.fill(keyword);
  }

  async applyTaskStateFilter(
    queueName: string,
    filter: 'all' | 'active' | 'onHold'
  ): Promise<void> {
    const queue = await this.ensureQueueInView(queueName);
    const filterMap = {
      all: 'all-filter',
      active: 'active-filter',
      onHold: 'on-hold-filter',
    } as const;
    await queue.locator(`[data-cy="${filterMap[filter]}"]`).click();
  }

  async sortBy(queueName: string, sortLabel: string): Promise<void> {
    const queue = await this.ensureQueueInView(queueName);
    await queue.locator(`[data-cy="sort-by-option-${sortLabel}"]`).click();
  }

  async clearFilters(queueName: string): Promise<void> {
    const queue = await this.ensureQueueInView(queueName);
    await queue.locator('[data-cy="clear-filters-link"]').click();
  }

  async expectTaskInQueue(queueName: string, taskName: string): Promise<void> {
    const queue = await this.ensureQueueInView(queueName);
    await this.page.waitForTimeout(800);
    await expect(
      queue.getByText(taskName, { exact: false }).first()
    ).toBeVisible({ timeout: 30_000 });
  }

  async openTaskInQueue(queueName: string, taskName: string): Promise<void> {
    const queue = await this.ensureQueueInView(queueName);
    const taskButton = queue
      .locator('[data-cy="task-list-item-button"]')
      .filter({ hasText: taskName })
      .first();
    await expect(taskButton).toBeVisible({ timeout: 30_000 });
    await taskButton.click();
  }

  async expectTaskInOnHoldFilter(
    queueName: string,
    taskName: string,
    holdDays = 7
  ): Promise<void> {
    const queue = await this.ensureQueueInView(queueName);
    await queue.locator('[data-cy="on-hold-filter"]').click();
    await this.searchTasksInQueue(queueName, taskName);
    await this.page.waitForTimeout(800);

    const taskItem = queue
      .locator('[data-cy="task-list-item"]')
      .filter({ hasText: taskName })
      .first();
    await expect(taskItem).toBeVisible({ timeout: 30_000 });

    const holdChip = taskItem.locator('[data-cy="task-hold-chip"]');
    await expect(holdChip).toBeVisible({ timeout: 20_000 });
    await this.expectHoldChipDuration(holdChip, holdDays);
  }

  async expectHoldChipDuration(
    holdChip: Locator,
    holdDays = 7
  ): Promise<void> {
    const unit = holdDays === 1 ? 'day' : 'days';
    const holdLabel = new RegExp(`On[- ]?Hold for ${holdDays} ${unit}`, 'i');

    const chipText = (await holdChip.innerText()).trim();
    if (holdLabel.test(chipText)) {
      await expect(holdChip).toContainText(holdLabel);
      return;
    }

    await holdChip.hover();
    const tooltip = this.page
      .getByRole('tooltip')
      .filter({ hasText: holdLabel });
    await expect(tooltip).toBeVisible({ timeout: 10_000 });
  }

  async getQueueTaskCount(queueName: string): Promise<string> {
    const queue = await this.ensureQueueInView(queueName);
    const countChip = queue.locator('[data-cy="queue-count"]');
    await expect(countChip).toBeVisible({ timeout: 20_000 });
    return (await countChip.innerText()).trim();
  }
}
