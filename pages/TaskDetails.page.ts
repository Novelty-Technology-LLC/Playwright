import { expect, type Locator, type Page } from '@playwright/test';

/**
 * 07 — Task Details at /dashboard/tasks | /billings/tasks
 * therapy-UI: features/tasks/pages/TasksDetails.tsx
 */
export class TaskDetailsPage {
  readonly page: Page;
  readonly header: Locator;
  readonly title: Locator;
  readonly completeButton: Locator;
  readonly holdChip: Locator;
  readonly assignee: Locator;
  readonly prCodeInputs: Locator;
  readonly assignNoteInput: Locator;
  readonly assignConfirmButton: Locator;
  readonly completeDialog: Locator;
  readonly completeNoteInput: Locator;
  readonly completeConfirmButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.header = page.locator('[data-cy="task-details-header"]');
    this.title = page.locator('[data-cy="task-details-title"]');
    this.completeButton = page.locator('[data-cy="task-complete-button"]');
    this.holdChip = page.locator('[data-cy="task-details-hold-chip"]');
    this.assignee = page.locator('[data-cy="task-details-assignee-display"]');
    this.prCodeInputs = page.locator('input#pr-explanation-autocomplete');
    this.assignNoteInput = page.locator(
      '[data-cy="task-assign-confirm-button-note-input"]'
    );
    this.assignConfirmButton = page.locator(
      '[data-cy="task-assign-confirm-button"]'
    );
    this.completeDialog = page
      .getByRole('dialog')
      .filter({ hasText: 'Complete Task' });
    this.completeNoteInput = this.completeDialog.locator(
      '[data-cy="confirmation-modal-note-input"], #confirmation-modal-note, textarea[placeholder="Type your note here..."]'
    );
    this.completeConfirmButton = this.completeDialog
      .locator('[data-cy="btn_save"]')
      .or(this.completeDialog.getByRole('button', { name: /^Confirm$/i }));
  }

  async expectLoaded(): Promise<void> {
    await expect(this.header).toBeVisible({ timeout: 60_000 });
    await expect(this.completeButton).toBeVisible({ timeout: 60_000 });
  }

  async expectOnHoldForDays(holdDays = 7): Promise<void> {
    const unit = holdDays === 1 ? 'day' : 'days';
    const holdLabel = new RegExp(`On Hold for ${holdDays} ${unit}`, 'i');
    await expect(this.holdChip).toBeVisible({ timeout: 30_000 });
    await expect(this.holdChip).toContainText(holdLabel);
  }

  async assignToMeIfNeeded(
    note = 'this is for automation testing'
  ): Promise<void> {
    const assignTrigger = this.page
      .locator(
        '[data-cy="task-details-assignee-display"], [data-cy="task-list-item-assign-task-to-unassigned"], [data-cy="task-list-item-assign-task-to"]'
      )
      .first();

    if (!(await assignTrigger.count())) return;

    await assignTrigger.click();

    const assignToMe = this.page.getByText(/Assign to me/i).first();
    if (!(await assignToMe.isVisible({ timeout: 3_000 }).catch(() => false))) {
      await this.page.keyboard.press('Escape');
      return;
    }

    await assignToMe.click();

    await expect(this.assignNoteInput).toBeVisible({ timeout: 15_000 });
    await this.assignNoteInput.fill(note);
    await expect(this.assignConfirmButton).toBeEnabled({ timeout: 10_000 });
    await this.assignConfirmButton.click();

    await expect(this.assignNoteInput).toBeHidden({ timeout: 30_000 });
  }

  async setPrCodeOnAllPaymentLines(
    prOptionLabel = '3 Pending: Requesting Medical Records'
  ): Promise<void> {
    await expect(this.prCodeInputs.first()).toBeVisible({ timeout: 60_000 });
    const count = await this.prCodeInputs.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i += 1) {
      const input = this.prCodeInputs.nth(i);
      await input.scrollIntoViewIfNeeded();
      await input.click();
      await input.fill('');
      await input.fill('3 Pending');

      const option = this.page
        .getByRole('option', { name: new RegExp(prOptionLabel, 'i') })
        .first();
      await expect(option).toBeVisible({ timeout: 15_000 });
      await option.click();

      await this.page.waitForLoadState('networkidle').catch(() => {});
      await this.page.waitForTimeout(500);
    }
  }

  async clickComplete(): Promise<void> {
    await expect(this.completeButton).toBeEnabled({ timeout: 60_000 });
    await this.completeButton.click();
  }

  async fillCompleteNoteAndConfirm(
    note = 'completed by automation testing'
  ): Promise<void> {
    await expect(this.completeDialog).toBeVisible({ timeout: 20_000 });

    const noteInput = this.completeNoteInput.first();
    await expect(noteInput).toBeVisible({ timeout: 15_000 });
    await noteInput.click();
    await noteInput.fill(note);
    await expect(noteInput).toHaveValue(note);

    const confirmBtn = this.completeConfirmButton.first();
    await expect(confirmBtn).toBeVisible({ timeout: 10_000 });
    await expect(confirmBtn).toBeEnabled({ timeout: 10_000 });
    await confirmBtn.click();

    await expect(this.completeDialog).toBeHidden({ timeout: 60_000 });
  }

  async completeTaskWithHoldConfirmation(
    note = 'completed by automation testing'
  ): Promise<void> {
    await this.clickComplete();
    await this.fillCompleteNoteAndConfirm(note);
  }
}
